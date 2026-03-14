import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('kp_token') || '')
  const userInfo = ref(JSON.parse(localStorage.getItem('kp_user') || '{}'))

  const isLoggedIn = computed(() => !!token.value)
  const nickname = computed(() => userInfo.value.nickname || '游客')
  const avatar = computed(() => userInfo.value.avatar || '')

  function setToken(t) {
    token.value = t
    localStorage.setItem('kp_token', t)
  }

  function setUserInfo(info) {
    userInfo.value = info
    localStorage.setItem('kp_user', JSON.stringify(info))
  }

  function logout() {
    token.value = ''
    userInfo.value = {}
    localStorage.removeItem('kp_token')
    localStorage.removeItem('kp_user')
  }

  return { token, userInfo, isLoggedIn, nickname, avatar, setToken, setUserInfo, logout }
})
