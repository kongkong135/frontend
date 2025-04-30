<template>
    <div>
      <el-tooltip content="搜索用户" placement="bottom">
        <el-button @click="handleSearch" icon="Search" circle plain></el-button>
      </el-tooltip>
      <div v-if="searchResults.length > 0" class="search-results">
        <div v-for="user in searchResults" :key="user.id" class="user-item">
          <span>{{ user.name }}</span>
          <el-button @click="addFriend(user.id)" type="primary" size="small">添加好友</el-button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { Search } from '@element-plus/icons-vue';
  import { defineComponent, ref } from 'vue';
  import { searchUsers, requestFriendship } from '@/api/service'; // 假设这是你定义的API调用方法
  
  export default defineComponent({
    components: { Search },
    emits: ['search'],
    setup() {
      const searchResults = ref([]);
  
      const handleSearch = async () => {
        try {
          // 获取用户输入的搜索关键字
          const keyword = prompt('请输入搜索关键字:');
          if (!keyword) return;
  
          const conditions = { keyword };
          const results = await searchUsers(conditions);
          searchResults.value = results;
        } catch (error) {
          console.error('搜索用户失败', error);
          ElMessage.error('搜索用户失败');
        }
      };
  
      const addFriend = async (userId) => {
        try {
          await requestFriendship(userId);
          ElMessage.success('好友请求已发送');
        } catch (error) {
          console.error('添加好友失败', error);
          ElMessage.error('添加好友失败');
        }
      };
  
      return {
        handleSearch,
        addFriend,
        searchResults,
        Search,
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
  
  .search-results {
    margin-top: 10px;
  }
  
  .user-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 10px 0;
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  </style>
  