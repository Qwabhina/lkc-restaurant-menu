import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '../views/LandingPage.vue'
import MenuDisplay from '../views/MenuDisplay.vue'

const routes = [
  {
    path: '/',
    name: 'Landing',
    component: LandingPage
  },
  {
    path: '/menu/:section',
    name: 'Menu',
    component: MenuDisplay,
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL), // Uses the 'base' from vite.config.js automatically
  routes,
  scrollBehavior(to, from, savedPosition) {
    return { top: 0, behavior: 'smooth' }
  }
})

export default router
