import { createI18n } from 'vue-i18n'
import { messages } from './messages.js'

const SUPPORTED = ['zh-CN', 'en']
const STORAGE_KEY = 'fom-locale'

function detectInitial() {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved && SUPPORTED.includes(saved)) return saved
  const nav = (navigator.language || 'en').toLowerCase()
  return nav.startsWith('zh') ? 'zh-CN' : 'en'
}

export const i18n = createI18n({
  legacy: false,
  locale: detectInitial(),
  fallbackLocale: 'en',
  messages
})

// 切换语言并持久化；同时更新 <html lang> 以利于 SEO 与无障碍。
export function setLocale(loc) {
  if (!SUPPORTED.includes(loc)) return
  i18n.global.locale.value = loc
  localStorage.setItem(STORAGE_KEY, loc)
  document.documentElement.lang = loc
}

export { SUPPORTED }
