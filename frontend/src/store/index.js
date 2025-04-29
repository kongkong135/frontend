// 存储管理
import { createStore } from 'vuex';
import { authService, nasaService, pathService } from '../services/api.service';

const store = createStore({
  state() {
    return {
      // 用户相关
      user: JSON.parse(localStorage.getItem('user')) || null,
      token: localStorage.getItem('token') || null,
      
      // NASA数据
      rovers: [],
      selectedRover: null,
      roverManifest: null,
      photos: [],
      
      // 探索路径
      userPaths: [],
      currentPath: {
        name: '',
        description: '',
        photos: []
      },
      
      // UI状态
      loading: false,
      error: null,
      notification: null
    };
  },
  
  mutations: {
    // 用户相关
    setUser(state, user) {
      state.user = user;
      localStorage.setItem('user', JSON.stringify(user));
    },
    setToken(state, token) {
      state.token = token;
      localStorage.setItem('token', token);
    },
    clearAuth(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
    
    // NASA数据
    setRovers(state, rovers) {
      state.rovers = rovers;
    },
    setSelectedRover(state, rover) {
      state.selectedRover = rover;
    },
    setRoverManifest(state, manifest) {
      state.roverManifest = manifest;
    },
    setPhotos(state, photos) {
      state.photos = photos;
    },
    
    // 探索路径
    setUserPaths(state, paths) {
      state.userPaths = paths;
    },
    setCurrentPath(state, path) {
      state.currentPath = path;
    },
    addPhotoToPath(state, photo) {
      // 检查是否已存在
      const exists = state.currentPath.photos.some(p => p.id === photo.id);
      if (!exists) {
        state.currentPath.photos.push({
          ...photo,
          tags: photo.tags || [],
          notes: ''
        });
      }
    },
    removePhotoFromPath(state, photoId) {
      state.currentPath.photos = state.currentPath.photos.filter(p => p.id !== photoId);
    },
    updatePhotoInPath(state, { photoId, updates }) {
      const index = state.currentPath.photos.findIndex(p => p.id === photoId);
      if (index !== -1) {
        state.currentPath.photos[index] = {
          ...state.currentPath.photos[index],
          ...updates
        };
      }
    },
    clearCurrentPath(state) {
      state.currentPath = {
        name: '',
        description: '',
        photos: []
      };
    },
    
    // UI状态
    setLoading(state, status) {
      state.loading = status;
    },
    setError(state, error) {
      state.error = error;
    },
    setNotification(state, notification) {
      state.notification = notification;
    },
    clearNotification(state) {
      state.notification = null;
    }
  },
  
  actions: {
    // 用户认证
    async register({ commit }, userData) {
      try {
        commit('setLoading', true);
        const response = await authService.register(userData);
        commit('setNotification', {
          type: 'success',
          message: '注册成功！请登录'
        });
        return response;
      } catch (error) {
        commit('setError', error.response?.data?.message || '注册失败');
        throw error;
      } finally {
        commit('setLoading', false);
      }
    },
    
    async login({ commit }, credentials) {
      try {
        commit('setLoading', true);
        const response = await authService.login(credentials);
        const { token, ...user } = response.data;
        commit('setUser', user);
        commit('setToken', token);
        commit('setNotification', {
          type: 'success',
          message: '登录成功！'
        });
        return response;
      } catch (error) {
        commit('setError', error.response?.data?.message || '登录失败');
        throw error;
      } finally {
        commit('setLoading', false);
      }
    },
    
    logout({ commit }) {
      authService.logout();
      commit('clearAuth');
      commit('setNotification', {
        type: 'info',
        message: '已退出登录'
      });
    },
    
    async changePassword({ commit }, passwordData) {
      try {
        commit('setLoading', true);
        const response = await authService.changePassword(passwordData);
        commit('setNotification', {
          type: 'success',
          message: '密码修改成功！'
        });
        return response;
      } catch (error) {
        commit('setError', error.response?.data?.message || '密码修改失败');
        throw error;
      } finally {
        commit('setLoading', false);
      }
    },
    
    // NASA API
    async fetchRovers({ commit }) {
      try {
        commit('setLoading', true);
        const response = await nasaService.getRovers();
        commit('setRovers', response.data.rovers);
        return response;
      } catch (error) {
        commit('setError', error.response?.data?.message || '获取火星车列表失败');
        throw error;
      } finally {
        commit('setLoading', false);
      }
    },
    
    async fetchRoverDetails({ commit }, roverName) {
      try {
        commit('setLoading', true);
        const response = await nasaService.getRoverDetails(roverName);
        commit('setSelectedRover', response.data.rover);
        return response;
      } catch (error) {
        commit('setError', error.response?.data?.message || '获取火星车详情失败');
        throw error;
      } finally {
        commit('setLoading', false);
      }
    },
    
    async fetchRoverManifest({ commit }, roverName) {
      try {
        commit('setLoading', true);
        const response = await nasaService.getRoverManifest(roverName);
        commit('setRoverManifest', response.data.photo_manifest);
        return response;
      } catch (error) {
        commit('setError', error.response?.data?.message || '获取火星车任务清单失败');
        throw error;
      } finally {
        commit('setLoading', false);
      }
    },
    
    async fetchPhotos({ commit }, params) {
      try {
        commit('setLoading', true);
        const response = await nasaService.getPhotos(params);
        commit('setPhotos', response.data.photos);
        return response;
      } catch (error) {
        commit('setError', error.response?.data?.message || '获取照片失败');
        throw error;
      } finally {
        commit('setLoading', false);
      }
    },
    
    // 探索路径
    async fetchUserPaths({ commit }) {
      try {
        commit('setLoading', true);
        const response = await pathService.getUserPaths();
        commit('setUserPaths', response.data);
        return response;
      } catch (error) {
        commit('setError', error.response?.data?.message || '获取探索路径失败');
        throw error;
      } finally {
        commit('setLoading', false);
      }
    },
    
    async fetchPathDetails({ commit }, pathId) {
      try {
        commit('setLoading', true);
        const response = await pathService.getPathDetails(pathId);
        commit('setCurrentPath', response.data);
        return response;
      } catch (error) {
        commit('setError', error.response?.data?.message || '获取路径详情失败');
        throw error;
      } finally {
        commit('setLoading', false);
      }
    },
    
    async createPath({ commit, state }) {
      try {
        commit('setLoading', true);
        
        if (!state.currentPath.name) {
          throw new Error('路径名称不能为空');
        }
        
        if (state.currentPath.photos.length === 0) {
          throw new Error('路径必须包含至少一张照片');
        }
        
        const pathData = {
          name: state.currentPath.name,
          description: state.currentPath.description,
          photos: state.currentPath.photos.map((photo, index) => ({
            photoId: photo.id,
            order: index,
            notes: photo.notes,
            tags: photo.tags
          }))
        };
        
        const response = await pathService.createPath(pathData);
        commit('clearCurrentPath');
        commit('setNotification', {
          type: 'success',
          message: '探索路径创建成功！'
        });
        
        // 刷新路径列表
        await this.dispatch('fetchUserPaths');
        
        return response;
      } catch (error) {
        commit('setError', error.response?.data?.message || error.message || '创建路径失败');
        throw error;
      } finally {
        commit('setLoading', false);
      }
    },
    
    async updatePath({ commit, state }, pathId) {
      try {
        commit('setLoading', true);
        
        if (!state.currentPath.name) {
          throw new Error('路径名称不能为空');
        }
        
        const pathData = {
          name: state.currentPath.name,
          description: state.currentPath.description,
          photos: state.currentPath.photos.map((photo, index) => ({
            photoId: photo.id,
            order: index,
            notes: photo.notes,
            tags: photo.tags
          }))
        };
        
        const response = await pathService.updatePath(pathId, pathData);
        commit('setNotification', {
          type: 'success',
          message: '探索路径更新成功！'
        });
        
        // 刷新路径列表
        await this.dispatch('fetchUserPaths');
        
        return response;
      } catch (error) {
        commit('setError', error.response?.data?.message || error.message || '更新路径失败');
        throw error;
      } finally {
        commit('setLoading', false);
      }
    },
    
    async deletePath({ commit }, pathId) {
      try {
        commit('setLoading', true);
        const response = await pathService.deletePath(pathId);
        commit('setNotification', {
          type: 'success',
          message: '探索路径删除成功！'
        });
        
        // 刷新路径列表
        await this.dispatch('fetchUserPaths');
        
        return response;
      } catch (error) {
        commit('setError', error.response?.data?.message || '删除路径失败');
        throw error;
      } finally {
        commit('setLoading', false);
      }
    }
  },
  
  getters: {
    isLoggedIn(state) {
      return !!state.token;
    },
    isAdmin(state) {
      return state.user && state.user.roles && state.user.roles.includes('ROLE_ADMIN');
    },
    username(state) {
      return state.user ? state.user.username : '';
    }
  }
});

export default store;
