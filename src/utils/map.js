import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { CATEGORY_META, categoryLabel, categoryColor, categoryEmoji } from './osm.js'
import { i18n } from '../i18n/index.js'
import { wgs84ToGcj02, gcj02ToWgs84, inChina } from './coords.js'

// 默认视图：纽约中央公园（全球知名亲子绿地，便于直观演示）
export const DEFAULT_CENTER = [40.7829, -73.9654]
export const DEFAULT_ZOOM = 13

// 高德瓦片（GCJ-02）。默认公共地址；生产建议注册高德 Key 并替换为合规地址（见 .env）。
const AMAP_TILE_URL = import.meta.env.VITE_AMAP_TILE_URL ||
  'https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}'
const OSM_TILE_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'

// 按中心点决定瓦片供应商：国内高德(GCJ-02)，海外 OSM(WGS-84)。
export function pickProvider(lat, lng) {
  return inChina(lat, lng) ? 'amap' : 'osm'
}

function makeTileLayer(provider) {
  if (provider === 'amap') {
    return L.tileLayer(AMAP_TILE_URL, {
      subdomains: ['1', '2', '3', '4'],
      maxZoom: 19,
      attribution: '&copy; 高德地图'
    })
  }
  return L.tileLayer(OSM_TILE_URL, {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
  })
}

export async function initMap(containerId, center, zoom) {
  const [cLat, cLng] = center || DEFAULT_CENTER
  const provider = pickProvider(cLat, cLng)
  const map = L.map(containerId, { zoomControl: true }).setView(
    toDisplayRaw(provider, cLat, cLng),
    zoom || DEFAULT_ZOOM
  )
  map.provider = provider
  map.tileLayer = makeTileLayer(provider).addTo(map)
  return map
}

// 中心点跨区域时切换瓦片层。返回是否发生了切换（调用方需据此重绘标记）。
export function ensureTileProvider(map, lat, lng) {
  const provider = pickProvider(lat, lng)
  if (provider === map.provider) return false
  if (map.tileLayer) map.removeLayer(map.tileLayer)
  map.provider = provider
  map.tileLayer = makeTileLayer(provider).addTo(map)
  return true
}

// 存储坐标(WGS-84) -> 显示坐标（amap 时转 GCJ-02）。返回 [lat, lng]。
function toDisplayRaw(provider, lat, lng) {
  return provider === 'amap' ? wgs84ToGcj02(lat, lng) : [lat, lng]
}
export function toDisplay(map, lat, lng) {
  return toDisplayRaw(map.provider, lat, lng)
}
// 显示坐标(点击/视野) -> 存储坐标(WGS-84)。
export function fromDisplay(map, lat, lng) {
  return map.provider === 'amap' ? gcj02ToWgs84(lat, lng) : [lat, lng]
}

function escapeHtml(str) {
  return String(str || '').replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]))
}

// OSM 种子标记（圆形色点 + 弹窗，含"补充安全信息"入口）
export function addOsmMarkers(map, spots, onContribute) {
  const group = L.layerGroup()
  spots.forEach(s => {
    const meta = CATEGORY_META[s.category] || {}
    const [mlat, mlng] = toDisplay(map, s.lat, s.lng)
    const m = L.circleMarker([mlat, mlng], {
      radius: 7, color: '#fff', weight: 2,
      fillColor: meta.color || '#1890ff', fillOpacity: 0.95
    })
    const html = `<div class="osm-popup"><b>${escapeHtml(s.name)}</b><br>` +
      `<span style="color:${meta.color}">${categoryLabel(s.category)}</span>` +
      `<br><button class="js-contribute">${i18n.global.t('contribute')} -></button></div>`
    m.bindPopup(html)
    if (onContribute) {
      m.on('popupopen', (e) => {
        const btn = e.popup.getElement() && e.popup.getElement().querySelector('.js-contribute')
        if (btn) btn.onclick = () => onContribute(s)
      })
    }
    m.addTo(group)
  })
  group.addTo(map)
  return group
}

// 用户自建标记（emoji 图钉，点击进入详情）
export function addUserMarkers(map, spots, onSelect) {
  const group = L.layerGroup()
  spots.forEach(s => {
    const meta = CATEGORY_META[s.category] || {}
    const [mlat, mlng] = toDisplay(map, s.lat, s.lng)
    const icon = L.divIcon({
      className: 'spot-pin',
      html: `<div style="font-size:24px;line-height:1">${meta.emoji || '📍'}</div>`,
      iconSize: [28, 28], iconAnchor: [14, 14]
    })
    const m = L.marker([mlat, mlng], { icon })
    m.bindPopup(`<b>${escapeHtml(s.name)}</b><br><span style="color:${meta.color}">${categoryLabel(s.category)}</span>`)
    if (onSelect) m.on('click', () => onSelect(s))
    m.addTo(group)
  })
  group.addTo(map)
  return group
}

export function clearLayer(group) {
  if (group) group.clearLayers()
}

// 浏览器定位返回 WGS-84；不自动 setView（由调用方按当前瓦片转换后 setView）。
export function locateUser(map, onSuccess, onError) {
  map.locate({ setView: false, maxZoom: 14 })
  map.once('locationfound', (e) => onSuccess && onSuccess(e.latlng))
  map.once('locationerror', (e) => onError && onError(e))
}

// lat/lng 为存储坐标(WGS-84)，按当前瓦片转换后飞行。
export function flyTo(map, lat, lng, zoom = 14) {
  const [mlat, mlng] = toDisplay(map, lat, lng)
  map.flyTo([mlat, mlng], zoom)
}

// 唤起 OpenStreetMap 做导航/查看（OSM 链接使用 WGS-84，与存储一致）
export function navigateTo(lat, lng) {
  const url = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=16/${lat}/${lng}`
  window.open(url, '_blank')
}

export { categoryLabel, categoryColor, categoryEmoji }
