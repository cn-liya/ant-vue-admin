import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/user/UserLogin.vue')
    },
    {
      path: '/',
      name: 'index',
      component: () => import('@/views/index/BasicLayout.vue'),
      children: [
        {
          path: '/home',
          alias: '/',
          name: 'home',
          component: () => import('@/views/index/HomeWelcome.vue')
        }
      ]
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/components/ErrorPage.vue')
    }
  ]
})

export default router
