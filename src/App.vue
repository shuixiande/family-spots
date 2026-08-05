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
        <span class="legal-links">
          · <router-link to="/terms">{{ $t('termsTitle') }}</router-link>
          · <router-link to="/privacy">{{ $t('privacyTitle') }}</router-link>
        </span>
      </div>

      <!-- 首次访问/条款更新：安全须知 + 条款同意弹窗 -->
      <div v-if="showSafetyModal" class="safety-modal-mask">
        <div class="safety-modal">
          <h3>{{ $t('safetyModalTitle') }}</h3>
          <p class="safety-modal-intro">{{ $t('safetyModalIntro') }}</p>
          <ul class="safety-rules">
            <li v-for="(rule, i) in tm('safetyRules')" :key="i">{{ rule }}</li>
          </ul>
          <h4>{{ $t('disclaimerTitle') }}</h4>
          <p class="safety-disclaimer">{{ $t('safetyDisclaimer') }}</p>
          <p class="safety-attribution">{{ $t('dataAttribution') }}</p>
          <p class="legal-version">{{ $t('legalConsentNote') }} <router-link to="/terms" style="color:#1890ff">{{ $t('termsTitle') }} v{{ legalV.terms }}</router-link> · <router-link to="/privacy" style="color:#1890ff">{{ $t('privacyTitle') }} v{{ legalV.privacy }}</router-link></p>
          <div class="safety-modal-actions">
            <button class="btn-primary" @click="agreeSafety">{{ $t('safetyAgree') }}</button>
            <button class="btn-secondary" @click="browseOnly">{{ $t('safetyBrowseOnly') }}</button>
          </div>
        </div>
      </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { setLocale, SUPPORTED } from './i18n/index.js'
import { dataMode, isModerator } from './services/spots.js'
import { currentUser, signOut, ensureSession } from './utils/auth.js'
import { LEGAL_VERSION, needLegalReconsent, recordLegalConsent } from './utils/legal.js'

const { t, tm, locale } = useI18n()
const mode = dataMode()
const cloud = mode === 'cloud'
const mod = ref(false)

// 安全须知 + 条款同意弹窗：首次访问自动弹出；条款版本更新时再次弹出。
// 同意时同时记录「安全须知版本」与「条款版本」。
const SAFETY_AGREE_KEY = 'family-spots:safety-agreed'
const SAFETY_VERSION = 1
const showSafetyModal = ref(false)
const legalV = LEGAL_VERSION

onMounted(async () => {
  await ensureSession()
  mod.value = await isModerator()
  checkSafetyAgreement()
})

function checkSafetyAgreement() {
  if (typeof localStorage === 'undefined') return
  try {
    const raw = localStorage.getItem(SAFETY_AGREE_KEY)
    const rec = raw ? JSON.parse(raw) : null
    // 安全须知版本未同意，或任一法律条款版本过期 → 弹窗征询
    if (!rec || rec.v !== SAFETY_VERSION || needLegalReconsent()) {
      showSafetyModal.value = true
    }
  } catch (e) {
    showSafetyModal.value = true
  }
}

function agreeSafety() {
  try {
    localStorage.setItem(SAFETY_AGREE_KEY, JSON.stringify({ v: SAFETY_VERSION, t: Date.now() }))
  } catch (e) { /* 隐私模式等场景忽略 */ }
  recordLegalConsent()
  showSafetyModal.value = false
}

function browseOnly() {
  showSafetyModal.value = false
}

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
