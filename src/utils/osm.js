// OpenStreetMap 数据层：Overpass（种子地点）+ Nominatim（搜索/逆地理编码）
// 坐标统一为 WGS-84，无需像高德那样做坐标系转换。
import { i18n } from '../i18n/index.js'

export const CATEGORY_META = {
  water:      { label: '玩水', labelKey: 'catWater', color: '#1890ff', emoji: '💧' },
  mountain:   { label: '爬山', labelKey: 'catMountain', color: '#722ed1', emoji: '⛰️' },
  park:       { label: '公园', labelKey: 'catPark', color: '#52c41a', emoji: '🌳' },
  playground: { label: '乐园', labelKey: 'catPlayground', color: '#fa8c16', emoji: '🛝' }
}

export function categoryLabel(c) {
  const m = CATEGORY_META[c]
  return m?.labelKey ? i18n.global.t(m.labelKey) : (m?.label || c)
}
export function categoryColor(c) {
  return (CATEGORY_META[c] || {}).color || '#1890ff'
}
export function categoryEmoji(c) {
  return (CATEGORY_META[c] || {}).emoji || '📍'
}

// 把 OSM 标签映射到本项目类别
function classify(tags) {
  if (!tags) return null
  if (tags.leisure === 'playground') return 'playground'
  if (
    tags.leisure === 'park' || tags.leisure === 'garden' ||
    tags.boundary === 'national_park' || tags.leisure === 'nature_reserve'
  ) return 'park'
  if (
    tags.natural === 'water' || tags.natural === 'beach' || tags.natural === 'hot_spring' ||
    tags.leisure === 'beach_resort' || tags.waterway || tags.natural === 'bay'
  ) return 'water'
  if (
    tags.natural === 'peak' || tags.natural === 'mountain' || tags.natural === 'volcano' ||
    tags.natural === 'hill' || tags.tourism === 'viewpoint' || tags.landform
  ) return 'mountain'
  return null
}

// bbox: [south, west, north, east]
export async function fetchOsmSpots(bbox, limit = 300) {
  const [s, w, n, e] = bbox
  const q = `[out:json][timeout:25];
(
  node["leisure"="park"](${s},${w},${n},${e});
  node["leisure"="garden"](${s},${w},${n},${e});
  node["leisure"="playground"](${s},${w},${n},${e});
  node["boundary"="national_park"](${s},${w},${n},${e});
  node["natural"="water"](${s},${w},${n},${e});
  node["natural"="beach"](${s},${w},${n},${e});
  node["natural"="peak"](${s},${w},${n},${e});
  way["leisure"="park"](${s},${w},${n},${e});
  way["leisure"="playground"](${s},${w},${n},${e});
  way["natural"="water"](${s},${w},${n},${e});
  relation["boundary"="national_park"](${s},${w},${n},${e});
);
out center ${limit};`

  const res = await fetch('https://overpass-api.de/api/interpreter', {
    method: 'POST',
    body: 'data=' + encodeURIComponent(q)
  })
  if (!res.ok) throw new Error('Overpass 请求失败：' + res.status)
  const json = await res.json()
  const spots = []
  for (const el of json.elements || []) {
    const lat = el.lat ?? el.center?.lat
    const lon = el.lon ?? el.center?.lon
    if (lat == null || lon == null) continue
    const cat = classify(el.tags || {})
    if (!cat) continue
    const name = (el.tags && (el.tags.name || el.tags['name:en'])) || (categoryLabel(cat) + '地点')
    spots.push({
      id: 'osm-' + el.type + '-' + el.id,
      name,
      lat,
      lng: lon,
      category: cat,
      source: 'osm',
      tags: el.tags
    })
  }
  return spots
}

// Nominatim 地点搜索（遵守其使用规范：浏览器自动带 Referer，注意限流 ~1次/秒）
export async function nominatimSearch(query) {
  const url = 'https://nominatim.openstreetmap.org/search?format=json&limit=5&q=' + encodeURIComponent(query)
  const res = await fetch(url, { headers: { Accept: 'application/json' } })
  if (!res.ok) throw new Error('Nominatim 搜索失败：' + res.status)
  return await res.json()
}

// 逆地理编码：经纬度 -> 地址
export async function reverseGeocode(lat, lng) {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
  const res = await fetch(url, { headers: { Accept: 'application/json' } })
  if (!res.ok) throw new Error('逆地理编码失败：' + res.status)
  const json = await res.json()
  return {
    address: json.display_name || '',
    raw: json.address || {}
  }
}
