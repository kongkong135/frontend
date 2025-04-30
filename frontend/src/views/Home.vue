<template>
  <div class="home-container">
    <div class="auth-container">
      <h1>Mars Explorer</h1>
      <p>探索火星的奇妙世界</p>
      <div class="auth-buttons">
        <router-link to="/login" class="btn login-btn">登录</router-link>
        <router-link to="/register" class="btn register-btn">注册</router-link>
        
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home'
}
</script>

<style scoped>
.home-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  color: white;
  position: relative;
  z-index: 1;
}

.auth-container {
  background-color: rgba(0, 0, 0, 0.7);
  padding: 2rem;
  border-radius: 10px;
  text-align: center;
  max-width: 400px;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
}

.auth-buttons {
  display: flex;
  justify-content: space-between;
}

.btn {
  display: inline-block;
  padding: 0.8rem 1.5rem;
  border-radius: 5px;
  text-decoration: none;
  font-weight: bold;
  transition: all 0.3s ease;
}

.login-btn {
  background-color: #4CAF50;
  color: white;
}

.register-btn {
  background-color: #2196F3;
  color: white;
}

.btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}
</style>
