<script setup lang="ts">
import api from '@/api'
import { useCoreStore } from '@/stores/core'
import { LockOutlined, SafetyOutlined, UserOutlined } from '@ant-design/icons-vue'
import { Modal } from 'ant-design-vue'
import { LoginArgs } from 'models'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const formState = reactive<LoginArgs>({
  username: '',
  password: '',
  captcha: '',
  session_key: ''
})
const loading = ref(false)
const disabled = ref(true)
const base64_image = ref(
  'iVBORw0KGgoAAAANSUhEUgAAAAwAAAAFCAIAAAD+GJp4AAAAGUlEQVR4nGJ5//49AyHARFAF/RUBAgAA//8HKgLavlPODwAAAABJRU5ErkJggg=='
)
const router = useRouter()
const store = useCoreStore()

const submitForm = () => {
  api.login
    .do(formState, loading)
    .then((res) => {
      store.setAuth({
        token: res.token,
        user: res.username,
        super: res.is_super,
        actions: res.actions,
        menus: res.menus
      })
      if (res.pwd_tip) {
        Modal.confirm({
          type: 'warning',
          content: res.pwd_tip,
          onOk() {
            router.push('/password')
          },
          onCancel() {
            router.push('/')
          }
        })
      } else {
        router.push('/')
      }
    })
    .catch(api.errorMsg)
}

const getCaptcha = () => {
  api.captcha
    .do({}, disabled)
    .then((res) => {
      formState.session_key = res.session_key
      base64_image.value = res.base64_image
    })
    .catch(api.errorMsg)
}

{
  getCaptcha()
}
</script>

<template>
  <div id="login">
    <a-form :model="formState" @finish="submitForm" class="login-form" size="large">
      <div class="center">
        <img alt="Vue logo" src="@/assets/logo.svg" width="50" height="50" />
      </div>
      <br />

      <a-form-item
        name="username"
        :rules="[{ required: true, message: 'Please input your username!' }]"
      >
        <a-input v-model:value="formState.username" placeholder=" 用 户 名" :maxlength="32">
          <template #prefix><UserOutlined /></template>
        </a-input>
      </a-form-item>

      <a-form-item
        name="password"
        :rules="[{ required: true, message: 'Please input your password!' }]"
      >
        <a-input-password
          v-model:value="formState.password"
          autocomplete="new-password"
          placeholder=" 密 码"
          :maxlength="32"
        >
          <template #prefix><LockOutlined /></template>
        </a-input-password>
      </a-form-item>

      <a-form-item
        name="captcha"
        :rules="[{ required: true, message: 'Please input the captcha!' }]"
      >
        <a-input-group compact>
          <a-input
            v-model:value="formState.captcha"
            :disabled="!formState.session_key"
            placeholder=" 验 证 码"
            :maxlength="6"
            style="width: 70%"
          >
            <template #prefix><SafetyOutlined /></template>
          </a-input>
          <a-button
            type="link"
            :disabled="disabled"
            @click="getCaptcha"
            style="margin: 0; padding: 0; width: 30%"
          >
            <img
              :src="'data:image/jpg;base64,' + base64_image"
              title="点 击 获 取"
              alt="点 击 获 取"
              style="width: 100%; height: 38px"
            />
          </a-button>
        </a-input-group>
      </a-form-item>

      <a-form-item>
        <a-button type="primary" html-type="submit" :loading="loading" block>登录</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<style scoped>
#login {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: url('@/assets/bg.png') no-repeat;
  background-size: 100%;
}
.login-form {
  width: 330px;
}
</style>
