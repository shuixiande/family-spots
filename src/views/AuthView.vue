<template>
  <div class="add-page">
    <h2>{{ $t('loginTitle') }}</h2>
    <p class="add-desc">{{ $t('authNote') }}</p>
    <form @submit.prevent="submit" class="add-form">
      <div class="form-group">
        <label>{{ $t('email') }}</label>
        <input v-model="email" type="email" required :placeholder="$t('email')" />
      </div>
      <div class="form-group">
        <label>{{ $t('password') }}</label>
        <input v-model="password" type="password" required minlength="6" :placeholder="$t('password')" />
      </div>
      <button type="submit" class="btn-primary">{{ isSignUp ? $t('signUp') : $t('signIn') }}</button>
      <p v-if="msg" class="save-msg" style="color:#fa8c16">{{ msg }}</p>
      <button type="button" class="btn-secondary" style="margin-top:12px;width:100%" @click="isSignUp = !isSignUp">
        {{ isSignUp ? $t('haveAccount') : $t('noAccount') }}
      </button>
    </form>
    <div class="oauth-divider">{{ $t('orUse') }}</div>
    <div class="oauth-row">
      <button class="btn-secondary" @click="oauth('google')">Google</button>
      <button class="btn-secondary" @click="oauth('github')">GitHub</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { signInWithEmail, signUpWithEmail, signInWithOAuth, ensureSession, currentUserId } from '../utils/auth.js'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const email = ref('')
const password = ref('')
const msg = ref('')
const isSignUp = ref(false)

onMounted(async () => {
  // OAuth/邮箱确认回调返回时已建立会话，直接跳转
  await ensureSession()
  if (currentUserId()) router.push(route.query.redirect || '/')
})

async function submit() {
  msg.value = ''
  try {
    if (isSignUp.value) {
      const data = await signUpWithEmail(email.value, password.value)
      if (data.session) router.push(route.query.redirect || '/')
      else msg.value = t('checkEmail')
    } else {
      await signInWithEmail(email.value, password.value)
      router.push(route.query.redirect || '/')
    }
  } catch (e) {
    msg.value = t('loginFail') + (e.message || e)
  }
}

async function oauth(provider) {
  msg.value = ''
  try {
    await signInWithOAuth(provider)
  } catch (e) {
    msg.value = t('loginFail') + (e.message || e)
  }
}
</script>
