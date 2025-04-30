<template>
  <div class="chat-page">
    <h2>与 {{ friend.username }} 聊天</h2>
    <div class="chat-messages">
      <div v-for="message in messages" :key="message.id" class="message">
        <span>{{ message.sender }}: {{ message.content }}</span>
        <a v-if="message.photoUrl" :href="message.photoUrl" target="_blank" class="photo-link">
          查看图片
        </a>
      </div>
    </div>
    <div class="chat-input">
      <el-input
        v-model="newMessage"
        placeholder="输入消息"
        @keyup.enter="sendMessage"
      >
        <template #append>
          <el-button icon="el-icon-s-promotion" @click="sendMessage"></el-button>
        </template>
      </el-input>
    </div>
  </div>
</template>

  
<script>
import { defineComponent } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElInput, ElButton, ElMessage } from 'element-plus';
import { getFriendInfo, fetchMessages } from '@/api/service'; // 假设这是你定义的API调用方法

export default defineComponent({
  components: {
    ElInput,
    ElButton
  },
  props: {
    friendId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      newMessage: '',
      messages: [],
      friend: {}
    };
  },
  mounted() {
    this.fetchFriendInfo();
    this.fetchMessages();
  },
  methods: {
    async fetchFriendInfo() {
      try {
        const response = await getFriendInfo(this.friendId);
        if (response.status === 200) {
          this.friend = response.data.friend;
        }
      } catch (error) {
        ElMessage.error('获取朋友信息失败');
        console.error(error);
      }
    },
    async fetchMessages() {
      try {
        const response = await fetchMessages(this.friendId);
        if (response.status === 200) {
          this.messages = response.data.messages;
        }
      } catch (error) {
        ElMessage.error('获取消息失败');
        console.error(error);
      }
    },
    async sendMessage() {
      if (!this.newMessage) {
        ElMessage.warning('消息不能为空');
        return;
      }

      try {
        const response = await this.$store.dispatch('sendMessage', { friendId: this.friendId, content: this.newMessage });

        if (response.status === 200) {
          this.newMessage = '';
          this.messages.push(response.data.message);
        }
      } catch (error) {
        ElMessage.error('发送消息失败');
        console.error(error);
      }
    }
  }
});



</script>

  

<style scoped>
.chat-page {
  margin: 20px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
}

.chat-messages {
  height: 300px;
  overflow-y: scroll;
  margin-bottom: 10px;
}

.message {
  margin-bottom: 5px;
}

.chat-input {
  display: flex;
  justify-content: space-between;
}

.photo-link {
  color: #4CAF50;
  text-decoration: none;
  margin-left: 10px;
  cursor: pointer;
}
</style>
