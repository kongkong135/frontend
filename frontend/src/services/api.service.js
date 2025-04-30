import axios from 'axios';

const   apiUrl = 'http://localhost:8080/api';

//创建axios实例
const apiClient = axios.create({
    baseURL: apiUrl,
    headers: {
        'Content-Type': 'application/json'
        }
});

//请求拦截器 在请求提交前做一些处理
apiClient.interceptors.request.use(config => {
    // 在请求头中添加token
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['x-access-token'] = token;
    }
    return config;
}, error => {
    return Promise.reject(error);
}

);


// 认证相关API
export const authService = {
    // 用户注册
    register(userData) {
      return apiClient.post('/auth/signup', userData);
    },
    
    // 用户登录
    login(credentials) {
      return apiClient.post('/auth/signin', credentials);
    },
    
    // 修改密码
    changePassword(passwordData) {
      return apiClient.post('/auth/change-password', passwordData);
    },
    
    // 登出
    logout() {
      localStorage.removeItem('token');
    }
  };
  
  // NASA API相关服务
  export const nasaService = {
    // 获取火星车列表
    getRovers() {
      return apiClient.get('/nasa/rovers');
    },
    
    // 获取特定火星车详情
    getRoverDetails(roverName) {
      return apiClient.get(`/nasa/rovers/${roverName}`);
    },
    
    // 获取火星车照片
    getPhotos(params) {
      return apiClient.get('/nasa/photos', { params });
    },
    
    // 获取火星车任务清单
    getRoverManifest(roverName) {
      return apiClient.get(`/nasa/manifests/${roverName}`);
    }
  };
  
  // 探索路径相关服务
  export const pathService = {
    // 创建探索路径
    createPath(pathData) {
      return apiClient.post('/paths', pathData);
    },
    
    // 获取用户的所有探索路径
    getUserPaths() {
      return apiClient.get('/paths');
    },
    
    // 获取探索路径详情
    getPathDetails(pathId) {
      return apiClient.get(`/paths/${pathId}`);
    },
    
    // 更新探索路径
    updatePath(pathId, pathData) {
      return apiClient.put(`/paths/${pathId}`, pathData);
    },
    
    // 删除探索路径
    deletePath(pathId) {
      return apiClient.delete(`/paths/${pathId}`);
    },
    
    // 获取公开的探索路径
    getPublicPaths(params) {
      return apiClient.get('/public-paths', { params });
    }
  };
  
  // 管理员相关服务
  export const adminService = {
    // 获取所有用户
    getAllUsers() {
      return apiClient.get('/admin/users');
    },
    
    // 获取用户详情
    getUserDetails(userId) {
      return apiClient.get(`/admin/users/${userId}`);
    },
    
    // 更新用户信息
    updateUser(userId, userData) {
      return apiClient.put(`/admin/users/${userId}`, userData);
    },
    
    // 删除用户
    deleteUser(userId) {
      return apiClient.delete(`/admin/users/${userId}`);
    },
    
    // 获取用户操作日志
    getUserLogs(params) {
      return apiClient.get('/admin/logs', { params });
    },
    
    // 获取系统统计信息
    getSystemStats() {
      return apiClient.get('/admin/stats');
    }
  };
  
  export default {
    auth: authService,
    nasa: nasaService,
    path: pathService,
    admin: adminService
  };
  
