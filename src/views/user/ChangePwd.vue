<script setup lang="ts">
import api from '@/api'
import { FormInstance, message } from 'ant-design-vue'
import { ref, reactive } from 'vue'

const validatePass = async (_: unknown, value: string) => {
  if (value === '') {
    return Promise.reject('Please input the password!')
  } else if (value.length < 6) {
    return Promise.reject('Please input at least 6 chars!')
  } else {
    if (formState.checkPwd !== '') {
      formRef.value?.validateFields('checkPwd')
    }
    return Promise.resolve()
  }
}
const validatePass2 = async (_: unknown, value: string) => {
  if (value === '') {
    return Promise.reject('Please input the password again!')
  } else if (value !== formState.password) {
    return Promise.reject("Two inputs don't match!")
  } else {
    return Promise.resolve()
  }
}
const rules = {
  password: [{ validator: validatePass, trigger: 'blur' }],
  checkPwd: [{ validator: validatePass2, trigger: 'blur' }]
}

const formRef = ref<FormInstance>()
const formState = reactive({
  password: '',
  checkPwd: ''
})
const loading = ref(false)

const resetForm = () => {
  formRef.value?.resetFields()
}

const submitForm = () => {
  api.changePwd
    .do({ password: formState.password }, loading)
    .then(() => {
      message.success('修改成功！')
      resetForm()
    })
    .catch(api.errorMsg)
}
</script>

<template>
  <a-form
    ref="formRef"
    :model="formState"
    :rules="rules"
    @finish="submitForm"
    :label-col="{ span: 6 }"
    style="width: 500px"
  >
    <a-spin :spinning="loading">
      <a-form-item label="新密码" name="password" has-feedback>
        <a-input
          v-model:value="formState.password"
          type="password"
          :maxlength="32"
          autocomplete="new-password"
        />
      </a-form-item>
      <a-form-item label="确认密码" name="checkPwd" has-feedback>
        <a-input
          v-model:value="formState.checkPwd"
          type="password"
          :maxlength="32"
          autocomplete="off"
        />
      </a-form-item>
      <a-form-item :wrapper-col="{ offset: 6 }">
        <a-button type="primary" html-type="submit">确定</a-button>
        <a-button @click="resetForm">取消</a-button>
      </a-form-item>
    </a-spin>
  </a-form>
</template>
