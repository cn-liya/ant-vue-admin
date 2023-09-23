<script setup lang="ts">
import { DeleteOutlined } from '@ant-design/icons-vue'
import { ref } from 'vue'

const props = defineProps<{
  values?: string[]
  limit?: number
  maxlength?: number
}>()
const emit = defineEmits<{
  (e: 'ok', values: string[]): void
}>()

const state = ref<string[]>(props.values || [])

const remove = (index: number) => {
  state.value.splice(index, 1)
  emit('ok', state.value)
}

const editInput = (index: number) => {
  let val = state.value[index].trim()
  if (val) {
    state.value[index] = val
    emit('ok', state.value)
  } else {
    remove(index)
  }
}

const inputValue = ref('')
const handleInputConfirm = () => {
  let val = inputValue.value.trim()
  if (val) {
    state.value.push(val)
    emit('ok', state.value)
  }
  inputValue.value = ''
}
</script>

<template>
  <div class="space-block">
    <a-input-group v-for="(_, index) in state" :key="index" compact>
      <a-input
        v-model:value="state[index]"
        @blur="editInput(index)"
        style="width: calc(100% - 46px)"
      />
      <a-button @click="remove(index)" style="width: 46px">
        <template #icon><DeleteOutlined /></template>
      </a-button>
    </a-input-group>
    <a-input-group compact>
      <a-input
        v-if="!limit || state.length < limit"
        v-model:value="inputValue"
        @keyup.enter="handleInputConfirm"
        @blur="handleInputConfirm"
        :maxlength="maxlength"
      />
    </a-input-group>
  </div>
</template>
