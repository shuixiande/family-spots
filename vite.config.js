import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg'],
      manifest: {
        name: '撒欢地图 · FamilySpots',
        short_name: '撒欢地图',
        description: '全球亲子户外地点地图：玩水、爬山、公园、乐园，社区共建、家长视角、安全优先',
        theme_color: '#1890ff',
        background_color: '#f5f7fa',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        lang: 'zh-CN',
        icons: [
          { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
          { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'maskable' }
        ]
      },
      runtimeCaching: [
        {
          // 地图瓦片：OSM 与高德，离线可回看已访问区域
          urlPattern: /^https:\/\/(webrd0[1-4]\.is\.autonavi\.com|[a-c]\.tile\.openstreetmap\.org)\//,
          handler: 'CacheFirst',
          options: { cacheName: 'map-tiles', expiration: { maxEntries: 500, maxAgeSeconds: 30 * 24 * 3600 } }
        },
        {
          // Overpass / Nominatim
          urlPattern: /^https:\/\/(overpass-api\.de|nominatim\.openstreetmap\.org)\//,
          handler: 'StaleWhileRevalidate',
          options: { cacheName: 'osm-api', expiration: { maxEntries: 100, maxAgeSeconds: 7 * 24 * 3600 } }
        },
        {
          // Supabase 数据读取(GET)：离线可回看；登出时清缓存避免共享设备泄漏
          urlPattern: /\/rest\/v1\//,
          handler: 'NetworkFirst',
          options: { cacheName: 'supabase-data', networkTimeoutSeconds: 5, expiration: { maxEntries: 100, maxAgeSeconds: 24 * 3600 } }
        }
      ]
    })
  ],
  server: {
    port: 3000,
    open: true
  },
  build: {
    rollupOptions: {
      output: {
        // 拆分第三方依赖，避免单 chunk 过大并改善缓存命中
        manualChunks: {
          leaflet: ['leaflet'],
          supabase: ['@supabase/supabase-js'],
          vue: ['vue', 'vue-router', 'vue-i18n']
        }
      }
    }
  }
})
