import "dotenv/config";

import express from "express";

const app = express();
const port = Number(process.env.PORT ?? 3000);

//1解析JSON请求体,设置大小上限可避免客户端提交过大的数据
app.use(express.json({ limit: "1mb" }));

//2健康检查用于确认后端和Vite代理已经连通。
app.get("/api/health", (_request, response) => {
  response.json({ message: "server is ready" });
});

//3学生任务：在这里实现聊天接口。
import type { ChatRequest, ChatResponse } from "@campus-ai/shared-types";
app.post("/api/chat", (request, response) => {
  // Partial表示请求中的字段可能缺失，因为外部数据不能完全信任。
  const body = request.body as Partial<ChatRequest>;
  // 先确认messages确实是数组，再取得最后一条消息
  const lastMessage = Array.isArray(body.messages)
    ? body.messages[body.messages.length - 1]
    : undefined;

  // 最后一条消息来自用户，并且content是字符串时，才读取问题。
  const userQuestion =
    lastMessage?.role === "user" && typeof lastMessage.content === "string"
      ? lastMessage.content
      : undefined;

  // 空字符串表示没有收到有效问题。
  if (!userQuestion) {
    const errorResponse: ChatResponse = {
      // 业务状态码：非0表示失败。
      code: 1,
      message: "提交的消息不能为空",
      data: {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "请输入问题后再提交",
      },
    };
    // 返回HTTP 400和JSON数据。
    response.status(400).json(errorResponse);
    return;
  }
  // 创建格式符合ChatResponse的成功响应。
  const successResponse: ChatResponse = {
    // 业务状态码：0表示成功。
    code: 0,
    message: "ok",
    data: {
      id: crypto.randomUUID(),
      role: "assistant",
      content: `我收到了你的问题：“${userQuestion}”。这是后端返回的模拟回复。`,
    },
  };
  // 将成功响应转换为JSON并发送给前端。
  response.json(successResponse);
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

