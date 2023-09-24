import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    authKey?: string
    title: string[]
  }
}
