import { ref } from 'vue'
import { supabase, isSupabaseConfigured } from './supabase.js'

// 当前登录用户 { id, email } 或 null。未登录 = 游客（只读）。
export const currentUser = ref(null)
let sessionLoaded = null

function setUser(u) {
  currentUser.value = u ? { id: u.id, email: u.email || '' } : null
}

// 首次拉取已有会话（懒加载，并发共享同一 Promise）
function loadSession() {
  if (sessionLoaded) return sessionLoaded
  sessionLoaded = supabase.auth.getSession().then(({ data }) => {
    setUser(data.session?.user || null)
    return currentUserId()
  })
  return sessionLoaded
}

// 登录/登出后实时更新 currentUser
if (isSupabaseConfigured && supabase) {
  supabase.auth.onAuthStateChange((_event, session) => {
    setUser(session?.user || null)
  })
}

// 返回当前登录用户 id（未登录返回 null）。
// 注意：不再自动匿名登录——匿名即游客只读；写入需邮箱登录。
export async function ensureSession() {
  if (!isSupabaseConfigured || !supabase) return null
  await loadSession()
  return currentUserId()
}

export function currentUserId() {
  return currentUser.value?.id || null
}

export async function signInWithEmail(email, password) {
  if (!supabase) throw new Error('cloud-only')
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw new Error(error.message)
  setUser(data.user)
  return currentUserId()
}

// 注册：若 Supabase 开启了邮箱确认，返回 data.session=null，需收信后登录；
// 关闭邮箱确认则注册即登录。
export async function signUpWithEmail(email, password) {
  if (!supabase) throw new Error('cloud-only')
  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) throw new Error(error.message)
  setUser(data.user || null)
  return data
}

export async function signInWithOAuth(provider) {
  if (!supabase) throw new Error('cloud-only')
  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo: window.location.origin + '/login' }
  })
  if (error) throw new Error(error.message)
}

export async function signOut() {
  if (!supabase) return
  await supabase.auth.signOut()
  setUser(null)
  // 清理离线缓存的用户相关数据，避免共享设备泄漏
  if (typeof caches !== 'undefined') caches.delete('supabase-data').catch(() => {})
}
