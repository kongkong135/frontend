<template>
    <div>
      <div v-if="friends.length">
        <el-card
          v-for="friend in friends"
          :key="friend.id"
          class="box-card"
          @click="selectFriend(friend)"
        >
          <div class="friend-info">
            <span>{{ friend.username }}</span>
            <span>{{ friend.email }}</span>
          </div>
        </el-card>
      </div>
      <div v-else>
        <p>没有朋友</p>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import { ElCard } from 'element-plus';
  import { defineComponent } from 'vue';
  
  export default defineComponent({
    components: {
      ElCard
    },
    data() {
      return {
        friends: []
      };
    },
    mounted() {
      this.fetchFriendList();
    },
    methods: {
      async fetchFriendList() {
        try {
          const response = await axios.post('/api/friend/list', {}, {
            headers: {
              'x-access-token': localStorage.getItem('token') // 假设使用JWT认证
            }
          });
  
          if (response.status === 200) {
            this.friends = response.data.data;
          } else {
            this.$message.error('获取朋友列表失败');
          }
        } catch (error) {
          this.$message.error('获取朋友列表失败');
          console.error(error);
        }
      },
      selectFriend(friend) {
        this.$emit('open-chat', friend);
      }
    }
  });
  </script>
  
  <style>
  .friend-info {
    display: flex;
    justify-content: space-between;
  }
  
  .box-card {
    margin-bottom: 10px;
    cursor: pointer;
  }
  </style>
  