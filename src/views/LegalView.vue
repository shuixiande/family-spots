<template>
  <div class="legal-page">
    <router-link to="/" class="back-link">← {{ $t('backHome') }}</router-link>
    <div class="legal-card">
      <h1>{{ isPrivacy ? $t('privacyTitle') : $t('termsTitle') }}</h1>
      <p class="legal-updated">{{ $t('legalUpdated') }}: 2026-08-05</p>
      <div class="legal-body" v-html="body"></div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

const route = useRoute()
const { t } = useI18n()
const isPrivacy = computed(() => route.name === 'privacy')

// 用 v-html 渲染条款正文；内容由 i18n 提供（中英）
const body = computed(() => {
  const key = isPrivacy.value ? 'privacyBody' : 'termsBody'
  return t(key)
})
</script>

<style scoped>
.legal-page { max-width: 800px; margin: 0 auto; padding: 20px; }
.legal-card {
  background: #fff; border-radius: 12px; padding: 28px 32px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}
.legal-card h1 { font-size: 24px; margin-bottom: 6px; }
.legal-updated { font-size: 12px; color: #999; margin-bottom: 20px; }
.legal-body { font-size: 14px; color: #555; line-height: 1.9; }
.legal-body h2 { font-size: 17px; color: #333; margin: 22px 0 8px; }
.legal-body h3 { font-size: 15px; color: #333; margin: 16px 0 6px; }
.legal-body p { margin-bottom: 10px; }
.legal-body li { margin-bottom: 4px; margin-left: 20px; }
.legal-body a { color: #1890ff; }
</style>
