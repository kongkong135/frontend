<template>
    <div class="photo-detail-container">
      <header class="photo-header">
        <h1>{{ photo.rover.name }} 火星照片详情</h1>
        <div class="photo-controls">
          <button @click="backToExplorer" class="back-btn">返回</button>
          <el-button @click="toggleFavorite" type="primary" icon="Star" circle plain>
            {{ isFavorite ? '取消收藏' : '收藏' }}
          </el-button>
          <el-button @click="sharePhoto" type="success" icon="Share" circle plain></el-button>
        </div>
      </header>
      <div class="photo-content">
        <img :src="photo.img_src" :alt="`Mars Rover Photo ${photo.id}`" class="photo-img">
        <div class="photo-info">
          <p><strong>ID:</strong> {{ photo.id }}</p>
          <p><strong>火星车:</strong> {{ photo.rover.name }}</p>
          <p><strong>相机:</strong> {{ photo.camera.full_name }}</p>
          <p><strong>火星日:</strong> {{ photo.sol }}</p>
          <p><strong>地球日期:</strong> {{ photo.earth_date }}</p>
        </div>
        <div class="comments-section">
          <h3>评论</h3>
          <ul v-if="comments.length > 0" class="comments-list">
            <li v-for="(comment, index) in comments" :key="index" class="comment-item">
              <span>{{ comment.user.name }}: {{ comment.text }}</span>
            </li>
          </ul>
          <div v-else class="no-comments">
            暂无评论
          </div>
          <div class="add-comment">
            <input type="text" v-model="newComment" placeholder="添加评论" class="comment-input">
            <button @click="addComment" :disabled="!newComment" class="add-comment-btn">添加</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  

  <script>
import { defineComponent, ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getPhotoDetails, addCommentToPhoto, toggleFavorite, getComments } from '@/api/service'; // 假设这是你定义的API调用方法
import { ElMessage } from 'element-plus';

export default defineComponent({
  name: 'PhotoDetail',
  components: {
    Star,
    Share
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const photo = ref({});
    const comments = ref([]);
    const newComment = ref('');
    const isFavorite = ref(false);

    const fetchPhotoDetails = async () => {
      try {
        const photoId = route.params.photoId;
        const response = await getPhotoDetails(photoId);
        photo.value = response.data.photo;
        isFavorite.value = photo.value.isFavorite; // 假设照片对象有一个 isFavorite 属性
      } catch (error) {
        console.error('获取照片详情失败', error);
        ElMessage.error('获取照片详情失败');
      }
    };

    const fetchComments = async () => {
      try {
        const photoId = route.params.photoId;
        const response = await getComments(photoId);
        comments.value = response.data.comments;
      } catch (error) {
        console.error('获取评论失败', error);
        ElMessage.error('获取评论失败');
      }
    };

    const addComment = async () => {
      try {
        const photoId = route.params.photoId;
        const commentData = {
          photo_id: photoId,
          text: newComment.value
        };
        await addCommentToPhoto(commentData);
        ElMessage.success('评论已添加');
        newComment.value = '';
        fetchComments();
      } catch (error) {
        console.error('添加评论失败', error);
        ElMessage.error('添加评论失败');
      }
    };

    const toggleFavorite = async () => {
      try {
        const photoId = route.params.photoId;
        await toggleFavorite(photoId);
        isFavorite.value = !isFavorite.value;
        ElMessage.success(`${isFavorite.value ? '已收藏' : '已取消收藏'}`);
      } catch (error) {
        console.error('切换收藏状态失败', error);
        ElMessage.error('切换收藏状态失败');
      }
    };

    const sharePhoto = () => {
      // 打开分享页面
      router.push({ name: 'SharePhoto', params: { photoId: route.params.photoId } });
    };

    const backToExplorer = () => {
      router.push({ name: 'Explorer' });
    };

    onMounted(() => {
      fetchPhotoDetails();
      fetchComments();
    });

    return {
      photo,
      comments,
      newComment,
      isFavorite,
      addComment,
      toggleFavorite,
      sharePhoto,
      backToExplorer
    };
  }
});
</script>


<style scoped>
.photo-detail-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  color: white;
}

.photo-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: rgba(0, 0, 0, 0.7);
}

.photo-controls {
  display: flex;
  gap: 1rem;
}

.back-btn {
  background-color: #f44336;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.photo-content {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  overflow-y: auto;
}

.photo-img {
  width: 80%;
  max-width: 600px;
  height: auto;
  margin-bottom: 1rem;
}

.photo-info {
  width: 80%;
  max-width: 600px;
  text-align: center;
  margin-bottom: 1rem;
}

.comments-section {
  width: 80%;
  max-width: 600px;
  margin-top: 1rem;
}

.comments-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.comment-item {
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

.no-comments {
  text-align: center;
  padding: 1rem;
  color: rgba(255, 255, 255, 0.7);
}

.add-comment {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.comment-input {
  flex: 1;
  padding: 0.5rem;
  border-radius: 4px;
  border: none;
}

.add-comment-btn {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}
</style>

