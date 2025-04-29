<template>
    <div class="register-container">
      <div class="register-form">
        <h2>注册</h2>
        <div v-if="message" class="alert" :class="{ 'alert-error': error, 'alert-success': !error }">
          {{ message }}
        </div>
        <form @submit.prevent="handleRegister">
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
            <label for="email">邮箱</label>
            <input 
              type="email" 
              id="email" 
              v-model="user.email" 
              required 
              placeholder="请输入邮箱"
            />
          </div>
          <div class="form-group">
            <label for="password">密码</label>
            <input 
              type="text" 
              id="password" 
              v-model="user.password" 
              required 
              placeholder="请输入密码"
            />
          </div>
          <div class="form-group">
            <label for="confirmPassword">确认密码</label>
            <input 
              type="text" 
              id="confirmPassword" 
              v-model="confirmPassword" 
              required 
              placeholder="请再次输入密码"
            />
          </div>
          <button type="submit" class="btn register-btn" :disabled="loading">
            {{ loading ? '注册中...' : '注册' }}
          </button>
        </form>
        <div class="form-footer">
          <p>已有账号？ <router-link to="/">立即登录</router-link></p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Register',
    data() {
      return {
        user: {
          username: '',
          email: '',
          password: ''
        },
        confirmPassword: '',
        loading: false,
        message: '',
        error: false
      }
    },
    methods: {
      async handleRegister() {
        // 验证密码是否匹配
        if (this.user.password !== this.confirmPassword) {
          this.error = true;
          this.message = '两次输入的密码不一致';
          return;
        }
        
        this.loading = true;
        this.message = '';
        this.error = false;
        
        try {
        await this.$store.dispatch('register', this.user);
        this.error = false;
          this.message = '注册成功！请登录';
          
          // 清空表单
          this.user = {
            username: '',
            email: '',
            password: ''
          };
          this.confirmPassword = '';
          
          // 延迟后跳转到登录页
          setTimeout(() => {
            this.$router.push('/');
          }, 2000);
        } catch (err) {
          this.error = true;
          this.message = err.response?.data?.message || '注册失败，请稍后再试';
        } finally {
          this.loading = false;
        }
      }
    }
  }
  </script>
  
<style scoped>
  .register-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    color: white;
    position: relative;
    z-index: 1;
  }
  
  .register-form {
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
  
  .register-btn {
    background-color: #2196F3;
    color: white;
  }
  
  .register-btn:hover:not(:disabled) {
    background-color: #0b7dda;
  }
  
  .register-btn:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
  
  .form-footer {
    text-align: center;
    margin-top: 1rem;
  }
  
  .form-footer a {
    color: #2196F3;
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
  