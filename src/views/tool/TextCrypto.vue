<script setup lang="ts">
import api from '@/api'
import { DownOutlined, UpOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { ref } from 'vue'

const loading = ref(false)
const plainText = ref('')
const cipherText = ref('')
const cipherPattern = /^[a-zA-Z\d+/]+={0,2}$/

const encrypt = () => {
  cipherText.value = ''
  api.cryptoEecrypt
    .do({ text: plainText.value.trim() }, loading)
    .then((res) => {
      cipherText.value = res.result
    })
    .catch(api.errorMsg)
}
const decrypt = () => {
  let text = cipherText.value.trim()
  if ((text.length & 3) !== 0 || !cipherPattern.test(text)) {
    message.warning('密文格式错误')
    return
  }
  plainText.value = ''
  api.cryptoDecrypt
    .do({ text }, loading)
    .then((res) => {
      plainText.value = res.result
    })
    .catch(api.errorMsg)
}
</script>

<template>
  <a-form :label-col="{ span: 4 }" style="width: 500px">
    <a-spin :spinning="loading">
      <a-form-item label="明文">
        <a-textarea v-model:value="plainText" :rows="3" :maxlength="100" />
      </a-form-item>
      <a-form-item :wrapper-col="{ offset: 11 }">
        <a-button
          type="primary"
          shape="round"
          @click="encrypt"
          :disabled="plainText.trim().length < 2 || !api.cryptoEecrypt.permit()"
        >
          <template #icon><DownOutlined /></template>
        </a-button>
        <a-button
          shape="round"
          @click="decrypt"
          :disabled="cipherText.trim().length < 4 || !api.cryptoDecrypt.permit()"
        >
          <template #icon><UpOutlined /></template>
        </a-button>
      </a-form-item>
      <a-form-item label="密文">
        <a-textarea v-model:value="cipherText" :rows="4" :maxlength="400" />
      </a-form-item>
    </a-spin>
  </a-form>
</template>
