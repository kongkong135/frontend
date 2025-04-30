<template>
  <div class="admin-container">
    <header class="admin-header">
      <h1>Mars Explorer 管理后台</h1>
      <div class="user-controls">
        <span>管理员: {{ username }}</span>
        <button @click="logout" class="logout-btn">退出</button>
      </div>
    </header>
    
    <div class="admin-content">
      <div class="sidebar">
        <ul class="nav-menu">
          <li @click="activeTab = 'users'" :class="{ active: activeTab === 'users' }">用户管理</li>
          <li @click="activeTab = 'logs'" :class="{ active: activeTab === 'logs' }">用户日志</li>
          <li @click="activeTab = 'stats'" :class="{ active: activeTab === 'stats' }">系统统计</li>
        </ul>
      </div>
      
      <div class="main-content">
        <!-- 用户管理 -->
        <div v-if="activeTab === 'users'" class="tab-content">
          <h2>用户管理</h2>
          
          <div class="search-bar">
            <input type="text" v-model="userSearch" placeholder="搜索用户名或邮箱">
            <button @click="searchUsers" class="search-btn">搜索</button>
          </div>
          
          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>用户名</th>
                  <th>邮箱</th>
                  <th>注册时间</th>
                  <th>上次登录</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in users" :key="user.id">
                  <td>{{ user.id }}</td>
                  <td>{{ user.username }}</td>
                  <td>{{ user.email }}</td>
                  <td>{{ formatDate(user.createdAt) }}</td>
                  <td>{{ formatDate(user.lastLogin) }}</td>
                  <td class="actions">
                    <button @click="editUser(user)" class="edit-btn">编辑</button>
                    <button @click="deleteUser(user.id)" class="delete-btn">删除</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <!-- 编辑用户弹窗 -->
          <div v-if="showEditModal" class="modal">
            <div class="modal-content">
              <h3>编辑用户</h3>
              <form @submit.prevent="saveUser">
                <div class="form-group">
                  <label for="edit-username">用户名</label>
                  <input type="text" id="edit-username" v-model="editingUser.username" required>
                </div>
                <div class="form-group">
                  <label for="edit-email">邮箱</label>
                  <input type="email" id="edit-email" v-model="editingUser.email" required>
                </div>
                <div class="form-group">
                  <label for="edit-password">新密码 (留空表示不修改)</label>
                  <input type="password" id="edit-password" v-model="editingUser.newPassword">
                </div>
                <div class="modal-actions">
                  <button type="button" @click="showEditModal = false" class="cancel-btn">取消</button>
                  <button type="submit" class="save-btn">保存</button>
                </div>
              </form>
            </div>
          </div>
        </div>
        
        <!-- 用户日志 -->
        <div v-if="activeTab === 'logs'" class="tab-content">
          <h2>用户操作日志</h2>
          
          <div class="filters">
            <div class="filter-group">
              <label>用户</label>
              <select v-model="logFilters.userId">
                <option value="">全部用户</option>
                <option v-for="user in users" :key="user.id" :value="user.id">{{ user.username }}</option>
              </select>
            </div>
            <div class="filter-group">
              <label>操作类型</label>
              <select v-model="logFilters.actionType">
                <option value="">全部操作</option>
                <option value="login">登录</option>
                <option value="search">搜索</option>
                <option value="path">路径操作</option>
              </select>
            </div>
            <div class="filter-group">
              <label>日期范围</label>
              <div class="date-range">
                <input type="date" v-model="logFilters.startDate">
                <span>至</span>
                <input type="date" v-model="logFilters.endDate">
              </div>
            </div>
            <button @click="searchLogs" class="search-btn">筛选</button>
          </div>
          
          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>用户</th>
                  <th>操作类型</th>
                  <th>详情</th>
                  <th>IP地址</th>
                  <th>时间</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="log in logs" :key="log.id">
                  <td>{{ log.id }}</td>
                  <td>{{ log.username }}</td>
                  <td>{{ log.actionType }}</td>
                  <td>{{ log.details }}</td>
                  <td>{{ log.ipAddress }}</td>
                  <td>{{ formatDate(log.createdAt) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <!-- 系统统计 -->
        <div v-if="activeTab === 'stats'" class="tab-content">
          <h2>系统统计</h2>
          
          <div class="stats-grid">
            <div class="stat-card">
              <h3>用户总数</h3>
              <div class="stat-value">{{ stats.totalUsers }}</div>
            </div>
            <div class="stat-card">
              <h3>今日活跃用户</h3>
              <div class="stat-value">{{ stats.activeUsersToday }}</div>
            </div>
            <div class="stat-card">
              <h3>本月新增用户</h3>
              <div class="stat-value">{{ stats.newUsersThisMonth }}</div>
            </div>
            <div class="stat-card">
              <h3>API调用总次数</h3>
              <div class="stat-value">{{ stats.totalApiCalls }}</div>
            </div>
            <div class="stat-card">
              <h3>缓存图像数量</h3>
              <div class="stat-value">{{ stats.cachedImages }}</div>
            </div>
            <div class="stat-card">
              <h3>探索路径总数</h3>
              <div class="stat-value">{{ stats.totalPaths }}</div>
            </div>
          </div>
          
          <div class="chart-container">
            <h3>用户活跃度趋势</h3>
            <div class="chart">
              <!-- 这里将来可以集成图表库如Chart.js -->
              <div class="placeholder-chart">图表将在实际实现中显示</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Admin',
  data() {
    return {
      username: '',
      activeTab: 'users',
      users: [],
      logs: [],
      stats: {
        totalUsers: 0,
        activeUsersToday: 0,
        newUsersThisMonth: 0,
        totalApiCalls: 0,
        cachedImages: 0,
        totalPaths: 0
      },
      userSearch: '',
      logFilters: {
        userId: '',
        actionType: '',
        startDate: '',
        endDate: ''
      },
      showEditModal: false,
      editingUser: {
        id: null,
        username: '',
        email: '',
        newPassword: ''
      }
    }
  },
  created() {
    // 获取管理员信息
    if (this.$store.state.user) {
      this.username = this.$store.state.user.username;
    }
    
    // 初始化数据
    this.fetchUsers();
    this.fetchLogs();
    this.fetchStats();
  },
  methods: {
    formatDate(dateString) {
      if (!dateString) return '未知';
      const date = new Date(dateString);
      return date.toLocaleString('zh-CN');
    },
    async fetchUsers() {
      try {
        // 这里应该调用API获取用户列表
        // 模拟数据
        this.users = [
          { id: 1, username: 'admin', email: 'admin@example.com', createdAt: '2025-01-01T00:00:00', lastLogin: '2025-04-10T10:00:00' },
          { id: 2, username: 'user1', email: 'user1@example.com', createdAt: '2025-02-15T00:00:00', lastLogin: '2025-04-09T14:30:00' },
          { id: 3, username: 'user2', email: 'user2@example.com', createdAt: '2025-03-20T00:00:00', lastLogin: '2025-04-08T09:15:00' }
        ];
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    },
    async fetchLogs() {
      try {
        // 这里应该调用API获取日志列表
        // 模拟数据
        this.logs = [
          { id: 1, username: 'user1', actionType: 'login', details: '用户登录', ipAddress: '192.168.1.1', createdAt: '2025-04-10T10:00:00' },
          { id: 2, username: 'user1', actionType: 'search', details: '搜索火星照片: sol=1000', ipAddress: '192.168.1.1', createdAt: '2025-04-10T10:05:00' },
          { id: 3, username: 'user2', actionType: 'login', details: '用户登录', ipAddress: '192.168.1.2', createdAt: '2025-04-09T14:30:00' }
        ];
      } catch (error) {
        console.error('Error fetching logs:', error);
      }
    },
    async fetchStats() {
      try {
        // 这里应该调用API获取统计数据
        // 模拟数据
        this.stats = {
          totalUsers: 10,
          activeUsersToday: 3,
          newUsersThisMonth: 5,
          totalApiCalls: 150,
          cachedImages: 75,
          totalPaths: 12
        };
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    },
    searchUsers() {
      // 这里应该调用API搜索用户
      // 模拟搜索
      if (!this.userSearch) {
        this.fetchUsers();
        return;
      }
      
      this.users = this.users.filter(user => 
        user.username.includes(this.userSearch) || 
        user.email.includes(this.userSearch)
      );
    },
    searchLogs() {
      // 这里应该调用API搜索日志
      // 模拟搜索
      this.fetchLogs();
      // 实际实现中应该根据筛选条件过滤
    },
    editUser(user) {
      this.editingUser = {
        id: user.id,
        username: user.username,
        email: user.email,
        newPassword: ''
      };
      this.showEditModal = true;
    },
    async saveUser() {
      try {
        // 这里应该调用API保存用户信息
        console.log('保存用户:', this.editingUser);
        
        // 更新本地数据
        const index = this.users.findIndex(u => u.id === this.editingUser.id);
        if (index !== -1) {
          this.users[index].username = this.editingUser.username;
          this.users[index].email = this.editingUser.email;
        }
        
        this.showEditModal = false;
      } catch (error) {
        console.error('Error saving user:', error);
      }
    },
    async deleteUser(userId) {
      if (!confirm('确定要删除此用户吗？此操作不可撤销。')) {
        return;
      }
      
      try {
        // 这里应该调用API删除用户
        console.log('删除用户:', userId);
        
        // 更新本地数据
        this.users = this.users.filter(u => u.id !== userId);
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    },
    logout() {
      this.$store.dispatch('logout');
      this.$router.push('/');
    }
  }
}
</script>

<style scoped>
.admin-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  color: white;
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: rgba(0, 0, 0, 0.8);
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

.admin-content {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.sidebar {
  width: 200px;
  background-color: rgba(0, 0, 0, 0.7);
  padding: 1rem 0;
}

.nav-menu {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-menu li {
  padding: 1rem 1.5rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.nav-menu li:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.nav-menu li.active {
  background-color: rgba(255, 255, 255, 0.2);
  border-left: 4px solid #4CAF50;
}

.main-content {
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
  background-color: rgba(0, 0, 0, 0.6);
}

.tab-content {
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 8px;
  padding: 1.5rem;
}

h2 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding-bottom: 0.5rem;
}

.search-bar {
  display: flex;
  margin-bottom: 1rem;
  gap: 0.5rem;
}

.search-bar input {
  flex: 1;
  padding: 0.5rem;
  border-radius: 4px;
  border: none;
}

.search-btn, .edit-btn, .delete-btn, .save-btn, .cancel-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.search-btn {
  background-color: #4CAF50;
  color: white;
}

.table-container {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

.data-table th, .data-table td {
  padding: 0.8rem;
  text-align: left;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.data-table th {
  background-color: rgba(0, 0, 0, 0.3);
}

.data-table tr:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.edit-btn {
  background-color: #2196F3;
  color: white;
}

.delete-btn {
  background-color: #f44336;
  color: white;
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
  background-color: rgba(0, 0, 0, 0.3);
  padding: 1rem;
  border-radius: 4px;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-group select, .filter-group input {
  padding: 0.5rem;
  border-radius: 4px;
  border: none;
}

.date-range {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  background-color: rgba(0, 0, 0, 0.5);
  padding: 1.5rem;
  border-radius: 8px;
  text-align: center;
}

.stat-card h3 {
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1rem;
}

.stat-value {
  font-size: 2rem;
  font-weight: bold;
  color: #4CAF50;
}

.chart-container {
  background-color: rgba(0, 0, 0, 0.5);
  padding: 1.5rem;
  border-radius: 8px;
}

.chart {
  margin-top: 1rem;
  height: 300px;
}

.placeholder-chart {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  color: rgba(255, 255, 255, 0.7);
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: #1a1a1a;
  padding: 2rem;
  border-radius: 8px;
  width: 100%;
  max-width: 500px;
}

.modal-content h3 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding-bottom: 0.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
}

.form-group input {
  width: 100%;
  padding: 0.8rem;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

.save-btn {
  background-color: #4CAF50;
  color: white;
}

.cancel-btn {
  background-color: #9e9e9e;
  color: white;
}
</style>
