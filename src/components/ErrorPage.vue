<script setup lang="ts">
import { ResultProps } from 'ant-design-vue'

defineProps<{
  status: ResultProps['status']
  title: ResultProps['title']
  subTitle: ResultProps['subTitle']
}>()
</script>

<template>
  <a-result :status="status" :title="title" :sub-title="subTitle">
    <template #extra>
      <a-button type="primary" @click="$router.push('/')">Back</a-button>
    </template>
  </a-result>
</template>
