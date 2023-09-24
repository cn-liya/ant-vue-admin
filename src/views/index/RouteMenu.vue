<script setup lang="ts">
import { MenuItem } from '@/types/route'

defineProps<{
  items: MenuItem[]
}>()
</script>

<template>
  <template v-for="item in items" :key="item.name">
    <a-sub-menu v-if="item.sub" :key="item.name">
      <template v-if="item.icon" #icon>
        <component :is="item.icon" />
      </template>
      <template #title>{{ item.title }}</template>
      <RouteMenu :items="item.sub" />
    </a-sub-menu>
    <a-menu-item v-else :key="item.name + ':'">
      <template v-if="item.icon" #icon>
        <component :is="item.icon" />
      </template>
      <RouterLink :to="{ name: item.name }">{{ item.title }}</RouterLink>
    </a-menu-item>
  </template>
</template>
