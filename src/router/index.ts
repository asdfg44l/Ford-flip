import { createRouter, createWebHashHistory } from 'vue-router'
import FlipCardRoutes from './modules/flipcard'

const routes = [
  ...FlipCardRoutes,
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router 