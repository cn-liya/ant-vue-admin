<script setup lang="ts">
import GroupInput from '@/components/GroupInput.vue'
import UploadAudio from '@/components/UploadAudio.vue'
import UploadImage from '@/components/UploadImage.vue'
import UploadPDF from '@/components/UploadPDF.vue'
import UploadPictures from '@/components/UploadPictures.vue'
import UploadVideo from '@/components/UploadVideo.vue'
import { notification } from 'ant-design-vue'
import dayjs from 'dayjs'
import { reactive } from 'vue'

const formState = reactive({
  switch: false,
  date: '2023-06-01',
  date_begin: '2023-01-01',
  date_end: '2023-12-31',
  datetime: '2023-06-01 12:34:56',
  datetime_begin: '2023-01-01 00:00:00',
  datetime_end: '2023-12-31 23:59:59',
  inputs: ['input1', 'input2'],
  image: 'https://gw.alipayobjects.com/zos/rmsportal/rlpTLlbMzTNYuZGGCVYM.png',
  pictures: ['https://vuejs.org/images/logo.png'],
  audio: '',
  video: '',
  pdf: ''
})
const dateValues = reactive({
  date: formState.date ? dayjs(formState.date) : '',
  date_range: [
    formState.date_begin ? dayjs(formState.date_begin) : '',
    formState.date_end ? dayjs(formState.date_end) : ''
  ],
  datetime: formState.datetime ? dayjs(formState.datetime) : '',
  datetime_range: [
    formState.datetime_begin ? dayjs(formState.datetime_begin) : '',
    formState.datetime_end ? dayjs(formState.datetime_end) : ''
  ]
})
const submitForm = () => {
  notification.open({ message: JSON.stringify(formState) })
}
</script>

<template>
  <a-form :label-col="{ span: 5 }" style="width: 600px">
    <a-form-item label="开关">
      <a-switch v-model:checked="formState.switch" />
    </a-form-item>
    <a-form-item label="日期">
      <a-date-picker
        v-model:value="dateValues.date"
        format="YYYY-MM-DD"
        @change="(_: any, v: string) => (formState.date = v)"
      />
    </a-form-item>
    <a-form-item label="日期段">
      <a-range-picker
        separator="~"
        v-model:value="dateValues.date_range"
        format="YYYY-MM-DD"
        @change="(_: any, v: [string, string]) => ([formState.date_begin, formState.date_end] = v)"
      />
    </a-form-item>
    <a-form-item label="日期时间">
      <a-date-picker
        show-time
        v-model:value="dateValues.datetime"
        format="YYYY-MM-DD HH:mm:ss"
        @change="(_: any, v: string) => (formState.datetime = v)"
      />
    </a-form-item>
    <a-form-item label="日期时间段">
      <a-range-picker
        show-time
        separator="~"
        v-model:value="dateValues.datetime_range"
        format="YYYY-MM-DD HH:mm:ss"
        @change="
          (_: any, v: [string, string]) => ([formState.datetime_begin, formState.datetime_end] = v)
        "
      />
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
    <a-form-item label="PDF">
      <UploadPDF @ok="(path) => (formState.pdf = path)" clearable />
    </a-form-item>
    <a-form-item :wrapper-col="{ offset: 5 }">
      <span class="small-text">
        多图上传组件在upload组件的基础上集成了拖拽排序功能和loading效果。<br />
        音频视频和PDF预览使用html5原生组件，各浏览器显示效果略有差异。
      </span>
    </a-form-item>
    <a-form-item :wrapper-col="{ offset: 5 }">
      <a-button type="primary" @click="submitForm">确定</a-button>
    </a-form-item>
  </a-form>
</template>
