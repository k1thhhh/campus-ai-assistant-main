import type { ChatMessage, ModelStreamEvent } from "@campus-ai/shared-types";

// 每次 yield 一个事件；调用者通过 for await 持续接收。
export async function* streamConfiguredModel(
  messages: ChatMessage[],
  signal: AbortSignal,
): AsyncGenerator<ModelStreamEvent> {
  const provider = process.env.LLM_PROVIDER ?? "ollama";
  if (provider === "ollama") {
    yield* streamOllama(messages, signal);
  } else if (provider === "bailian") {
    yield* streamBailian(messages, signal);
  } else {
    throw new Error(`不支持的模型提供商：${provider}`);
  }
}

async function* streamOllama(
  messages: ChatMessage[],
  signal: AbortSignal,
): AsyncGenerator<ModelStreamEvent> {
  const baseURL = (process.env.OLLAMA_BASE_URL ?? "http://127.0.0.1:11434").replace(/\/$/, "");
  const response = await fetch(`${baseURL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: process.env.OLLAMA_MODEL ?? "qwen3:8b",
      messages: messages.map(({ role, content }) => ({ role, content })),
      stream: true,
      think: false,
      options: { temperature: 0.5 },
    }),
    signal,
  });

  if (!response.ok || !response.body) {
    await response.body?.cancel();
    throw new Error(`Ollama 调用失败（HTTP ${response.status}），请检查服务与模型名称`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8", { fatal: true });
  let buffer = "";

  try {
    while (true) {
      const { value, done } = await reader.read();
      // 一个汉字可能跨两个网络块，必须连续解码。
      buffer += decoder.decode(value, { stream: !done });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";
      if (done && buffer.trim()) lines.push(buffer);

      for (const line of lines) {
        if (!line.trim()) continue;
        const chunk = JSON.parse(line) as {
          message?: { content?: unknown };
          done?: boolean;
          done_reason?: unknown;
          error?: unknown;
        } | null;
        if (chunk?.error) throw new Error("Ollama 在生成过程中返回错误");

        const text = chunk?.message?.content;
        // 不 trim 增量文本，否则会丢失空格和换行。
        if (typeof text === "string" && text) {
          yield { type: "delta", text };
        }

        if (chunk?.done === true) {
          yield {
            type: "done",
            finishReason: typeof chunk.done_reason === "string" ? chunk.done_reason : "unknown",
          };
          return;
        }
      }
      if (done) throw new Error("Ollama 连接提前结束，回答未完成");
    }
  } finally {
    await reader.cancel().catch(() => undefined);
    reader.releaseLock();
  }
}

/** 百炼（Bailian）占位实现 —— 目前尚未接入 */
async function* streamBailian(
  _messages: ChatMessage[],
  _signal: AbortSignal,
): AsyncGenerator<ModelStreamEvent> {
  throw new Error("百炼（Bailian）暂未实现");
  // 永远不会执行，仅用于满足 require-yield 规则
  yield { type: "done", finishReason: "error" };
}