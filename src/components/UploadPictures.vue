<script setup lang="ts">
import api from '@/api'
import { DeleteOutlined, PlusOutlined, ZoomInOutlined } from '@ant-design/icons-vue'
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

const remove = (index: number) => {
  fileList.value.splice(index, 1)
  changeFile()
}

function setBase64(uid: string) {
  fileList.value.forEach((item) => {
    if (item.uid === uid) {
      const reader = new FileReader()
      reader.readAsDataURL(item.originFileObj!)
      reader.onload = () => {
        item.url = reader.result as string
      }
    }
  })
}
const onChange: UploadProps['onChange'] = (info) => {
  if (!info.file.status || info.file.status === 'error') {
    fileList.value = fileList.value.filter((e) => e.status && e.status !== 'error')
  } else if (info.file.status === 'done') {
    setBase64(info.file.uid)
    changeFile()
  }
}

const onPreview: UploadProps['onPreview'] = (file) => {
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
  <drag-sort tag="div" v-model="fileList" item-key="uid" @end="changeFile">
    <template #item="{ element, index }">
      <div class="upload-list-item" :title="element.name">
        <template v-if="element.url">
          <img class="upload-list-item-thumbnail" :src="element.url" alt="" />
          <span class="upload-list-item-box upload-list-item-actions">
            <span @click="onPreview(element)"><ZoomInOutlined /></span>
            <span @click="remove(index)"><DeleteOutlined /></span>
          </span>
        </template>
        <template v-else>
          <a-spin class="upload-list-item-box" />
        </template>
      </div>
    </template>
    <template #footer>
      <a-upload
        class="upload-wrapper"
        v-show="api.uplaodImage.permit() && (!limit || fileList.length < limit)"
        multiple
        accept="image/jpeg,image/png,image/gif"
        @change="onChange"
        :before-upload="beforeUpload"
        v-model:file-list="fileList"
        list-type="picture-card"
        :custom-request="customRequest"
        :max-count="limit"
        :show-upload-list="false"
      >
        <span><PlusOutlined /></span>
      </a-upload>
    </template>
  </drag-sort>
  <a-modal v-model:open="visible" class="center" title="&nbsp" :footer="null">
    <img :src="previewSrc" alt="Preview Image" class="border-img" />
  </a-modal>
</template>

<style scoped>
.upload-list-item {
  position: relative;
  overflow: hidden;
  width: 102px;
  height: 102px;
  margin: 0 8px 8px 0;
  display: inline-flex;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  vertical-align: top;
}
.upload-list-item-thumbnail {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.upload-list-item-box {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  display: inline-flex;
  justify-content: center;
  align-items: center;
}
.upload-list-item-actions {
  gap: 12px;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
  transition: 0.3s;
  &:hover {
    opacity: 1;
  }
  &:active {
    cursor: move;
  }
  & > span {
    color: #fff;
    font-size: 16px;
    cursor: pointer;
  }
}
.ant-upload-picture-card-wrapper {
  width: auto;
}
</style>
