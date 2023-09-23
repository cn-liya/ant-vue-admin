import { table } from './types/table'
import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    authKey?: string
    title: string[]
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $table: typeof table
  }
}
