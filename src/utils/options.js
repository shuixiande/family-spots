import { i18n } from '../i18n/index.js'

// 枚举选项统一以中性 code 存储，展示时按当前语言翻译。
// 与 format.js 的 risk/fee 映射配合，避免中文硬编码耦合到数据层。

export const SUBTYPE_OPTIONS = [
  { value: 'river', labelKey: 'subRiver' },
  { value: 'stream', labelKey: 'subStream' },
  { value: 'waterfall', labelKey: 'subWaterfall' },
  { value: 'lake', labelKey: 'subLake' },
  { value: 'beach', labelKey: 'subBeach' },
  { value: 'pool', labelKey: 'subPool' },
  { value: 'forest', labelKey: 'subForest' },
  { value: 'trail', labelKey: 'subTrail' },
  { value: 'lawn', labelKey: 'subLawn' },
  { value: 'playground', labelKey: 'subPlayground' },
  { value: 'other', labelKey: 'subOther' }
]

export const WATER_QUALITY_OPTIONS = [
  { value: 'clear', labelKey: 'wqClear' },
  { value: 'normal', labelKey: 'wqNormal' },
  { value: 'muddy', labelKey: 'wqMuddy' }
]

export const WATER_DEPTH_OPTIONS = [
  { value: 'shallow', labelKey: 'wdShallow' },
  { value: 'moderate', labelKey: 'wdModerate' },
  { value: 'deep', labelKey: 'wdDeep' }
]

export const FLOW_SPEED_OPTIONS = [
  { value: 'slow', labelKey: 'fsSlow' },
  { value: 'moderate', labelKey: 'fsModerate' },
  { value: 'fast', labelKey: 'fsFast' }
]

export const FACILITY_OPTIONS = [
  { value: 'toilet', labelKey: 'facToilet', emoji: '🚻' },
  { value: 'parking', labelKey: 'facParking', emoji: '🅿️' },
  { value: 'locker', labelKey: 'facLocker', emoji: '👕' },
  { value: 'shop', labelKey: 'facShop', emoji: '🛒' },
  { value: 'trash', labelKey: 'facTrash', emoji: '🗑️' },
  { value: 'rest', labelKey: 'facRest', emoji: '⛱️' }
]

function labelOf(registry, code) {
  if (!code) return ''
  const item = registry.find(o => o.value === code)
  return item ? i18n.global.t(item.labelKey) : String(code)
}

export const subtypeLabel = (code) => labelOf(SUBTYPE_OPTIONS, code)
export const waterQualityLabel = (code) => labelOf(WATER_QUALITY_OPTIONS, code)
export const waterDepthLabel = (code) => labelOf(WATER_DEPTH_OPTIONS, code)
export const flowSpeedLabel = (code) => labelOf(FLOW_SPEED_OPTIONS, code)
export const facilityLabel = (code) => labelOf(FACILITY_OPTIONS, code)

// 设施数组 -> 本地化逗号串
export function facilitiesLabel(codes) {
  if (!codes) return ''
  if (!Array.isArray(codes)) return facilityLabel(codes)
  const sep = i18n.global.locale.value === 'zh-CN' ? '、' : ', '
  return codes.map(facilityLabel).filter(Boolean).join(sep)
}
