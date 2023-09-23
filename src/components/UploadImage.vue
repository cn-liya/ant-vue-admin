<script setup lang="ts">
import api from '@/api'
import { CloseCircleOutlined, CloudUploadOutlined } from '@ant-design/icons-vue'
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
  if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
    message.warning('图片类型仅支持jpg/png/gif')
    return
  }
  if (file.size > 500 << 10) {
    message.warning('文件大小不能超过500K')
    return
  }
  api.uplaodImage
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
  <div class="upload-img-box">
    <a-spin :spinning="loading">
      <span v-if="source && clearable" class="del" @click="clear">
        <CloseCircleOutlined style="font-size: 18px" />
      </span>
      <input
        type="file"
        ref="fileRef"
        v-show="false"
        accept="image/jpeg,image/png,image/gif"
        :disabled="!permit"
        @change="upload"
      />
      <img
        v-if="source"
        alt="Preview Image"
        class="border-img"
        :src="source"
        :title="name"
        @load="sourceLoad"
        @click="fileRef.click()"
        :style="{ cursor: permit ? 'pointer' : 'not-allowed' }"
      />
      <a-button
        v-else
        type="primary"
        size="small"
        shape="circle"
        :disabled="!permit"
        @click="fileRef.click()"
      >
        <template #icon><CloudUploadOutlined /></template>
      </a-button>
    </a-spin>
  </div>
</template>

<style scoped>
.upload-img-box {
  display: inline-flex;
  & .del {
    position: absolute;
    top: -10px;
    right: -10px;
    opacity: 0.2;
    transition: 0.3s;
    &:hover {
      opacity: 1;
    }
  }
}
</style>
