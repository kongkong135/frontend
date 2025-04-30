<template>
  <div id="app">
    <div v-if="!isLoggedIn" class="solar-system-container">
      <div class="solar-system">
        <!-- 太阳系背景将在CSS中实现 -->
      </div>
      <router-view />
    </div>
    <div v-else class="mars-container">
      <!-- 登录后的火星视角 -->
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  computed: {
    isLoggedIn() {
      return !!this.$store.state.token;
    }
  },
  created() {
    // 检查是否有保存的token，如果有则尝试获取用户信息
    if (this.$store.state.token) {
      // 这里可以添加获取用户信息的逻辑
    }
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: Arial, sans-serif;
  overflow: hidden;
}

.solar-system-container {
  width: 100vw;
  height: 100vh;
  background-color: #000;
  position: relative;
  overflow: hidden;
}

.solar-system {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('./assets/solar-system-bg.jpg');
  background-size: cover;
  background-position: center;
  z-index: 0;
}

.mars-container {
  width: 100vw;
  height: 100vh;
  background-color: #8B4513;
  position: relative;
  overflow: auto;
  background-image: url('./assets/mars-surface.jpg');
  background-size: cover;
  background-position: center;
}
</style>
