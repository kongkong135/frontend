<template>
    <el-tooltip content="接收好友请求" placement="bottom">
      <el-button @click="handleReceiveFriendRequest" icon="Mail" circle plain></el-button>
    </el-tooltip>
    <div v-if="pendingRequests.length > 0" class="friend-requests">
      <div v-for="request in pendingRequests" :key="request.id" class="request-item">
        <span>{{ request.from.name }} 发送了好友请求</span>
        <div class="request-actions">
          <el-button @click="acceptRequest(request.id)" type="success" size="small">同意</el-button>
          <el-button @click="rejectRequest(request.id)" type="danger" size="small">拒绝</el-button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { Mail } from '@element-plus/icons-vue';
  import { defineComponent, ref } from 'vue';
  import { getPendingFriendRequests, acceptFriendRequest, rejectFriendRequest } from '@/api/service'; // 假设这是你定义的API调用方法
  import { ElMessage } from 'element-plus';
  
  export default defineComponent({
    components: {
      Mail
    },
    emits: ['add-friend'],
    setup() {
      const pendingRequests = ref([]);
  
      const fetchPendingRequests = async () => {
        try {
          const requests = await getPendingFriendRequests();
          pendingRequests.value = requests;
        } catch (error) {
          console.error('获取好友请求失败', error);
          ElMessage.error('获取好友请求失败');
        }
      };
  
      const handleReceiveFriendRequest = () => {
        fetchPendingRequests();
      };
  
      const acceptRequest = async (requestId) => {
        try {
          await acceptFriendRequest(requestId);
          ElMessage.success('已同意好友请求');
          fetchPendingRequests(); // 重新获取好友请求列表
        } catch (error) {
          console.error('同意好友请求失败', error);
          ElMessage.error('同意好友请求失败');
        }
      };
  
      const rejectRequest = async (requestId) => {
        try {
          await rejectFriendRequest(requestId);
          ElMessage.success('已拒绝好友请求');
          fetchPendingRequests(); // 重新获取好友请求列表
        } catch (error) {
          console.error('拒绝好友请求失败', error);
          ElMessage.error('拒绝好友请求失败');
        }
      };
  
      return {
        handleReceiveFriendRequest,
        acceptRequest,
        rejectRequest,
        pendingRequests,
      };
    },
  });
  </script>
  
  <style scoped>
  .el-button {
    --el-button-primary-color: var(--el-color-primary);
    --el-button-primary-bg-color: transparent;
    --el-button-primary-border-color: var(--el-color-primary);
    --el-button-hover-color: var(--el-color-primary);
    --el-button-active-color: var(--el-color-primary);
    font-size: 20px;
  }
  
  .friend-requests {
    margin-top: 10px;
  }
  
  .request-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 10px 0;
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  
  .request-actions {
    display: flex;
    gap: 0.5rem;
  }
  </style>
  