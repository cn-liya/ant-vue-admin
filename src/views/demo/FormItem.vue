<script setup lang="ts">
import GroupInput from '@/components/GroupInput.vue'
import UploadAudio from '@/components/UploadAudio.vue'
import UploadImage from '@/components/UploadImage.vue'
import UploadPictures from '@/components/UploadPictures.vue'
import UploadVideo from '@/components/UploadVideo.vue'
import { reactive } from 'vue'

const formState = reactive({
  switch: false,
  number: 1,
  inputs: ['input1', 'input2'],
  image: 'https://gw.alipayobjects.com/zos/rmsportal/rlpTLlbMzTNYuZGGCVYM.png',
  pictures: ['https://vuejs.org/images/logo.png'],
  audio: '',
  video: ''
})
</script>

<template>
  <a-form ref="formRef" :label-col="{ span: 5 }" style="width: 600px">
    <a-form-item label="开关">
      <a-switch v-model:checked="formState.switch" />
    </a-form-item>
    <a-form-item label="数字">
      <a-input-number v-model:value="formState.number" :min="1" :max="9" :precision="0" />
    </a-form-item>
    <a-form-item label="动态输入框组">
      <GroupInput
        :values="formState.inputs"
        :limit="5"
        :maxlength="20"
        @ok="(values) => (formState.inputs = values)"
      />
    </a-form-item>
    <a-form-item label="单图">
      <UploadImage :src="formState.image" @ok="(path) => (formState.image = path)" clearable />
    </a-form-item>
    <a-form-item label="多图">
      <UploadPictures
        :limit="5"
        :urls="formState.pictures"
        @ok="(paths) => (formState.pictures = paths)"
      />
    </a-form-item>
    <a-form-item label="音频">
      <UploadAudio @ok="(path) => (formState.audio = path)" clearable />
    </a-form-item>
    <a-form-item label="视频">
      <UploadVideo @ok="(path) => (formState.video = path)" clearable />
    </a-form-item>
    <a-form-item :wrapper-col="{ offset: 5 }">
      <span class="tip">
        多图上传组件在upload组件的基础上集成了拖拽排序功能和loading效果。<br />
        音频视频预览使用html5原生组件，各浏览器显示效果略有差异。
      </span>
    </a-form-item>
  </a-form>
  <a-divider dashed />
  <output>{{ formState }}</output>
</template>
