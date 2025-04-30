// 创建星星背景
function createStars() {
  const starsContainer = document.querySelector('.stars');
  if (!starsContainer) return;
  
  // 清空现有星星
  starsContainer.innerHTML = '';
  
  // 创建随机星星
  const starCount = 200;
  for (let i = 0; i < starCount; i++) {
    const star = document.createElement('div');
    star.classList.add('star');
    
    // 随机位置
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    
    // 随机大小
    const size = Math.random() * 2;
    
    // 随机亮度
    const opacity = Math.random() * 0.8 + 0.2;
    
    star.style.left = `${x}%`;
    star.style.top = `${y}%`;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.opacity = opacity;
    
    starsContainer.appendChild(star);
  }
}

// 火星放大动画
function initMarsZoom() {
  const loginButton = document.querySelector('.login-btn');
  if (!loginButton) return;
  
  loginButton.addEventListener('click', function(e) {
    // 如果在登录表单中，不触发动画
    if (window.location.pathname === '/login') return;
    
    e.preventDefault();
    
    const marsZoom = document.createElement('div');
    marsZoom.classList.add('mars-zoom');
    
    const marsPlanet = document.createElement('div');
    marsPlanet.classList.add('mars-zoom-planet');
    
    marsZoom.appendChild(marsPlanet);
    document.body.appendChild(marsZoom);
    
    // 触发动画
    setTimeout(() => {
      marsZoom.classList.add('active');
    }, 100);
    
    // 动画结束后跳转
    setTimeout(() => {
      window.location.href = '/login';
    }, 3000);
  });
}

// 调整行星轨道
function adjustOrbits() {
  const orbits = document.querySelectorAll('.mercury-orbit, .venus-orbit, .earth-orbit, .mars-orbit');
  const planets = document.querySelectorAll('.mercury, .venus, .earth, .mars');
  
  // 根据窗口大小调整轨道
  const minDimension = Math.min(window.innerWidth, window.innerHeight);
  const scale = minDimension / 800; // 基准尺寸
  
  orbits.forEach((orbit, index) => {
    const sizes = [160, 240, 320, 400]; // 轨道原始尺寸
    const size = sizes[index] * scale;
    orbit.style.width = `${size}px`;
    orbit.style.height = `${size}px`;
  });
  
  planets.forEach((planet, index) => {
    const distances = [85, 127.5, 169, 207]; // 行星到中心的原始距离
    const distance = distances[index] * scale;
    
    // 更新行星位置
    const angle = Math.random() * 360;
    const radians = angle * (Math.PI / 180);
    const x = Math.cos(radians) * distance;
    const y = Math.sin(radians) * distance;
    
    planet.style.marginLeft = `${x}px`;
    planet.style.marginTop = `${y}px`;
    
    // 更新动画
    planet.style.animation = `orbit ${(index + 2) * 4}s linear infinite`;
  });
}

// 初始化
document.addEventListener('DOMContentLoaded', function() {
  createStars();
  initMarsZoom();
  adjustOrbits();
  
  // 窗口大小改变时重新调整
  window.addEventListener('resize', function() {
    adjustOrbits();
  });
});

// 导出函数供Vue组件使用
export { createStars, initMarsZoom, adjustOrbits };
