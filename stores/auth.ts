import { defineStore } from 'pinia'
import type { LoginResponse } from '~/types/api'

export const useAuthStore = defineStore('auth', () => {
  const config = useRuntimeConfig()
  const token = useCookie<string | null>('susiair_token', { default: () => null, sameSite: 'lax' })
  const isAuthenticated = computed(() => Boolean(token.value))

  async function login(username: string, password: string) {
    const response = await $fetch<LoginResponse>('/auth/login', {
      baseURL: config.public.apiBase,
      method: 'POST',
      body: { username, password },
    })
    token.value = response.token
  }

  function logout() {
    token.value = null
  }

  return { token, isAuthenticated, login, logout }
})
