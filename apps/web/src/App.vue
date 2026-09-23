<script setup lang="ts">
import MessageItem from "./components/MessageItem.vue";
import { useChatStore } from "./stores/chat";
import { ref, watch, nextTick } from "vue";

const chatStore = useChatStore();
// 输入框内容。
const inputText = ref("");
// 消息区域DOM元素。
const messageArea = ref<HTMLElement | null>(null);

/**
 * 发送消息。
 */
async function submitMessage() {
  const content = inputText.value.trim();
  if (!content || chatStore.isSending) {
    return;
  }
  inputText.value = "";
  await chatStore.sendMessage(content);
}

watch(
  () => chatStore.messages.length,
  async () => {
    await nextTick();
    const element = messageArea.value;
    if (element) {
      element.scrollTop = element.scrollHeight;
    }
  },
);
</script>

<template>
  <div class="chat">
    <header><h1>校园AI助手</h1></header>
    <section class="message" ref="messageArea">
      <MessageItem v-for="message in chatStore.messages" :key="message.id" :message="message" />
      <p v-if="chatStore.isSending">正在回复...</p>
    </section>
    <p v-if="chatStore.errorMessage">{{ chatStore.errorMessage }}</p>
    <form @submit.prevent="submitMessage">
      <input type="text" v-model="inputText" placeholder="请输入问题" />
      <button type="submit" :disabled="chatStore.isSending">发送</button>
    </form>
  </div>
</template>

<style scoped></style>
