import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import auth from '@/middleware/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView
    },
    {
      path: '/choose-event',
      name: 'choose-event',
      component: () => import('../views/ChooseEvent.vue'),
      meta: {
        middleware: auth
      }
    },
    {
      path: '/event/:id',
      name: 'event-scanner',
      component: () => import('../views/EventScanner.vue'),
      meta: {
        middleware: auth
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.meta.middleware) {
    // @ts-ignore
    return to.meta.middleware(router, next)
  }
  
  return next()
})

export default router
