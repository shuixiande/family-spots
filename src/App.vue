<template>
  <div id="app">
      <nav class="nav-bar">
        <router-link to="/" class="logo">🏞️ {{ locale === 'en' ? 'FamilySpots' : '撒欢地图' }}</router-link>
        <div class="nav-links">
          <router-link to="/">{{ $t('navMap') }}</router-link>
          <router-link to="/list">{{ $t('navList') }}</router-link>
          <router-link to="/add">{{ $t('navAdd') }}</router-link>
          <router-link v-if="mod" to="/moderate">{{ $t('moderate') }}</router-link>
          <router-link v-if="cloud && !currentUser" to="/login" class="lang-btn">{{ $t('login') }}</router-link>
          <button v-if="cloud && currentUser" class="lang-btn" @click="doSignOut">{{ $t('logout') }}</button>
          <button class="lang-btn" @click="toggleLang">
            🌐 {{ locale === 'zh-CN' ? $t('langEn') : $t('langZh') }}
          </button>
        </div>
      </nav>
      <div class="mode-bar" :class="modeClass">{{ modeText }}</div>
      <router-view />
      <div class="disclaimer">
        {{ $t('disclaimer') }}
      </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { setLocale, SUPPORTED } from './i18n/index.js'
import { dataMode, isModerator } from './services/spots.js'
import { currentUser, signOut, ensureSession } from './utils/auth.js'

const { t, locale } = useI18n()
const mode = dataMode()
const cloud = mode === 'cloud'
const mod = ref(false)
onMounted(async () => {
  await ensureSession()
  mod.value = await isModerator()
})

async function doSignOut() {
  await signOut()
  mod.value = false
}

const modeText = computed(() => mode === 'cloud' ? t('modeCloud') : t('modeLocal'))
const modeClass = computed(() => mode === 'cloud' ? 'mode-cloud' : 'mode-local')

function toggleLang() {
  const next = locale.value === 'zh-CN' ? 'en' : 'zh-CN'
  setLocale(next)
}
</script>
