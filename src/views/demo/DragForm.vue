<script setup lang="ts">
import TagsInput from '@/components/TagsInput.vue'
import UploadImage from '@/components/UploadImage.vue'
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons-vue'
import { notification } from 'ant-design-vue'
import { reactive, ref } from 'vue'

type Content = {
  type: number
  value: string
}
type FormState = {
  title: string
  tags: string[]
  content: Content[]
}

type Part = Content & { uid: number }
const partList = ref<Part[]>([])

const formState = reactive<FormState>({
  title: '',
  tags: [],
  content: []
})

const typeMap = new Map([
  [1, '文本'],
  [2, '图片']
])

const addItem = (t: number) => {
  partList.value.push({ type: t, value: '', uid: Date.now() })
}
const delItem = (index: number) => {
  partList.value.splice(index, 1)
}
const submitForm = () => {
  let content: Content[] = []
  partList.value.forEach((item) => {
    content.push({ type: item.type, value: item.value })
  })
  formState.content = content
  notification.open({ message: JSON.stringify(formState) })
}

{
  let data = {
    title: '标题',
    tags: ['tag1', 'tag2', 'tag3'],
    content: [
      { type: 1, value: '文段。。。' },
      { type: 2, value: 'https://gw.alipayobjects.com/zos/rmsportal/rlpTLlbMzTNYuZGGCVYM.png' }
    ]
  } // mock fetch data
  formState.title = data.title
  formState.tags = data.tags
  data.content.forEach((item, index) => {
    partList.value.push({
      type: item.type,
      value: item.value,
      uid: index
    })
  })
}
</script>

<template>
  <a-form :label-col="{ span: 5 }" style="width: 600px">
    <a-form-item label="标题">
      <a-input v-model:value="formState.title" allow-clear />
    </a-form-item>
    <a-form-item label="关键词">
      <TagsInput
        :values="formState.tags"
        :limit="5"
        :maxlength="10"
        @ok="(values) => (formState.tags = values)"
      />
    </a-form-item>
    <a-divider dashed />
    <drag-sort v-model="partList" item-key="uid">
      <template #item="{ element, index }">
        <div class="drag">
          <a-form-item>
            <template #label>
              <a-button @click="delItem(index)">
                <template #icon><DeleteOutlined /></template>{{ typeMap.get(element.type) }}
              </a-button>
            </template>
            <a-textarea v-if="element.type === 1" v-model:value="element.value" :rows="3" />
            <UploadImage
              v-else-if="element.type === 2"
              :src="element.value"
              @ok="(path) => (element.value = path)"
            />
          </a-form-item>
        </div>
      </template>
    </drag-sort>
    <a-form-item :wrapper-col="{ offset: 5 }">
      <a-button v-for="v in typeMap" :key="v[0]" type="primary" @click="addItem(v[0])">
        <template #icon><PlusOutlined /></template>{{ v[1] }}
      </a-button>
    </a-form-item>
    <a-divider dashed />
    <a-form-item :wrapper-col="{ offset: 5 }">
      <a-button type="primary" @click="submitForm">确定</a-button>
    </a-form-item>
  </a-form>
</template>
