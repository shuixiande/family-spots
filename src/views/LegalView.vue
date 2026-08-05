<template>
  <div class="legal-page">
    <router-link to="/" class="back-link">← {{ $t('backHome') }}</router-link>
    <div class="legal-card">
      <h1>{{ isPrivacy ? $t('privacyTitle') : $t('termsTitle') }}</h1>
      <p class="legal-updated">{{ $t('legalUpdated') }}: 2026-08-05 · v{{ isPrivacy ? legalV.privacy : legalV.terms }}</p>
      <div class="legal-body" v-html="body"></div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { LEGAL_VERSION } from '../utils/legal.js'

const route = useRoute()
const { t } = useI18n()
const legalV = LEGAL_VERSION
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
/* 免责/责任限制等重大条款：加粗+高亮，履行格式条款提示义务 */
.legal-body strong { color: #d48806; background: #fffbe6; padding: 1px 4px; border-radius: 3px; }
.legal-body b { color: #333; }
</style>
