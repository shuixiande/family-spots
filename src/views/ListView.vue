<template>
  <div class="list-page">
    <div class="list-header">
      <h2>{{ $t('listTitle') }}</h2>
      <span class="list-count">{{ $t('count', { n: filteredSpots.length }) }}</span>
    </div>

    <div class="cat-chips" style="margin-bottom:16px">
      <button
        v-for="(meta, key) in categories"
        :key="key"
        class="cat-chip"
        :class="{ off: !activeCats[key] }"
        :style="{ '--c': meta.color }"
        @click="toggleCat(key)"
      >{{ meta.emoji }} {{ $t(meta.labelKey) }}</button>
    </div>

    <div v-if="filteredSpots.length === 0" class="empty-tip">
      {{ $t('empty') }}
    </div>

    <div v-for="spot in filteredSpots" :key="spot.id" class="spot-card" @click="goDetail(spot.id)">
      <div class="info">
        <div class="card-top">
          <div class="name">{{ spot.name }}</div>
          <div class="rating">⭐ {{ spot.rating || '—' }}</div>
        </div>
        <div class="meta">
          <span :style="{ color: categoryColor(spot.category) }">{{ categoryLabel(spot.category) }}</span>
          <span v-if="spot.subtype">{{ subtypeLabel(spot.subtype) }}</span>
          <span v-if="spot.freeOrPaid" class="tag" :class="spot.freeOrPaid === 'free' ? 'tag-free' : 'tag-paid'">{{ feeLabel(spot.freeOrPaid) }}</span>
          <span v-if="spot.riskLevel" class="tag" :class="'tag-risk-' + riskClass(spot.riskLevel)">{{ $t('safetyLabel') }}{{ riskLabel(spot.riskLevel) }}</span>
          <span v-if="spot.kidFriendly !== false" class="tag tag-kid">{{ $t('kid') }}</span>
        </div>
        <div class="card-bottom" v-if="spot.address">
          📍 {{ spot.address }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { CATEGORY_META, categoryLabel, categoryColor } from '../utils/osm.js'
import { riskClass, riskLabel, feeLabel } from '../utils/format.js'
import { subtypeLabel } from '../utils/options.js'
import { fetchSpots } from '../services/spots.js'

useI18n()
const router = useRouter()
const categories = CATEGORY_META
const activeCats = ref({ water: true, mountain: true, park: true, playground: true })

const allSpots = ref([])
const filteredSpots = computed(() => allSpots.value.filter(s => activeCats.value[s.category]))

onMounted(async () => {
  allSpots.value = await fetchSpots({ limit: 500 })
})

function toggleCat(key) {
  activeCats.value[key] = !activeCats.value[key]
}
function goDetail(id) {
  router.push('/spot/' + id)
}
</script>
