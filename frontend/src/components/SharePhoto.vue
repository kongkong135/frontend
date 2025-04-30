<template>
    <div class="share-photo-container">
      <header class="share-header">
        <h1>分享图片</h1>
        <button @click="backToPhotoDetail" class="back-btn">返回</button>
      </header>
      <div class="friend-list">
        <h3>好友列表</h3>
        <ul v-if="friends.length > 0" class="friends-list">
          <li v-for="(friend, index) in friends" :key="index" class="friend-item">
            <span>{{ friend.name }}</span>
            <el-button @click="sendPhotoToFriend(friend.id)" type="primary" size="small">发送</el-button>
          </li>
        </ul>
        <div v-else class="no-friends">
          暂无好友
        </div>
      </div>
    </div>
  </template>

<script>
import { defineComponent, ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Star } from '@element-plus/icons-vue';
import { getFriends, sendPhoto } from '@/api/service'; // 假设这是你定义的API调用方法
import { ElMessage } from 'element-plus';

export default defineComponent({
  name: 'SharePhoto',
  components: {
    Star
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const friends = ref([]);

    const fetchFriends = async () => {
      try {
        const response = await getFriends();
        friends.value = response.data.friends;
      } catch (error) {
        console.error('获取好友列表失败', error);
        ElMessage.error('获取好友列表失败');
      }
    };

    const backToPhotoDetail = () => {
      router.push({ name: 'PhotoDetail', params: { photoId: route.params.photoId } });
    };

    const sendPhotoToFriend = async (friendId) => {
      try {
        const photoId = route.params.photoId;
        const photoUrl = `${window.location.origin}/photo-detail/${photoId}`; // 假设这是图片详情页的URL
        const requestData = {
          targetUserId: friendId,
          photoUrl: photoUrl
        };
        await sendPhoto(requestData);
        ElMessage.success('图片已发送');
        backToPhotoDetail();
      } catch (error) {
        console.error('发送图片失败', error);
        ElMessage.error('发送图片失败');
      }
    };

    onMounted(() => {
      fetchFriends();
    });

    return {
      friends,
      backToPhotoDetail,
      sendPhotoToFriend
    };
  }
});
</script>

<style scoped>
.share-photo-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  color: white;
}

.share-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: rgba(0, 0, 0, 0.7);
}

.back-btn {
  background-color: #f44336;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.friend-list {
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
}

.friends-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.friend-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

.no-friends {
  text-align: center;
  padding: 1rem;
  color: rgba(255, 255, 255, 0.7);
}
</style>


