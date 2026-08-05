<template>
  <div class="list-page">
    <div class="list-header"><h2>{{ $t('moderateTitle') }}</h2></div>

    <p v-if="!allowed" class="empty-tip">{{ $t('noPermission') }}</p>
    <template v-else>
      <div v-if="loading" class="empty-tip">{{ $t('loading') }}</div>
      <div v-else-if="reports.length === 0" class="empty-tip">{{ $t('empty') }}</div>

      <div v-for="r in reports" :key="r.id" class="spot-card" style="cursor:default">
        <div class="info">
          <div class="card-top">
            <div class="name">{{ r.spots?.name || r.spot_id }}</div>
            <div class="rating">{{ r.spots?.status === 'hidden' ? $t('hide') : $t('unhide') }}</div>
          </div>
          <div class="meta"><span>{{ $t('reason') }}：{{ r.reason }}</span></div>
          <div class="local-actions" style="margin-top:8px">
            <button class="btn-sm" @click="goSpot(r.spot_id)">{{ $t('back') }}</button>
            <button v-if="r.spots?.status !== 'hidden'" class="btn-sm btn-danger" @click="setStatus(r.spot_id, 'hidden')">{{ $t('hide') }}</button>
            <button v-else class="btn-sm" @click="setStatus(r.spot_id, 'visible')">{{ $t('unhide') }}</button>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { fetchReports, isModerator, setSpotStatus } from '../services/spots.js'

const { t } = useI18n()
const router = useRouter()
const allowed = ref(false)
const loading = ref(true)
const reports = ref([])

onMounted(async () => {
  allowed.value = await isModerator()
  if (allowed.value) reports.value = await fetchReports()
  loading.value = false
})

function goSpot(id) {
  router.push('/spot/' + id)
}

async function setStatus(id, status) {
  try {
    await setSpotStatus(id, status)
    reports.value = await fetchReports()
  } catch (e) {
    alert(t('saveError') + (e.message || e))
  }
}
</script>
