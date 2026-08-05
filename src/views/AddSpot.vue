<template>
  <div class="add-page">
    <h2>{{ $t('addTitle') }}</h2>
    <p class="add-desc">{{ $t('desc') }}</p>
    <div v-if="mode === 'cloud' && !currentUser" class="ugc-notice" style="background:#fff7e6;color:#ad6800">
      🔐 {{ $t('needLogin') }} <router-link to="/login?redirect=/add" style="color:#1890ff">{{ $t('login') }}</router-link>
    </div>
    <form @submit.prevent="saveSpot" class="add-form">
      <div class="form-section">
        <h3>{{ $t('basic') }}</h3>
        <div class="form-row">
          <div class="form-group">
            <label>{{ $t('name') }} *</label>
            <input v-model="form.name" required :placeholder="$t('namePh')" />
          </div>
          <div class="form-group">
            <label>{{ $t('category') }}</label>
            <select v-model="form.category">
              <option value="water">{{ $t('catWater') }}</option>
              <option value="mountain">{{ $t('catMountain') }}</option>
              <option value="park">{{ $t('catPark') }}</option>
              <option value="playground">{{ $t('catPlayground') }}</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label>{{ $t('address') }}</label>
          <input v-model="form.address" :placeholder="$t('addressPh')" />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>{{ $t('type') }}</label>
            <select v-model="form.subtype">
              <option value="">{{ $t('typeAny') }}</option>
              <option v-for="t in subtypeOptions" :key="t.value" :value="t.value">{{ $t(t.labelKey) }}</option>
            </select>
          </div>
          <div class="form-group">
            <label>{{ $t('freePaid') }}</label>
            <select v-model="form.freeOrPaid">
              <option value="">{{ $t('any') }}</option>
              <option value="free">{{ $t('free') }}</option>
              <option value="paid">{{ $t('paid') }}</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label>{{ $t('feeDesc') }}</label>
          <input v-model="form.feeDesc" :placeholder="$t('feeDescPh')" />
        </div>
      </div>

      <div class="form-section">
        <h3>{{ $t('safety') }}</h3>
        <div class="form-row">
          <div class="form-group">
            <label>{{ $t('riskLevel') }}</label>
            <select v-model="form.riskLevel">
              <option value="">{{ $t('any') }}</option>
              <option value="low">{{ $t('riskLow') }}</option>
              <option value="mid">{{ $t('riskMid') }}</option>
              <option value="high">{{ $t('riskHigh') }}</option>
            </select>
          </div>
          <div class="form-group">
            <label>{{ $t('suitableAge') }}</label>
            <input v-model="form.suitableAge" :placeholder="$t('agePh')" />
          </div>
        </div>

        <div class="form-row form-row-3" v-if="form.category === 'water'">
          <div class="form-group">
            <label>{{ $t('waterQuality') }}</label>
            <select v-model="form.waterQuality">
              <option value="">{{ $t('any') }}</option>
              <option v-for="o in waterQualityOptions" :key="o.value" :value="o.value">{{ $t(o.labelKey) }}</option>
            </select>
          </div>
          <div class="form-group">
            <label>{{ $t('waterDepth') }}</label>
            <select v-model="form.waterDepth">
              <option value="">{{ $t('any') }}</option>
              <option v-for="o in waterDepthOptions" :key="o.value" :value="o.value">{{ $t(o.labelKey) }}</option>
            </select>
          </div>
          <div class="form-group">
            <label>{{ $t('flowSpeed') }}</label>
            <select v-model="form.flowSpeed">
              <option value="">{{ $t('any') }}</option>
              <option v-for="o in flowSpeedOptions" :key="o.value" :value="o.value">{{ $t(o.labelKey) }}</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label>{{ $t('tips') }}</label>
          <textarea v-model="form.tips" rows="3" :placeholder="$t('tipsPh')"></textarea>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>{{ $t('kidFriendly') }}</label>
            <select v-model="form.kidFriendly">
              <option :value="true">{{ $t('yes') }}</option>
              <option :value="false">{{ $t('no') }}</option>
            </select>
          </div>
          <div class="form-group">
            <label>{{ $t('rating') }} (1-5)</label>
            <input v-model.number="form.rating" type="number" min="1" max="5" step="0.5" :placeholder="4.0" />
          </div>
        </div>
      </div>

      <div class="form-section">
        <h3>{{ $t('facilities') }}</h3>
        <div class="facility-checks">
          <label v-for="f in facilityOptions" :key="f.value" class="facility-check">
            <input type="checkbox" :value="f.value" v-model="form.facilities" />
            <span class="check-label">{{ f.emoji }} {{ $t(f.labelKey) }}</span>
          </label>
        </div>
      </div>

      <div class="form-section">
        <h3>{{ $t('coord') }}</h3>
        <div class="coord-inputs">
          <input v-model="form.lng" :placeholder="$t('lngPh')" readonly class="coord-readonly" />
          <input v-model="form.lat" :placeholder="$t('latPh')" readonly class="coord-readonly" />
        </div>
        <div id="picker-map" class="picker-map"></div>
        <div class="geo-hint">
          <button type="button" class="btn-secondary" @click="locateOnMap">{{ $t('locate') }}</button>
          <span v-if="geoLoading" class="geo-loading">{{ $t('geoLoading') }}</span>
          <span v-else-if="form.address" class="geo-ok">✅ {{ form.address }}</span>
        </div>
      </div>

      <button type="submit" class="btn-primary">{{ $t('submit') }}</button>
      <p v-if="saveMsg" class="save-msg">{{ saveMsg }}</p>

      <div class="ugc-notice">
        💡 {{ $t('notice') }}
      </div>
    </form>

    <div class="local-list" v-if="localSpots.length > 0">
      <h3>{{ $t('mySpots') }} ({{ localSpots.length }})</h3>
      <div v-for="spot in localSpots" :key="spot.id" class="local-item">
        <div class="local-info">
          <span class="local-name">{{ spot.name }}</span>
          <span class="local-meta">{{ categoryLabel(spot.category) }} · {{ subtypeLabel(spot.subtype) }}</span>
        </div>
        <div class="local-actions">
          <button class="btn-sm" @click="editSpot(spot)">{{ $t('edit') }}</button>
          <button class="btn-sm btn-danger" @click="deleteSpot(spot.id)">{{ $t('delete') }}</button>
        </div>
      </div>
      <div class="local-tools">
        <button class="btn-secondary" @click="exportJson">{{ $t('export') }}</button>
        <button class="btn-danger" @click="clearAll">{{ $t('clear') }}</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import L from 'leaflet'
import { CATEGORY_META, categoryLabel, reverseGeocode } from '../utils/osm.js'
import { initMap, locateUser, toDisplay, fromDisplay } from '../utils/map.js'
import { createSpot, updateSpot, deleteSpot as apiDeleteSpot, fetchMySpots, dataMode } from '../services/spots.js'
import { SUBTYPE_OPTIONS, WATER_QUALITY_OPTIONS, WATER_DEPTH_OPTIONS, FLOW_SPEED_OPTIONS, FACILITY_OPTIONS, subtypeLabel } from '../utils/options.js'
import { currentUser } from '../utils/auth.js'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const facilityOptions = FACILITY_OPTIONS
const subtypeOptions = SUBTYPE_OPTIONS
const waterQualityOptions = WATER_QUALITY_OPTIONS
const waterDepthOptions = WATER_DEPTH_OPTIONS
const flowSpeedOptions = FLOW_SPEED_OPTIONS
const mode = dataMode()

const form = ref(getEmptyForm())
const saveMsg = ref('')
const localSpots = ref([])
const editingId = ref(null)
const geoLoading = ref(false)
let mapObj = null
let pickerMarker = null

function getEmptyForm() {
  return {
    name: '', address: '', category: 'park', subtype: '', freeOrPaid: '',
    feeDesc: '', suitableAge: '', riskLevel: '', kidFriendly: true,
    waterQuality: '', waterDepth: '', flowSpeed: '', facilities: [],
    rating: 4.0, lng: '', lat: ''
  }
}

async function refreshMySpots() {
  localSpots.value = await fetchMySpots()
}

function buildPayload() {
  return { ...form.value }
}

async function saveSpot() {
  if (!form.value.name) { saveMsg.value = t('needName'); return }
  if (mode === 'cloud' && !currentUser.value) { saveMsg.value = t('needLogin'); router.push('/login?redirect=/add'); return }
  const lng = parseFloat(form.value.lng), lat = parseFloat(form.value.lat)
  if (!Number.isFinite(lng) || lng < -180 || lng > 180 || !Number.isFinite(lat) || lat < -90 || lat > 90) {
    saveMsg.value = t('needCoord'); return
  }
  const r = form.value.rating
  if (typeof r === 'number' && (r < 1 || r > 5)) { saveMsg.value = t('invalidRating'); return }
  try {
    if (editingId.value) {
      await updateSpot(editingId.value, buildPayload())
    } else {
      await createSpot(buildPayload())
    }
    form.value = getEmptyForm()
    editingId.value = null
    if (pickerMarker) { pickerMarker.remove(); pickerMarker = null }
    saveMsg.value = t('saveSuccess')
    await refreshMySpots()
    setTimeout(() => saveMsg.value = '', 3000)
  } catch (e) {
    saveMsg.value = t('saveError') + (e.message || e)
  }
}

async function editSpot(spot) {
  editingId.value = spot.id
  form.value = {
    name: spot.name, address: spot.address || '', category: spot.category || 'park',
    subtype: spot.subtype || '', freeOrPaid: spot.freeOrPaid || '',
    feeDesc: spot.feeDesc || '', suitableAge: spot.suitableAge || '',
    riskLevel: spot.riskLevel || '', kidFriendly: spot.kidFriendly !== false,
    waterQuality: spot.waterQuality || '', waterDepth: spot.waterDepth || '',
    flowSpeed: spot.flowSpeed || '', facilities: Array.isArray(spot.facilities) ? spot.facilities : (spot.facilities ? [spot.facilities] : []),
    rating: spot.rating || 4.0, lng: spot.lng || '', lat: spot.lat || ''
  }
  if (pickerMarker && mapObj) { pickerMarker.remove(); pickerMarker = null }
  if (spot.lng && spot.lat && mapObj) {
    const [mlat, mlng] = toDisplay(mapObj, spot.lat, spot.lng)
    mapObj.setView([mlat, mlng], 15)
    pickerMarker = L.marker([mlat, mlng]).addTo(mapObj)
  }
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

async function deleteSpot(id) {
  if (!confirm(t('confirmDelete'))) return
  try {
    await apiDeleteSpot(id)
    await refreshMySpots()
  } catch (e) {
    saveMsg.value = t('saveError') + (e.message || e)
  }
}

async function clearAll() {
  if (!confirm(mode === 'cloud' ? t('confirmClearCloud') : t('confirmClear'))) return
  const list = await fetchMySpots()
  for (const s of list) {
    try { await apiDeleteSpot(s.id) } catch (e) { console.warn('删除失败', s.id, e) }
  }
  await refreshMySpots()
}

function exportJson() {
  const merged = [...localSpots.value]
  const blob = new Blob([JSON.stringify(merged, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'family-outdoor-spots.json'
  a.click()
  URL.revokeObjectURL(url)
}

function locateOnMap() {
  if (!mapObj) return
  locateUser(mapObj,
    (pos) => { const [mlat, mlng] = toDisplay(mapObj, pos.lat, pos.lng); mapObj.setView([mlat, mlng], 14) },
    () => { alert(t('locateFail')) }
  )
}

onMounted(async () => {
  await refreshMySpots()

  const q = route.query
  if (q.lat && q.lng) {
    form.value.lat = String(q.lat)
    form.value.lng = String(q.lng)
    if (q.name) form.value.name = String(q.name)
    if (q.category && CATEGORY_META[q.category]) form.value.category = String(q.category)
  }

  const center = (q.lat && q.lng) ? [parseFloat(q.lat), parseFloat(q.lng)] : [40.7829, -73.9654]
  mapObj = await initMap('picker-map', center, q.lat ? 15 : 13)

  if (q.lat && q.lng) {
    const [mlat, mlng] = toDisplay(mapObj, parseFloat(q.lat), parseFloat(q.lng))
    pickerMarker = L.marker([mlat, mlng]).addTo(mapObj)
    if (!q.name) reverseGeocodeFor(parseFloat(q.lat), parseFloat(q.lng))
  }

  mapObj.on('click', async (e) => {
    const [lat, lng] = fromDisplay(mapObj, e.latlng.lat, e.latlng.lng)
    form.value.lng = lng.toFixed(6)
    form.value.lat = lat.toFixed(6)
    if (pickerMarker) pickerMarker.remove()
    const [mlat, mlng] = toDisplay(mapObj, lat, lng)
    pickerMarker = L.marker([mlat, mlng]).addTo(mapObj)
    reverseGeocodeFor(lat, lng)
  })
})

onBeforeUnmount(() => {
  if (mapObj) { mapObj.remove(); mapObj = null }
  pickerMarker = null
})

function reverseGeocodeFor(lat, lng) {
  geoLoading.value = true
  reverseGeocode(lat, lng).then(info => {
    if (info.address) form.value.address = info.address
  }).catch(() => {
    console.warn('逆地理编码识别失败，可手动填写')
  }).finally(() => { geoLoading.value = false })
}
</script>
