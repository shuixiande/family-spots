import { i18n } from '../i18n/index.js'

// 数据层风险等级以中性 code 存储（'low'/'mid'/'high'），展示时按当前语言翻译。
export function riskLabel(level) {
  const map = { low: 'riskLow', mid: 'riskMid', high: 'riskHigh' }
  const key = map[level]
  return key ? i18n.global.t(key) : (level || '')
}

export function riskClass(level) {
  if (level === 'low') return 'low'
  if (level === 'mid') return 'mid'
  return 'high'
}

export function riskDesc(level) {
  const map = { low: 'riskLowDesc', mid: 'riskMidDesc', high: 'riskHighDesc' }
  const key = map[level]
  return key ? i18n.global.t(key) : ''
}

export function feeLabel(v) {
  if (v === 'free') return i18n.global.t('free')
  if (v === 'paid') return i18n.global.t('paid')
  return v || ''
}
