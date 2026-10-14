import dotenv from "dotenv";
import { fileURLToPath } from "node:url";
import path from "node:path";
//必须在读取任何环境变量之前加载 .env；显式路径保证从任意目录启动都能找到
dotenv.config({ path: path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../.env") });
import express from "express";
import chatRouter from "./routes/chat.js";
// ==========【新增】导入流式聊天路由 ==========
import { chatStreamRouter } from "./routes/chat-stream.js";

const app = express();
const port = Number(process.env.PORT ?? 3000);

app.use(express.json({ limit: "1mb" }));
// ==========【新增】挂载流式路由（放在json解析之后！顺序不能错） ==========
app.use(chatStreamRouter);

const downloadPath = fileURLToPath(new URL("../download", import.meta.url));
app.use("/download", express.static(downloadPath));

app.get("/api/health", (_request, response) => {
  response.json({ message: "server is ready" });
});

app.use(chatRouter);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
