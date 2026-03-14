<template>
  <div class="register-page">
    <NavBar title="注册账号" />
    <div class="register-form">
      <div class="form-group">
        <label class="form-label">手机号</label>
        <input class="form-input" v-model="form.mobile" placeholder="请输入手机号" />
      </div>
      <div class="form-group captcha-row">
        <div style="flex:1">
          <label class="form-label">验证码</label>
          <input class="form-input" v-model="form.captcha" placeholder="请输入验证码" />
        </div>
        <button class="sms-btn" @click="sendCode" :disabled="cooldown > 0">
          {{ cooldown > 0 ? `${cooldown}s` : '获取验证码' }}
        </button>
      </div>
      <div class="form-group">
        <label class="form-label">设置密码</label>
        <input class="form-input" v-model="form.password" type="password" placeholder="请设置登录密码" />
      </div>
      <div class="form-group">
        <label class="form-label">确认密码</label>
        <input class="form-input" v-model="form.confirm_password" type="password" placeholder="请再次输入密码" />
      </div>
      <label class="agree-row">
        <input type="checkbox" v-model="agreed" />
        <span>我已阅读并同意《用户协议》和《隐私政策》</span>
      </label>
      <button class="btn-primary" @click="handleRegister" :disabled="loading" style="margin-top:16px">
        {{ loading ? '注册中...' : '立即注册' }}
      </button>
      <p class="to-login">已有账号？<router-link to="/login">去登录</router-link></p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import NavBar from '@/components/NavBar.vue'

const router = useRouter()
const loading = ref(false)
const cooldown = ref(0)
const agreed = ref(false)
const form = ref({ mobile: '', captcha: '', password: '', confirm_password: '' })

const sendCode = () => {
  if (!form.value.mobile) return alert('请输入手机号')
  cooldown.value = 60
  const t = setInterval(() => { cooldown.value--; if (cooldown.value <= 0) clearInterval(t) }, 1000)
}

const handleRegister = async () => {
  if (!agreed.value) return alert('请先同意用户协议')
  if (form.value.password !== form.value.confirm_password) return alert('两次密码不一致')
  loading.value = true
  setTimeout(() => { loading.value = false; alert('注册成功'); router.push('/login') }, 1500)
}
</script>

<style scoped>
.register-page { min-height: 100vh; background: var(--bg-primary); }
.register-form { padding: 24px 20px; }
.captcha-row { display: flex; align-items: flex-end; gap: 12px; }
.sms-btn { min-width: 110px; height: 48px; background: var(--color-gold); color: #fff; border-radius: var(--radius-md); font-size: 13px; font-weight: 600; cursor: pointer; margin-top: 22px; }
.sms-btn:disabled { opacity: 0.6; }
.agree-row { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--text-secondary); margin-top: 16px; }
.agree-row input { accent-color: var(--color-primary); }
.to-login { text-align: center; margin-top: 20px; font-size: 14px; color: var(--text-secondary); }
.to-login a { color: var(--color-primary); font-weight: 600; }
</style>
