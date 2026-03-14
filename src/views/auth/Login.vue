<template>
  <div class="login-page">
    <div class="login-bg">
      <div class="login-logo">
        <div class="logo-icon">☯</div>
        <h1 class="logo-title">鲲鹏易道</h1>
        <p class="logo-slogan">智运乾坤 · 易道通达</p>
      </div>
    </div>

    <div class="login-card">
      <div class="tab-switch">
        <button :class="{ active: mode === 'password' }" @click="mode = 'password'">密码登录</button>
        <button :class="{ active: mode === 'sms' }" @click="mode = 'sms'">短信登录</button>
      </div>

      <!-- 密码登录 -->
      <form v-if="mode === 'password'" @submit.prevent="handlePasswordLogin">
        <div class="form-group">
          <input class="form-input" v-model="form.username" placeholder="请输入手机号" />
        </div>
        <div class="form-group">
          <input class="form-input" v-model="form.password" type="password" placeholder="请输入密码" />
        </div>
        <div class="form-group captcha-row">
          <input class="form-input captcha-input" v-model="form.captcha" placeholder="验证码" />
          <img v-if="captchaImage" :src="captchaImage" class="captcha-img" @click="loadCaptcha" alt="验证码" />
        </div>
        <button type="submit" class="btn-primary" :disabled="loading">
          {{ loading ? '登录中...' : '登 录' }}
        </button>
      </form>

      <!-- 短信登录 -->
      <form v-else @submit.prevent="handleSmsLogin">
        <div class="form-group">
          <input class="form-input" v-model="smsForm.mobile" placeholder="请输入手机号" />
        </div>
        <div class="form-group captcha-row">
          <input class="form-input captcha-input" v-model="smsForm.sms_code" placeholder="短信验证码" />
          <button type="button" class="sms-btn" @click="sendSmsCode" :disabled="smsCooldown > 0">
            {{ smsCooldown > 0 ? `${smsCooldown}s` : '获取验证码' }}
          </button>
        </div>
        <button type="submit" class="btn-primary" :disabled="loading">
          {{ loading ? '登录中...' : '登 录' }}
        </button>
      </form>

      <div class="login-footer">
        <router-link to="/register" class="link">注册账号</router-link>
        <span class="divider">|</span>
        <a class="link" @click="forgotPassword">忘记密码</a>
      </div>
    </div>

    <p class="login-tip">登录即代表同意《用户协议》和《隐私政策》</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { getCaptchaImage, userLogin, sendSms, loginBySms } from '@/api/modules/user'

const router = useRouter()
const userStore = useUserStore()
const mode = ref('password')
const loading = ref(false)
const captchaImage = ref('')
const captchaKey = ref('')
const smsCooldown = ref(0)

const form = ref({ username: '', password: '', captcha: '' })
const smsForm = ref({ mobile: '', sms_code: '' })

const loadCaptcha = async () => {
  try {
    const res = await getCaptchaImage()
    captchaImage.value = res.data.captcha_image
    captchaKey.value = res.data.captcha_key
  } catch (e) { /* ignore */ }
}

const handlePasswordLogin = async () => {
  if (!form.value.username || !form.value.password) return alert('请填写完整信息')
  loading.value = true
  try {
    const res = await userLogin({
      username: form.value.username,
      password: form.value.password,
      captcha: form.value.captcha,
      captcha_key: captchaKey.value
    })
    userStore.setToken(res.data.token)
    if (res.data.user_info) userStore.setUserInfo(res.data.user_info)
    router.push('/home')
  } catch (e) {
    alert(e.message || '登录失败')
    loadCaptcha()
  } finally {
    loading.value = false
  }
}

const handleSmsLogin = async () => {
  if (!smsForm.value.mobile || !smsForm.value.sms_code) return alert('请填写完整信息')
  loading.value = true
  try {
    const res = await loginBySms(smsForm.value)
    userStore.setToken(res.data.token)
    if (res.data.user_info) userStore.setUserInfo(res.data.user_info)
    router.push('/home')
  } catch (e) {
    alert(e.message || '登录失败')
  } finally {
    loading.value = false
  }
}

const sendSmsCode = async () => {
  if (!smsForm.value.mobile) return alert('请输入手机号')
  try {
    await sendSms({ mobile: smsForm.value.mobile })
    smsCooldown.value = 60
    const t = setInterval(() => {
      smsCooldown.value--
      if (smsCooldown.value <= 0) clearInterval(t)
    }, 1000)
  } catch (e) {
    alert(e.message || '发送失败')
  }
}

const forgotPassword = () => alert('请联系客服重置密码')

onMounted(loadCaptcha)
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: var(--bg-dark);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.login-bg {
  width: 100%;
  padding: 60px 20px 40px;
  background: linear-gradient(160deg, var(--color-primary-dark) 0%, var(--color-primary) 50%, #2a0e0e 100%);
  text-align: center;
  position: relative;
  overflow: hidden;
}

.login-bg::before {
  content: '☰ ☷ ☳ ☴';
  position: absolute;
  top: 20px;
  right: 20px;
  font-size: 14px;
  color: rgba(212, 160, 23, 0.3);
  letter-spacing: 8px;
}

.logo-icon {
  font-size: 64px;
  color: var(--color-gold);
  text-shadow: 0 0 30px rgba(212, 160, 23, 0.5);
  margin-bottom: 12px;
  animation: pulse-glow 3s ease-in-out infinite;
  filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));
}

.logo-title {
  font-family: var(--font-serif);
  font-size: 32px;
  font-weight: 900;
  color: var(--color-gold);
  letter-spacing: 6px;
  text-shadow: 0 2px 8px rgba(0,0,0,0.3);
}

.logo-slogan {
  color: rgba(253, 245, 236, 0.7);
  font-size: 14px;
  margin-top: 8px;
  letter-spacing: 4px;
}

.login-card {
  width: calc(100% - 40px);
  max-width: 400px;
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: 28px 24px;
  margin-top: -20px;
  box-shadow: var(--shadow-lg);
  position: relative;
  z-index: 1;
}

.tab-switch {
  display: flex;
  gap: 0;
  margin-bottom: 24px;
  background: var(--bg-secondary);
  border-radius: var(--radius-full);
  padding: 4px;
}

.tab-switch button {
  flex: 1;
  padding: 10px;
  border-radius: var(--radius-full);
  font-size: 14px;
  font-weight: 600;
  color: var(--text-tertiary);
  cursor: pointer;
  transition: all 0.3s;
}

.tab-switch button.active {
  background: var(--color-primary);
  color: white;
  box-shadow: 0 2px 8px rgba(196, 30, 36, 0.3);
}

.captcha-row {
  display: flex;
  gap: 12px;
}

.captcha-input {
  flex: 1;
}

.captcha-img {
  width: 120px;
  height: 48px;
  border-radius: var(--radius-md);
  cursor: pointer;
  background: var(--bg-secondary);
  object-fit: contain;
}

.sms-btn {
  min-width: 110px;
  height: 48px;
  background: var(--color-gold);
  color: white;
  border-radius: var(--radius-md);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
}

.sms-btn:disabled {
  opacity: 0.6;
}

.login-footer {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  gap: 12px;
  font-size: 14px;
}

.login-footer .link {
  color: var(--color-primary);
  cursor: pointer;
}

.login-footer .divider {
  color: var(--text-tertiary);
}

.login-tip {
  color: rgba(253, 245, 236, 0.4);
  font-size: 12px;
  margin-top: 24px;
  text-align: center;
}
</style>
