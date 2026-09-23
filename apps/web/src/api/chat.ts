import type { ChatRequest, ChatResponse } from "@campus-ai/shared-types";
/**
 * 向后端发送聊天请求。
 *
 * @param request 聊天请求，包含消息列表。
 * @returns 后端返回的统一聊天响应。
 * @throws HTTP请求失败或业务状态码不为0时抛出异常。
 */
export async function requestChat(request: ChatRequest): Promise<ChatResponse> {
  // 向Express后端的聊天接口发送POST请求。
  const response = await fetch("/api/chat", {
    method: "POST",
    // 将JavaScript对象转换成JSON字符串。
    body: JSON.stringify(request),
    headers: {
      "Content-Type": "application/json",
    },
  });
  // 将后端返回的JSON转换为JavaScript对象。
  // as ChatResponse只进行TypeScript类型断言，不会校验运行时数据。
  const result = (await response.json()) as ChatResponse;
  // response.ok检查HTTP状态码是否为2xx。
  // result.code检查项目约定的业务状态码是否为0。
  if (!response.ok || result.code !== 0) {
    throw new Error(result.message);
  }
  return result;
}
