<script setup lang="ts">
import { Eye, EyeOff, LockKeyhole, UserRound } from 'lucide-vue-next'

const auth = useAuthStore()
const username = ref('')
const password = ref('')
const showPassword = ref(false)
const isSubmitting = ref(false)
const errorMessage = ref('')

if (auth.isAuthenticated) await navigateTo('/home')

async function submit() {
  errorMessage.value = ''
  isSubmitting.value = true
  try {
    await auth.login(username.value, password.value)
    await navigateTo('/home')
  } catch {
    errorMessage.value = 'Username or password is incorrect.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <main class="sign-in-page">
    <section class="sign-in-card" aria-labelledby="sign-in-title">
      <img src="/images/susiair-logo.png" width="158" height="40" alt="Susi Air" class="brand-logo" />
      <p class="eyebrow">PILOT APP</p>
      <h1 id="sign-in-title">Pilot operations,<br />ready when you are.</h1>
      <p class="intro">Sign in to view your schedule, flight activity, and duty limits.</p>

      <form @submit.prevent="submit">
        <label>
          Username
          <span class="field"><UserRound :size="18" /><input v-model="username" autocomplete="username" required /></span>
        </label>
        <label>
          Password
          <span class="field"><LockKeyhole :size="18" /><input v-model="password" :type="showPassword ? 'text' : 'password'" autocomplete="current-password" required />
            <button type="button" :aria-label="showPassword ? 'Hide password' : 'Show password'" @click="showPassword = !showPassword"><EyeOff v-if="showPassword" :size="18" /><Eye v-else :size="18" /></button>
          </span>
        </label>
        <p v-if="errorMessage" class="form-error" role="alert">{{ errorMessage }}</p>
        <button class="sign-in-button" :disabled="isSubmitting">{{ isSubmitting ? 'Signing in…' : 'Sign In' }}</button>
      </form>
    </section>
  </main>
</template>

<style scoped lang="scss">
.sign-in-page { display: grid; min-height: 100dvh; place-items: center; padding: 24px; background: #0e2138; }
.sign-in-card { width: min(100%, 390px); padding: 36px 28px; border-radius: 16px; background: #fff; box-shadow: 0 18px 50px rgba(0, 0, 0, .2); }
.brand-logo { width: auto; height: 36px; margin-bottom: 44px; object-fit: contain; object-position: left; }
h1 { margin: 0; font-size: 31px; line-height: 1.1; letter-spacing: -.045em; }
.intro { margin: 14px 0 30px; color: #6b7280; font-size: 14px; line-height: 1.65; }
form { display: grid; gap: 18px; }
label { display: grid; gap: 8px; font-size: 12px; font-weight: 800; }
.field { display: flex; align-items: center; gap: 10px; height: 50px; padding: 0 14px; border: 1px solid #d9dee5; border-radius: 12px; color: #6b7280; }
input { min-width: 0; flex: 1; border: 0; outline: 0; color: #0e2138; }
.field button { display: grid; place-items: center; border: 0; background: transparent; color: #6b7280; }
.form-error { margin: -6px 0 0; color: #e63758; font-size: 12px; font-weight: 700; }
.sign-in-button { height: 52px; border: 0; border-radius: 999px; background: #e63758; color: #fff; font-weight: 800; &:disabled { opacity: .65; cursor: wait; } }
</style>
