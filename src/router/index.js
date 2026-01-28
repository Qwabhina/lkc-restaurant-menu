import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '../views/LandingPage.vue'
import MenuDisplay from '../components/MenuDisplay.vue'

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
  history: createWebHistory('/menu/'), // Set base path here as well
  routes,
  scrollBehavior(to, from, savedPosition) {
    return { top: 0, behavior: 'smooth' }
  }
})

export default router
