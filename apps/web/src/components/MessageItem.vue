<script setup lang="ts">
import type { ChatMessage } from "@campus-ai/shared-types";
defineProps<{
  message: ChatMessage;
}>();
// 角色名称映射,即把消息角色（system、user、assistant）翻译成前端界面上显示的中文（系统、用户、助手）。
const roleName: Record<ChatMessage["role"], string> = {
  user: "用户",
  assistant: "助手",
  system: "系统",
};
</script>

<template>
  <div class="chat-message">
    <strong>{{ roleName[message.role] }}</strong>
    <p>{{ message.content }}</p>
  </div>
</template>

<style scoped></style>