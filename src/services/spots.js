import { supabase, isSupabaseConfigured } from '../utils/supabase.js'
import { ensureSession, currentUserId } from '../utils/auth.js'

const STORAGE_KEY = 'family-outdoor-spots'

// 当前数据模式：'cloud'（已连 Supabase，全球共享）/ 'local'（本地浏览器存储）
export function dataMode() {
  return isSupabaseConfigured ? 'cloud' : 'local'
}

function loadLocal() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') } catch { return [] }
}
function saveLocal(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

// 应用层（camelCase）<-> 数据库（snake_case）字段映射
function toDb(s, userId) {
  return {
    name: s.name,
    address: s.address || '',
    category: s.category,
    subtype: s.subtype || '',
    free_or_paid: s.freeOrPaid || '',
    fee_desc: s.feeDesc || '',
    suitable_age: s.suitableAge || '',
    risk_level: s.riskLevel || '',
    kid_friendly: s.kidFriendly !== false,
    water_quality: s.waterQuality || '',
    water_depth: s.waterDepth || '',
    flow_speed: s.flowSpeed || '',
    facilities: Array.isArray(s.facilities) ? s.facilities : (s.facilities ? [s.facilities] : []),
    rating: s.rating || null,
    lng: parseFloat(s.lng),
    lat: parseFloat(s.lat),
    tips: s.tips || '',
    created_by: userId || null,
    source: 'user'
  }
}

function fromDb(r) {
  return {
    id: r.id,
    name: r.name,
    address: r.address || '',
    category: r.category,
    subtype: r.subtype || '',
    freeOrPaid: r.free_or_paid || '',
    feeDesc: r.fee_desc || '',
    suitableAge: r.suitable_age || '',
    riskLevel: r.risk_level || '',
    kidFriendly: r.kid_friendly !== false,
    waterQuality: r.water_quality || '',
    waterDepth: r.water_depth || '',
    flowSpeed: r.flow_speed || '',
    facilities: r.facilities || [],
    rating: r.rating || null,
    lng: r.lng,
    lat: r.lat,
    tips: r.tips || '',
    createdAt: r.created_at,
    source: r.source || 'user',
    createdBy: r.created_by
  }
}

// 拉取社区标注。bounds = { s, w, n, e } 可选；categories 数组可选；kidOnly 可选。
export async function fetchSpots({ bounds, categories, kidOnly, limit = 300 } = {}) {
  if (isSupabaseConfigured && supabase) {
    let q = supabase.from('spots').select('*').order('created_at', { ascending: false }).limit(limit)
    if (bounds) q = q.gte('lat', bounds.s).lte('lat', bounds.n).gte('lng', bounds.w).lte('lng', bounds.e)
    if (categories && categories.length) q = q.in('category', categories)
    if (kidOnly) q = q.eq('kid_friendly', true)
    const { data, error } = await q
    if (error) { console.warn('Supabase 读取失败：', error.message); return [] }
    return (data || []).map(fromDb)
  }
  // localStorage 兜底
  let list = loadLocal()
  if (bounds) list = list.filter(s => s.lat >= bounds.s && s.lat <= bounds.n && s.lng >= bounds.w && s.lng <= bounds.e)
  if (categories && categories.length) list = list.filter(s => categories.includes(s.category))
  if (kidOnly) list = list.filter(s => s.kidFriendly !== false)
  return list
}

// 拉取"我"标注的地点（云端按 created_by，本地为全部本地数据）
export async function fetchMySpots() {
  if (isSupabaseConfigured && supabase) {
    const uid = await ensureSession()
    if (!uid) return []
    const { data, error } = await supabase
      .from('spots').select('*').eq('created_by', uid).order('created_at', { ascending: false })
    if (error) { console.warn('读取我的标注失败：', error.message); return [] }
    return (data || []).map(fromDb)
  }
  return loadLocal()
}

export async function getSpotById(id) {
  if (!id) return null
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('spots').select('*').eq('id', id).maybeSingle()
    if (error) { console.warn(error.message); return null }
    return data ? fromDb(data) : null
  }
  return loadLocal().find(s => s.id === id) || null
}

export async function createSpot(spot) {
  if (isSupabaseConfigured && supabase) {
    const userId = await ensureSession()
    if (!userId) throw new Error('need-login')
    const { data, error } = await supabase.from('spots').insert(toDb(spot, userId)).select().single()
    if (error) throw new Error(error.message)
    return fromDb(data)
  }
  const obj = { ...spot, id: 'local-' + (globalThis.crypto?.randomUUID?.() ?? (Date.now().toString(36) + Math.random().toString(36).slice(2))), createdAt: new Date().toISOString() }
  const list = loadLocal(); list.push(obj); saveLocal(list)
  return obj
}

export async function deleteSpot(id) {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from('spots').delete().eq('id', id)
    if (error) throw new Error(error.message)
    return
  }
  saveLocal(loadLocal().filter(s => s.id !== id))
}

export async function updateSpot(id, patch) {
  if (isSupabaseConfigured && supabase) {
    const payload = toDb(patch, null)
    delete payload.created_by
    delete payload.source
    const { data, error } = await supabase.from('spots').update(payload).eq('id', id).select().single()
    if (error) throw new Error(error.message)
    return fromDb(data)
  }
  const list = loadLocal()
  const idx = list.findIndex(s => s.id === id)
  if (idx >= 0) list[idx] = { ...list[idx], ...patch, id }
  saveLocal(list)
  return list[idx]
}

// ---- 内容审核：举报 / 版主 ----

// 举报一个地点（云端）。本地模式无后端，抛错由调用方提示。
export async function reportSpot(spotId, reason) {
  if (!isSupabaseConfigured || !supabase) throw new Error('cloud-only')
  const { error } = await supabase.from('reports').insert({ spot_id: spotId, reason })
  if (error) throw new Error(error.message)
}

// 当前用户是否为版主
export async function isModerator() {
  if (!isSupabaseConfigured || !supabase) return false
  const { data, error } = await supabase.rpc('is_moderator')
  if (error) { console.warn('is_moderator 失败：', error.message); return false }
  return !!data
}

// 版主：隐藏 / 恢复地点
export async function setSpotStatus(id, status) {
  if (!isSupabaseConfigured || !supabase) return
  const { error } = await supabase.from('spots').update({ status }).eq('id', id)
  if (error) throw new Error(error.message)
}

// 版主：拉取举报列表（带地点信息）
export async function fetchReports() {
  if (!isSupabaseConfigured || !supabase) return []
  const { data, error } = await supabase
    .from('reports')
    .select('id,spot_id,reason,reporter_id,created_at,spots(id,name,category,lat,lng,status)')
    .order('created_at', { ascending: false })
    .limit(200)
  if (error) { console.warn('读取举报失败：', error.message); return [] }
  return data || []
}

export { currentUserId }
