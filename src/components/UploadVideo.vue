<script setup lang="ts">
import api from '@/api'
import { CloudUploadOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { ref } from 'vue'

const props = defineProps<{
  src?: string
  clearable?: boolean
}>()
const emit = defineEmits<{
  (e: 'ok', path: string, host: string): void
}>()

const permit = api.uplaodAudio.permit()
const source = ref<string>(props.src || '')
const name = ref('')
const loading = ref(false)
const fileRef = ref()

const upload = (e: any) => {
  if (e.target.files.length < 1) {
    return
  }
  let file: File = e.target.files[0]
  e.target.value = null // e.target <=> fileRef.value
  if (!['video/mp4', 'video/webm', 'video/ogg'].includes(file.type)) {
    message.warning('视频类型仅支持mp4/webm/ogv')
    return
  }
  if (file.size > 5 << 20) {
    message.warning('文件大小不能超过5M')
    return
  }
  api.uplaodVideo
    .do(file, loading)
    .then((res) => {
      //source.value = res.host + res.path;
      source.value = URL.createObjectURL(file)
      name.value = file.name
      emit('ok', res.path, res.host)
    })
    .catch(api.errorMsg)
}

const clear = () => {
  source.value = ''
  emit('ok', '', '')
}

const sourceLoad = () => {
  URL.revokeObjectURL(source.value)
}

{
  if (source.value) {
    try {
      let url = new URL(source.value)
      emit('ok', url.pathname, url.origin)
      name.value = url.pathname
    } catch {
      void 0
    }
  }
}
</script>

<template>
  <a-spin :spinning="loading">
    <input
      type="file"
      ref="fileRef"
      v-show="false"
      accept="video/mp4,video/webm,video/ogg"
      :disabled="!permit"
      @change="upload"
    />
    <a-button
      type="primary"
      size="small"
      shape="circle"
      :disabled="!permit"
      @click="fileRef.click()"
    >
      <template #icon><CloudUploadOutlined /></template>
    </a-button>
    <a-button
      v-if="props.clearable && source"
      type="primary"
      size="small"
      shape="circle"
      @click="clear"
      danger
    >
      <template #icon><DeleteOutlined /></template>
    </a-button>
    <br />
    <video
      v-if="source"
      :src="source"
      :title="name"
      controls
      class="auto-width"
      @canplaythrough="sourceLoad"
    >
      当前浏览器不支持内嵌视频
    </video>
  </a-spin>
</template>
