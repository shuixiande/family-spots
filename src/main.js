import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import { i18n } from './i18n/index.js'
import './styles/main.css'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: () => import('./views/MapView.vue') },
    { path: '/list', component: () => import('./views/ListView.vue') },
    { path: '/spot/:id', component: () => import('./views/SpotDetail.vue') },
    { path: '/add', component: () => import('./views/AddSpot.vue') },
    { path: '/login', component: () => import('./views/AuthView.vue') },
    { path: '/moderate', component: () => import('./views/ModerateView.vue') },
    { path: '/:pathMatch(.*)*', redirect: '/' }
  ]
})

createApp(App).use(router).use(i18n).mount('#app')
