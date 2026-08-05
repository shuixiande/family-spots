<template>
  <div class="spot-detail" v-if="spot">
    <span class="back-link" @click="$router.back()">← {{ $t('back') }}</span>
    <h1>{{ spot.name }}</h1>
    <div class="address">📍 {{ spot.address || categoryLabel(spot.category) }}</div>

    <div v-if="spot.riskLevel" class="risk-banner" :class="'risk-' + riskClass(spot.riskLevel)">
      <div class="risk-label">{{ $t('safetyLabel') }}：{{ riskLabel(spot.riskLevel) }}</div>
      <div class="risk-desc">{{ riskDesc(spot.riskLevel) }}</div>
    </div>

    <table class="info-table"><tbody>
      <tr v-if="spot.subtype"><th>{{ $t('typeName') }}</th><td>{{ subtypeLabel(spot.subtype) }}</td></tr>
      <tr v-if="spot.waterQuality"><th>{{ $t('waterQuality') }}</th><td>{{ waterQualityLabel(spot.waterQuality) }}</td></tr>
      <tr v-if="spot.waterDepth"><th>{{ $t('waterDepth') }}</th><td>{{ waterDepthLabel(spot.waterDepth) }}</td></tr>
      <tr v-if="spot.flowSpeed"><th>{{ $t('flowSpeed') }}</th><td>{{ flowSpeedLabel(spot.flowSpeed) }}</td></tr>
      <tr v-if="spot.suitableAge"><th>{{ $t('suitableAge') }}</th><td>{{ spot.suitableAge }}</td></tr>
      <tr><th>{{ $t('kidFriendly') }}</th><td>{{ spot.kidFriendly !== false ? $t('yes') : $t('no') }}</td></tr>
      <tr v-if="spot.riskLevel"><th>{{ $t('safetyLabel') }}</th><td>{{ riskLabel(spot.riskLevel) }}</td></tr>
      <tr v-if="spot.freeOrPaid"><th>{{ $t('fee') }}</th><td>{{ feeLabel(spot.freeOrPaid) }}{{ spot.feeDesc ? '（' + spot.feeDesc + '）' : '' }}</td></tr>
      <tr v-if="spot.facilities && spot.facilities.length"><th>{{ $t('facilities') }}</th><td>{{ displayFacilities }}</td></tr>
      <tr v-if="spot.rating"><th>{{ $t('rating') }}</th><td>⭐ {{ spot.rating }}</td></tr>
    </tbody></table>

    <div class="tips-box" v-if="spot.tips">
      <div class="tips-title">⚠️ {{ $t('tips') }}</div>
      <div>{{ spot.tips }}</div>
    </div>

    <button class="nav-btn" @click="goNavigate">🗺️ {{ $t('navigate') }}</button>
    <button v-if="cloud && currentUser" class="report-btn" @click="goReport">🚩 {{ $t('report') }}</button>
  </div>
  <div v-else class="spot-detail">
    <p>{{ $t('notFoundSpot') }}</p>
    <router-link to="/">{{ $t('backHome') }}</router-link>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { categoryLabel } from '../utils/osm.js'
import { navigateTo } from '../utils/map.js'
import { riskLabel, riskClass, riskDesc, feeLabel } from '../utils/format.js'
import { subtypeLabel, waterQualityLabel, waterDepthLabel, flowSpeedLabel, facilitiesLabel } from '../utils/options.js'
import { getSpotById, reportSpot, dataMode } from '../services/spots.js'
import { currentUser } from '../utils/auth.js'

const { t } = useI18n()
const route = useRoute()
const spot = ref(null)
const cloud = dataMode() === 'cloud'

async function load(id) {
  spot.value = await getSpotById(id)
}
onMounted(() => load(route.params.id))
watch(() => route.params.id, (id) => load(id))

const displayFacilities = computed(() => {
  const f = spot.value && spot.value.facilities
  return f ? facilitiesLabel(f) : ''
})

function goNavigate() {
  if (spot.value) navigateTo(spot.value.lat, spot.value.lng)
}

async function goReport() {
  if (!spot.value) return
  const reason = prompt(t('reportPrompt'))
  if (!reason) return
  try {
    await reportSpot(spot.value.id, reason)
    alert(t('reportThanks'))
  } catch (e) {
    alert(t('reportFail'))
  }
}
</script>
