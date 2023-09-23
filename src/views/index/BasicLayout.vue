<script setup lang="ts">
import RouteMenu from './RouteMenu.vue'
import api from '@/api'
import { menus } from '@/router/menu'
import { useCoreStore } from '@/stores/core'
import { MenuBranch, MenuItem } from '@/types/route'
import {
  HomeFilled,
  LockOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserSwitchOutlined
} from '@ant-design/icons-vue'
import { ref } from 'vue'
import { RouteLocationNormalizedLoaded, onBeforeRouteUpdate, useRouter } from 'vue-router'

const minSide = '64px'
const maxSide = '260px'
const collapse = ref(false)
const openKeys = ref<string[]>([])
const selectedKeys = ref<string[]>([])
const router = useRouter()
const store = useCoreStore()

function dfs(mb: MenuBranch[]): MenuItem[] {
  let arr: MenuItem[] = []
  for (let item of mb) {
    let mi: MenuItem = {
      name: item.name,
      title: item.title,
      icon: item.icon
    }
    if (item.sub) {
      let sub = dfs(item.sub)
      if (sub.length > 0) {
        mi.sub = sub
        arr.push(mi)
      }
    } else {
      if (store.menuAllow(item.authKey)) {
        arr.push(mi)
      }
    }
  }
  return arr
}

const menuItems = dfs(menus)

const logout = () => {
  api.logout
    .do({})
    .then(() => {
      store.removeAuth()
      router.push('/login')
    })
    .catch(api.void0)
}

const setSelectMenu = (to: RouteLocationNormalizedLoaded) => {
  if (to.name) {
    let name = to.name.toString()
    selectedKeys.value = [name + ':']
    if (openKeys.value.length == 0 && name.includes('.')) {
      let parts = name.split('.')
      for (let i = parts.length - 1; i > 0; i--) {
        openKeys.value.push(parts.slice(0, i).join('.'))
      }
    }
  }
}

{
  setSelectMenu(router.currentRoute.value)
  onBeforeRouteUpdate((to) => {
    setSelectMenu(to)
  })
}
</script>

<template>
  <a-layout>
    <a-layout-sider v-model:collapsed="collapse" width="260" collapsed-width="64" collapsible>
      <div class="logo" @click="$router.push('/')">
        <img src="@/assets/logo.svg" />
        <span>Antd Vue Admin</span>
      </div>
      <a-menu
        mode="inline"
        theme="dark"
        v-model:open-keys="openKeys"
        v-model:selected-keys="selectedKeys"
      >
        <RouteMenu :items="menuItems" />
      </a-menu>
      <template #trigger>
        <div>
          <MenuUnfoldOutlined v-if="collapse" />
          <MenuFoldOutlined v-else />
        </div>
      </template>
    </a-layout-sider>

    <a-layout :style="{ 'margin-left': collapse ? minSide : maxSide }">
      <a-layout-header>
        <a-breadcrumb v-if="store.routeAllow($route)">
          <a-breadcrumb-item><HomeFilled /></a-breadcrumb-item>
          <a-breadcrumb-item v-for="(title, index) in $route.meta.title" :key="index">
            {{ title }}
          </a-breadcrumb-item>
        </a-breadcrumb>
        <a-dropdown arrow placement="bottom">
          <span><UserSwitchOutlined /> {{ store.auth.user }}</span>
          <template #overlay>
            <a-menu>
              <a-menu-item @click="$router.push('/password')">
                <template #icon><LockOutlined /></template>修改密码
              </a-menu-item>
              <a-menu-item @click="logout">
                <template #icon><LogoutOutlined /></template>退出登录
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </a-layout-header>

      <a-layout-content>
        <div class="main">
          <a-result
            v-if="store.error.code"
            :status="store.error.status"
            :title="store.error.title"
            :sub-title="store.error.subTitle"
          >
            <template #extra>
              <a-button type="primary" @click="$router.push('/')">Back</a-button>
              <a-button
                v-show="store.error.code === '500' || store.error.code === 'error'"
                @click="$router.replace($route)"
              >
                Retry
              </a-button>
            </template>
          </a-result>
          <RouterView v-else />
        </div>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<style scoped>
.ant-layout-sider {
  position: fixed;
  & .logo {
    height: 60px;
    line-height: 60px;
    font-size: 18px;
    color: #fff;
    overflow: hidden;
    cursor: pointer;
    & > img {
      width: 32px;
      margin: auto 16px;
      vertical-align: middle;
    }
  }
  & .ant-menu {
    height: calc(100vh - 110px);
    border-inline-end: none;
    overflow: hidden auto;
    scrollbar-width: none;
    &:hover {
      scrollbar-width: thin;
    }
  }
}
.ant-layout-header {
  height: 60px;
  background-color: #fff;
  padding-inline: 20px;
  display: flex;
  justify-content: space-between;
  & > .ant-breadcrumb {
    line-height: 60px;
  }
  & > .ant-dropdown-trigger {
    line-height: 60px;
    font-size: 18px;
  }
}
.main {
  margin: 18px;
  padding: 20px;
  background-color: #fff;
  min-height: calc(100vh - 96px);
}
</style>
