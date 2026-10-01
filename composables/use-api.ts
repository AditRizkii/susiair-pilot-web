export function useApi() {
  const config = useRuntimeConfig()
  const auth = useAuthStore()

  async function request<T>(path: string, options: Parameters<typeof $fetch>[1] = {}) {
    try {
      return await $fetch<T>(path, {
        baseURL: config.public.apiBase,
        ...options,
        headers: { ...(options.headers ?? {}), ...(auth.token ? { Authorization: `Bearer ${auth.token}` } : {}) },
      })
    } catch (error: any) {
      if (error?.response?.status === 401) {
        auth.logout()
        await navigateTo('/')
      }
      throw error
    }
  }

  return { request }
}
