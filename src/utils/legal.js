// 法律条款版本化管理
// 版本号是「条款同意」的唯一来源：记录中的版本 < 当前版本时，需要重新征询同意。
// 修改条款正文后，请同步递增对应版本号（terms / privacy），所有用户将重新看到并确认。

export const LEGAL_VERSION = { terms: 1, privacy: 1 }

const CONSENT_KEY = 'family-spots:legal-consent'

// 读取本机已记录的条款同意（{ terms, privacy, t } 或 null）
export function getLegalConsent() {
  if (typeof localStorage === 'undefined') return null
  try {
    const raw = localStorage.getItem(CONSENT_KEY)
    return raw ? JSON.parse(raw) : null
  } catch (e) {
    return null
  }
}

// 是否需要对条款重新征询同意（从未同意过，或任一版本已过期）
export function needLegalReconsent() {
  const c = getLegalConsent()
  if (!c) return true
  return c.terms < LEGAL_VERSION.terms || c.privacy < LEGAL_VERSION.privacy
}

// 记录同意（记录当前版本与时间戳）
export function recordLegalConsent() {
  if (typeof localStorage === 'undefined') return
  try {
    localStorage.setItem(CONSENT_KEY, JSON.stringify({
      terms: LEGAL_VERSION.terms,
      privacy: LEGAL_VERSION.privacy,
      t: Date.now()
    }))
  } catch (e) {
    /* 隐私模式等场景忽略 */
  }
}
