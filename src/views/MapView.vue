<template>
  <div class="map-container">
    <div id="map-view"></div>

    <!-- 搜索栏 -->
    <div class="map-search-bar">
      <input
        id="search-input"
        v-model="searchText"
        type="text"
        :placeholder="$t('searchPlaceholder')"
        @keyup.enter="triggerSearch"
      />
      <button class="search-btn" @click="triggerSearch">{{ $t('search') }}</button>
    </div>

    <div class="map-overlay-top">
      <button class="map-btn" :class="{ active: showFilter }" @click="showFilter = !showFilter">{{ $t('filter') }}</button>
      <button class="map-btn" @click="locateMe">{{ $t('locate') }}</button>
      <router-link to="/list"><button class="map-btn">{{ $t('list') }}</button></router-link>
    </div>

    <div class="filter-panel" v-if="showFilter">
      <h3>{{ $t('category') }}</h3>
      <div class="cat-chips">
        <button
          v-for="(meta, key) in categories"
          :key="key"
          class="cat-chip"
          :class="{ off: !activeCats[key] }"
          :style="{ '--c': meta.color }"
          @click="toggleCat(key)"
        >{{ meta.emoji }} {{ $t(meta.labelKey) }}</button>
      </div>

      <h3 style="margin-top:20px">{{ $t('preferences') }}</h3>
      <label class="check-row">
        <input type="checkbox" v-model="kidOnly" @change="renderAll" />
        {{ $t('kidFriendlyOnly') }}
      </label>

      <p class="filter-note">{{ $t('filterNote') }}</p>
    </div>

    <div class="map-loading" v-if="loading">{{ $t('loading') }}</div>

    <!-- 安全须知与免责声明 -->
    <button class="safety-toggle" @click="showSafety = !showSafety">
      ⚠️ {{ $t('safety') }}
    </button>
    <div class="safety-panel" v-if="showSafety">
      <button class="safety-close" @click="showSafety = false" aria-label="close">✕</button>
      <h3>{{ $t('safetyTitle') }}</h3>
      <ul class="safety-rules">
        <li v-for="(rule, i) in tm('safetyRules')" :key="i">{{ rule }}</li>
      </ul>
      <h4>{{ $t('disclaimerTitle') }}</h4>
      <p class="safety-disclaimer">{{ $t('safetyDisclaimer') }}</p>
      <p class="safety-attribution">{{ $t('dataAttribution') }}</p>
    </div>

    <router-link to="/add" class="fab-btn" title="标记新地点">
      <span>+</span>
      <span class="fab-label">{{ $t('mark') }}</span>
    </router-link>
    <div class="fab-hint">{{ $t('dblHint') }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { CATEGORY_META, fetchOsmSpots, nominatimSearch } from '../utils/osm.js'
import { initMap, addOsmMarkers, addUserMarkers, clearLayer, locateUser, flyTo, toDisplay, fromDisplay, ensureTileProvider } from '../utils/map.js'
import { fetchSpots } from '../services/spots.js'

const { t, tm } = useI18n()
const categories = CATEGORY_META

const router = useRouter()
const searchText = ref('')
const showFilter = ref(false)
const activeCats = reactive({ water: true, mountain: true, park: true, playground: true })
const kidOnly = ref(false)
const loading = ref(false)
const showSafety = ref(false)
let hintTimer = null

const osmSpots = ref([])
const userSpots = ref([])
let mapObj = null
let osmLayer = null
let userLayer = null
let loadTimer = null

function activeCatKeys() {
  return Object.keys(activeCats).filter(k => activeCats[k])
}

function filteredOsm() {
  return osmSpots.value.filter(s => activeCats[s.category])
}
function filteredUser() {
  return userSpots.value.filter(s => activeCats[s.category] && (!kidOnly.value || s.kidFriendly !== false))
}

function renderOsm() {
  clearLayer(osmLayer)
  osmLayer = addOsmMarkers(mapObj, filteredOsm(), onContribute)
}
function renderUser() {
  clearLayer(userLayer)
  userLayer = addUserMarkers(mapObj, filteredUser(), (s) => router.push('/spot/' + s.id))
}
function renderAll() { renderOsm(); renderUser() }

function onContribute(s) {
  router.push('/add?lat=' + s.lat + '&lng=' + s.lng + '&name=' + encodeURIComponent(s.name) + '&category=' + s.category)
}

// 鼠标双击地图任意位置 -> 取显示坐标(WGS-84) -> 打开标记页
function onDblClick(e) {
  const [lat, lng] = fromDisplay(mapObj, e.latlng.lat, e.latlng.lng)
  clearTimeout(hintTimer)
  router.push('/add?lat=' + lat.toFixed(6) + '&lng=' + lng.toFixed(6) + '&from=map')
}

function toggleCat(key) {
  activeCats[key] = !activeCats[key]
  renderAll()
}

// 拉取社区标注（云端或本地兜底），按当前视野范围
async function loadUser() {
  if (!mapObj) return
  const b = mapObj.getBounds()
  const sw = fromDisplay(mapObj, b.getSouth(), b.getWest())
  const ne = fromDisplay(mapObj, b.getNorth(), b.getEast())
  const bounds = { s: sw[0], w: sw[1], n: ne[0], e: ne[1] }
  userSpots.value = await fetchSpots({ bounds })
  renderUser()
}

async function loadOsm() {
  if (!mapObj) return
  const b = mapObj.getBounds()
  // 视野为显示坐标，转成 WGS-84 再查 Overpass
  const sw = fromDisplay(mapObj, b.getSouth(), b.getWest())
  const ne = fromDisplay(mapObj, b.getNorth(), b.getEast())
  if (ne[0] - sw[0] > 1.2) {
    // 视野过大跳过，避免 Overpass 过量；同时清空旧标记避免残留误导
    osmSpots.value = []
    clearLayer(osmLayer)
    return
  }
  loading.value = true
  try {
    osmSpots.value = await fetchOsmSpots([sw[0], sw[1], ne[0], ne[1]], 400)
    renderOsm()
  } catch (e) {
    console.warn('OSM 加载失败：', e)
  } finally {
    loading.value = false
  }
}

function locateMe() {
  if (!mapObj) return
  locateUser(mapObj,
    (pos) => { const [mlat, mlng] = toDisplay(mapObj, pos.lat, pos.lng); mapObj.setView([mlat, mlng], 14) },
    () => alert(t('locateFail'))
  )
}

async function triggerSearch() {
  const q = searchText.value.trim()
  if (!q || !mapObj) return
  try {
    const results = await nominatimSearch(q)
    if (results.length > 0) {
      const r = results[0]
      flyTo(mapObj, parseFloat(r.lat), parseFloat(r.lon), 14)
    } else {
      alert(t('notFound'))
    }
  } catch (e) {
    alert(t('searchFail'))
  }
}

onMounted(async () => {
  mapObj = await initMap('map-view')
  await loadUser()
  await loadOsm()
  // 双击地图标记新地点（关闭默认双击缩放以避免与标记行为冲突）
  mapObj.doubleClickZoom.disable()
  mapObj.on('dblclick', onDblClick)
  mapObj.on('moveend', () => {
    clearTimeout(loadTimer)
    loadTimer = setTimeout(() => {
      loadOsm()
      loadUser()
      // 中心跨国内外边界时切换瓦片层并重绘标记（坐标需重新转换）
      const c = mapObj.getCenter()
      if (ensureTileProvider(mapObj, c.lat, c.lng)) renderAll()
    }, 700)
  })
})

onBeforeUnmount(() => {
  clearTimeout(loadTimer)
  clearTimeout(hintTimer)
  if (mapObj) { mapObj.remove(); mapObj = null }
})
</script>
