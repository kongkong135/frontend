<template>
    <div class="login-container">
      <div class="login-form">
        <h2>登录</h2>
        <div v-if="message" class="alert" :class="{ 'alert-error': error, 'alert-success': !error }">
          {{ message }}
        </div>
        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <label for="username">用户名</label>
            <input 
              type="text" 
              id="username" 
              v-model="user.username" 
              required 
              placeholder="请输入用户名"
            />
          </div>
          <div class="form-group">
            <label for="password">密码</label>
            <input 
              type="password" 
              id="password" 
              v-model="user.password" 
              required 
              placeholder="请输入密码"
            />
          </div>
          <button type="submit" class="btn login-btn" :disabled="loading">
            {{ loading ? '登录中...' : '登录' }}
          </button>
        </form>
        <div class="form-footer">
          <p>还没有账号？ <router-link to="/register">立即注册</router-link></p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Login',
    data() {
      return {
        user: {
          username: '',
          password: ''
        },
        loading: false,
        message: '',
        error: false
      }
    },
    methods: {
      async handleLogin() {
        this.loading = true;
        this.message = '';
        this.error = false;
        
        try {
          await this.$store.dispatch('login', this.user);
          this.$router.push('/explorer');
        } catch (err) {
          this.error = true;
          this.message = err.response?.data?.message || '登录失败，请检查用户名和密码';
        } finally {
          this.loading = false;
        }
      }
    }
  }
  </script>
  
  <style scoped>
  .login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    color: white;
    position: relative;
    z-index: 1;
  }
  
  .login-form {
    background-color: rgba(0, 0, 0, 0.7);
    padding: 2rem;
    border-radius: 10px;
    width: 100%;
    max-width: 400px;
  }
  
  h2 {
    text-align: center;
    margin-bottom: 1.5rem;
  }
  
  .form-group {
    margin-bottom: 1rem;
  }
  
  label {
    display: block;
    margin-bottom: 0.5rem;
  }
  
  input {
    width: 100%;
    padding: 0.8rem;
    border: none;
    border-radius: 5px;
    background-color: rgba(255, 255, 255, 0.9);
  }
  
  .btn {
    width: 100%;
    padding: 0.8rem;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-weight: bold;
    margin-top: 1rem;
    transition: all 0.3s ease;
  }
  
  .login-btn {
    background-color: #4CAF50;
    color: white;
  }
  
  .login-btn:hover:not(:disabled) {
    background-color: #45a049;
  }
  
  .login-btn:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
  
  .form-footer {
    text-align: center;
    margin-top: 1rem;
  }
  
  .form-footer a {
    color: #4CAF50;
    text-decoration: none;
  }
  
  .alert {
    padding: 0.8rem;
    border-radius: 5px;
    margin-bottom: 1rem;
    text-align: center;
  }
  
  .alert-error {
    background-color: rgba(255, 0, 0, 0.2);
    border: 1px solid #f44336;
  }
  
  .alert-success {
    background-color: rgba(0, 255, 0, 0.2);
    border: 1px solid #4CAF50;
  }
  </style>
  