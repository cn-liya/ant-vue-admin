import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { useCoreStore } from './stores/core'

const app = createApp(App)

app.use(createPinia())
app.use(router)

const store = useCoreStore()
store.initAuth()

router.beforeEach((to) => {
  if (store.auth.token) {
    if (to.name === 'login') {
      return '/'
    }
  } else {
    if (to.name !== 'login') {
      return { name: 'login' }
    }
  }
})

router.afterEach((to) => {
  if (store.routeAllow(to)) {
    store.setError('0')
  } else {
    store.setError('403')
  }
})

app.mount('#app')
