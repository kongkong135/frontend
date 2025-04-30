<template>
  <div class="explorer-container">
    <header class="explorer-header">
      <h1>Mars Explorer</h1>
      <div class="user-controls">
        <span>
          <el-header>
            <FriendIcon />
            <!-- 搜索图标 -->
            <SearchIcon />
            <!-- 发送好友请求图标 -->
            <AddFriendIcon />
          </el-header>
        </span>
        <span>欢迎, {{ username }}</span>
        <button @click="logout" class="logout-btn">退出</button>
      </div>
    </header>
    <div class="explorer-content">
      <div class="sidebar">
        <div class="search-filters">
          <h3>搜索筛选</h3>
          <div class="filter-group">
            <label>火星车</label>
            <select v-model="filters.rover">
              <option value="curiosity">Curiosity</option>
              <option value="opportunity">Opportunity</option>
              <option value="spirit">Spirit</option>
            </select>
          </div>
          <div class="filter-group">
            <label>搜索方式</label>
            <div class="radio-group">
              <label>
                <input type="radio" v-model="filters.searchType" value="sol">
                火星日
              </label>
              <label>
                <input type="radio" v-model="filters.searchType" value="earth_date">
                地球日期
              </label>
            </div>
          </div>
          <div v-if="filters.searchType === 'sol'" class="filter-group">
            <label>火星日</label>
            <input type="number" v-model="filters.sol" min="0">
          </div>
          <div v-if="filters.searchType === 'earth_date'" class="filter-group">
            <label>地球日期</label>
            <input type="date" v-model="filters.earthDate">
          </div>
          <div class="filter-group">
            <label>相机</label>
            <select v-model="filters.camera">
              <option value="">全部</option>
              <option value="FHAZ">前危险规避相机</option>
              <option value="RHAZ">后危险规避相机</option>
              <option value="MAST">桅杆相机</option>
              <option value="CHEMCAM">化学相机</option>
              <option value="MAHLI">火星手持镜头成像仪</option>
              <option value="NAVCAM">导航相机</option>
              <option value="PANCAM">全景相机</option>
              <option value="MINITES">微型热发射光谱仪</option>
            </select>
          </div>
          <button @click="searchPhotos" class="search-btn">搜索</button>
        </div>
        <div class="user-paths">
          <h3>我的探索路径</h3>
          <div v-if="userPaths.length === 0" class="no-paths">
            暂无保存的探索路径
          </div>
          <ul v-else class="paths-list">
            <li v-for="(path, index) in userPaths" :key="index" class="path-item">
              <span>{{ path.name }}</span>
              <div class="path-actions">
                <button @click="loadPath(path)" class="load-btn">加载</button>
                <button @click="deletePath(path.id)" class="delete-btn">删除</button>
              </div>
            </li>
          </ul>
          <div class="save-path">
            <input type="text" v-model="newPathName" placeholder="探索路径名称">
            <button @click="savePath" :disabled="!newPathName" class="save-btn">保存当前路径</button>
          </div>
        </div>
      </div>
      <div class="main-content">
        <div v-if="loading" class="loading">
          <div class="spinner"></div>
          <p>正在加载火星照片...</p>
        </div>
        <div v-else-if="photos.length === 0" class="no-photos">
          <p>暂无照片，请调整搜索条件</p>
        </div>
        <div v-else class="photos-grid">
          <div v-for="(photo, index) in photos" :key="photo.id" class="photo-card">
            <div class="photo-container">
              <img :src="photo.img_src" :alt="`Mars Rover Photo ${photo.id}`" class="photo-img" @click="viewPhotoDetail(photo.id)">
            </div>
            <div class="photo-info">
              <p><strong>ID:</strong> {{ photo.id }}</p>
              <p><strong>火星车:</strong> {{ photo.rover.name }}</p>
              <p><strong>相机:</strong> {{ photo.camera.full_name }}</p>
              <p><strong>火星日:</strong> {{ photo.sol }}</p>
              <p><strong>地球日期:</strong> {{ photo.earth_date }}</p>
            </div>
            <div class="photo-actions">
              <div class="tag-input">
                <input type="text" v-model="photo.newTag" placeholder="添加标签">
                <button @click="addTag(photo)" :disabled="!photo.newTag" class="tag-btn">添加</button>
              </div>
              <div class="tags-container">
                <span v-for="(tag, tagIndex) in photo.tags" :key="tagIndex" class="tag">
                  {{ tag }}
                  <button @click="removeTag(photo, tagIndex)" class="remove-tag">×</button>
                </span>
              </div>
              <button @click="addToPath(photo)" class="path-btn">添加到路径</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import FriendIcon from '@/components/FriendIcon.vue';
import SearchIcon from '@/components/SearchIcon.vue';
import AddFriendIcon from '@/components/AddFriendIcon.vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Explorer',
  components: {
    FriendIcon,
    SearchIcon,
    AddFriendIcon
  },
  data() {
    return {
      username: '',
      filters: {
        rover: 'curiosity',
        searchType: 'sol',
        sol: 1000,
        earthDate: new Date().toISOString().split('T')[0],
        camera: ''
      },
      photos: [],
      userPaths: [],
      currentPath: [],
      newPathName: '',
      loading: false
    }
  },
  created() {
    // 获取用户信息
    if (this.$store.state.user) {
      this.username = this.$store.state.user.username;
    }
    
    // 获取用户保存的路径
    this.fetchUserPaths();
    
    // 初始搜索
    this.searchPhotos();
  },
  methods: {
    async searchPhotos() {
      this.loading = true;
      
      try {
        const params = {
          rover: this.filters.rover
        };
        
        if (this.filters.searchType === 'sol') {
          params.sol = this.filters.sol;
        } else {
          params.earth_date = this.filters.earthDate;
        }
        
        if (this.filters.camera) {
          params.camera = this.filters.camera;
        }
        
        const response = await this.$store.dispatch('fetchPhotos', params);
        this.photos = response.data.photos.map(photo => ({
          ...photo,
          tags: [],
          newTag: ''
        }));
      } catch (error) {
        console.error('Error fetching photos:', error);
      } finally {
        this.loading = false;
      }
    },
    async fetchUserPaths() {
      try {
        await this.$store.dispatch('fetchUserPaths');
        this.userPaths = this.$store.state.userPaths;
      } catch (error) {
        console.error('Error fetching user paths:', error);
      }
    },
    addTag(photo) {
      if (photo.newTag.trim()) {
        photo.tags.push(photo.newTag.trim());
        photo.newTag = '';
      }
    },
    removeTag(photo, tagIndex) {
      photo.tags.splice(tagIndex, 1);
    },
    addToPath(photo) {
      // 检查是否已在路径中
      const exists = this.currentPath.some(p => p.id === photo.id);
      if (!exists) {
        this.currentPath.push(photo);
      }
    },
    async savePath() {
      if (!this.newPathName.trim() || this.currentPath.length === 0) {
        return;
      }
      
      try {
        // 这里应该调用API保存路径
        const pathData = {
          name: this.newPathName,
          photos: this.currentPath.map(p => ({
            photo_id: p.id,
            tags: p.tags
          }))
        };
        
        // 假设API调用
        // await axios.post('/api/paths', pathData);
        
        // 重新获取路径
        await this.fetchUserPaths();
        
        // 清空当前路径和名称
        this.currentPath = [];
        this.newPathName = '';
      } catch (error) {
        console.error('Error saving path:', error);
      }
    },
    loadPath(path) {
      // 这里应该调用API获取路径详情
      // 假设已获取到路径详情
      this.currentPath = path.photos;
    },
    async deletePath(pathId) {
      try {
        // 这里应该调用API删除路径
        // await axios.delete(`/api/paths/${pathId}`);
        
        // 重新获取路径
        await this.fetchUserPaths();
      } catch (error) {
        console.error('Error deleting path:', error);
      }
    },
    logout() {
      this.$store.dispatch('logout');
      this.$router.push('/');
    },
    viewPhotoDetail(photoId) {
      this.$router.push({ name: 'PhotoDetail', params: { photoId: photoId } });
    }
  }
});
</script>



<style scoped>
.explorer-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  color: white;
}

.explorer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: rgba(0, 0, 0, 0.7);
}

.user-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logout-btn {
  background-color: #f44336;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.explorer-content {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.sidebar {
  width: 300px;
  background-color: rgba(0, 0, 0, 0.7);
  padding: 1rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.search-filters, .user-paths {
  background-color: rgba(255, 255, 255, 0.1);
  padding: 1rem;
  border-radius: 8px;
}

.filter-group {
  margin-bottom: 1rem;
}

.filter-group label {
  display: block;
  margin-bottom: 0.5rem;
}

.filter-group select, .filter-group input {
  width: 100%;
  padding: 0.5rem;
  border-radius: 4px;
  border: none;
  background-color: rgba(255, 255, 255, 0.9);
}

.radio-group {
  display: flex;
  gap: 1rem;
}

.search-btn, .save-btn, .load-btn, .delete-btn, .tag-btn, .path-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.search-btn {
  background-color: #4CAF50;
  color: white;
  width: 100%;
  margin-top: 1rem;
}

.main-content {
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.spinner {
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top: 4px solid #ffffff;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.no-photos {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-size: 1.2rem;
}

.photos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}

.photo-card {
  background-color: rgba(0, 0, 0, 0.7);
  border-radius: 8px;
  overflow: hidden;
}

.photo-container {
  height: 200px;
  overflow: hidden;
}

.photo-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.photo-info {
  padding: 1rem;
}

.photo-actions {
  padding: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.tag-input {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.tag-input input {
  flex: 1;
  padding: 0.5rem;
  border-radius: 4px;
  border: none;
}

.tag-btn {
  background-color: #2196F3;
  color: white;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.tag {
  background-color: rgba(255, 255, 255, 0.2);
  padding: 0.3rem 0.5rem;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.remove-tag {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 1rem;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.path-btn {
  background-color: #ff9800;
  color: white;
  width: 100%;
}

.paths-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.path-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.path-actions {
  display: flex;
  gap: 0.5rem;
}

.load-btn {
  background-color: #2196F3;
  color: white;
}

.delete-btn {
  background-color: #f44336;
  color: white;
}

.save-path {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.save-path input {
  padding: 0.5rem;
  border-radius: 4px;
  border: none;
}

.save-btn {
  background-color: #4CAF50;
  color: white;
}

.no-paths {
  text-align: center;
  padding: 1rem;
  color: rgba(255, 255, 255, 0.7);
}
</style>
