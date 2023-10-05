<script setup lang="ts">
import api from '@/api'
import { PlusOutlined } from '@ant-design/icons-vue'
import { UploadFile, UploadProps, message } from 'ant-design-vue'
import { ref } from 'vue'

const props = defineProps<{
  urls?: string[]
  limit?: number
}>()
const emit = defineEmits<{
  (e: 'ok', paths: string[]): void
}>()

const fileList = ref<UploadFile[]>([])
const visible = ref(false)
const previewSrc = ref('')

const changeFile = () => {
  let paths: string[] = []
  fileList.value.forEach((item) => {
    if (item.status === 'done' && item.response) {
      paths.push(item.response as string)
    }
  })
  emit('ok', paths)
}

const onChange: UploadProps['onChange'] = (info) => {
  if (!info.file.status || info.file.status === 'error') {
    fileList.value = fileList.value.filter((e) => e.status && e.status != 'error')
  } else if (info.file.status == 'done' || info.file.status == 'removed') {
    changeFile()
  }
}

function getBase64(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })
}
const onPreview: UploadProps['onPreview'] = async (file) => {
  if (!file.url && file.originFileObj) {
    file.url = (await getBase64(file.originFileObj)) as string
  }
  previewSrc.value = file.url!
  visible.value = true
}

const beforeUpload: UploadProps['beforeUpload'] = (file, fs) => {
  if (props.limit && fileList.value.length + fs.length > props.limit) {
    message.warning({
      content: `最多上传${props.limit}张图片`,
      key: 'over-limit'
    })
    return false
  }
  if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
    message.warning('图片类型仅支持jpg/png/gif')
    return false
  }
  if (file.size > 500 << 10) {
    message.warning('文件大小不能超过500K')
    return false
  }
  return true
}

const customRequest: UploadProps['customRequest'] = (option) => {
  api.uplaodImage
    .do(option.file as File)
    .then((res) => {
      option.onSuccess && option.onSuccess(res.path)
    })
    .catch((err) => {
      let text = api.errorText(err)
      option.onError && option.onError(err)
      message.error(text)
    })
}

{
  if (props.urls && props.urls.length > 0) {
    let paths: string[] = []
    props.urls.forEach((item, index) => {
      try {
        let u = new URL(item)
        paths.push(u.pathname)
        fileList.value.push({
          name: u.pathname,
          url: item,
          uid: index.toString(),
          response: u.pathname,
          status: 'done'
        })
      } catch {
        void 0
      }
    })
    emit('ok', paths)
  }
}
</script>

<template>
  <a-upload
    multiple
    accept="image/jpeg,image/gif,image/png"
    :before-upload="beforeUpload"
    v-model:file-list="fileList"
    list-type="picture-card"
    :custom-request="customRequest"
    :max-count="props.limit"
    @preview="onPreview"
    @change="onChange"
  >
    <span v-if="api.uplaodImage.permit() && (!limit || fileList.length < limit)">
      <PlusOutlined />
    </span>
  </a-upload>
  <a-modal v-model:open="visible" class="center" title="&nbsp" :footer="null">
    <img :src="previewSrc" alt="Preview Image" class="border-img" />
  </a-modal>
</template>
