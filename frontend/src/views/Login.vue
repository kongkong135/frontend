<template>
    <div class="login-container">
        <div class="login-form">
            <h2>登录</h2>
            <div v-if="message" class="alert" :class="{'alert-success':!error, 'alert-error': error}">
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
                        >
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
                    {{ loading? '登录中...' : '登录' }}  <!--状态-->
                </button>
            </form>
        </div>
        <div class="from-footer">
            <p>没有账号？<router-link to="/register">立即注册</router-link></p>
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
            loading:false,  //开始默认状态是显示登录，点击之后就是显示登录中
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
                await this.$store.dispatch('login', this.User);  //调用login方法
                this.$router.push('/explorer');  //登录成功直接跳转到首页
            } catch (err) {
                this.error = true;
                this.message = err.response?.data?.message || '登录失败，请检查用户名或密码';
            } finally { 
                this.loading = false;
            }
        }
        }
    }

</script>