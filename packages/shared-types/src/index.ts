/** 学生任务：在这里定义前后端共享的 TypeScript 类型。 */
export {};

export type Role = "system" | "user" | "assistant";

export interface ChatMessage {
  /** 消息唯一编号 */
  id: string;
  /** 消息发送者 */
  role: Role;
  /** 消息文本内容 */
  content: string;
};

export interface ApiResponse<T> {
  /* 业务状态码，0表示成功 */
  code: number;

  /* 状态说明 */
  message: string;

  /* 接口返回的具体业务数据 */
  data: T;
}

/* 前端发送给后端的聊天请求。*/
export interface ChatRequest {
  messages: ChatMessage[];
}

/* 后端返回给前端的聊天响应。*/
export type ChatResponse = ApiResponse<ChatMessage>;

 /* 创建新消息时，id由程序生成，因此调用者不需要提供id。*/
export type NewChatMessage = Omit<ChatMessage, "id">;

/* 修改消息时，目前只允许修改content。
 * Partial表示content可以不提供。*/
export type UpdateChatMessage = Partial<Pick<ChatMessage, "content">>;
