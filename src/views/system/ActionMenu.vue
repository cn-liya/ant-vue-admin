<script setup lang="ts">
import api from '@/api'
import { sys } from '@/router/menu'
import { EditOutlined, SyncOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { SysMenu, SystemAction, SystemActionSub, UpdateSystemActionArgs } from 'models'
import { reactive, ref } from 'vue'

const disabled = ref(false)
const loading = ref(true)
const actions = ref<SystemAction[]>([])
const menus = ref<SysMenu[]>([])

const sync = () => {
  api.sysMenuSync
    .do({ menus: sys }, disabled)
    .then((res) => {
      actions.value = res.actions
      menus.value = res.menus
      message.success('同步成功')
    })
    .catch(api.errorMsg)
}

const visible = ref(false)
const formState = reactive<UpdateSystemActionArgs>({ id: 0, title: '', sort: 0 })
var row: SystemActionSub = {
  id: 0,
  key_name: '',
  title: '',
  sort: 0
}
const edit = (item: SystemAction) => {
  row = item
  formState.id = item.id
  formState.title = item.title
  formState.sort = item.sort
  visible.value = true
}

const submitForm = () => {
  api.sysActionUpdate
    .do(formState, loading)
    .then(() => {
      row.title = formState.title
      row.sort = formState.sort
      visible.value = false
    })
    .catch(api.errorMsg)
}

{
  api.sysMenuList
    .do({}, loading)
    .then((res) => {
      actions.value = res.actions
      menus.value = res.menus
    })
    .catch(api.errorPage)
}
</script>

<template>
  <a-spin :spinning="loading">
    <a-row>
      <a-col :span="8">
        <a-button
          v-if="api.sysMenuSync.permit()"
          type="primary"
          @click="sync"
          :loading="disabled"
          style="margin-bottom: 16px"
        >
          <template #icon><SyncOutlined /></template>全量同步
        </a-button>
        <a-tree
          v-if="menus.length > 0"
          :tree-data="menus"
          :field-names="{ children: 'sub', title: 'title', key: 'name' }"
          block-node
          default-expand-all
        />
      </a-col>
      <a-col :span="16">
        <a-table
          :data-source="actions"
          row-key="id"
          children-column-name="sub"
          :pagination="false"
          size="small"
          bordered
        >
          <a-table-column
            key="key_name"
            title="接口路径"
            data-index="key_name"
            :sorter="(a: SystemAction, b: SystemAction) => a.key_name > b.key_name"
          />
          <a-table-column key="title" title="名称备注" data-index="title" />
          <a-table-column
            key="sort"
            title="排序"
            data-index="sort"
            :sorter="(a: SystemAction, b: SystemAction) => a.sort - b.sort"
            :width="80"
          />
          <a-table-column key="action" title="操作" :width="60">
            <template #default="{ record }">
              <a-button type="primary" size="small" shape="circle" @click="edit(record)">
                <template #icon><EditOutlined /></template>
              </a-button>
            </template>
          </a-table-column>
        </a-table>
      </a-col>
    </a-row>
  </a-spin>

  <a-drawer v-model:open="visible">
    <a-form :model="formState" @finish="submitForm" :label-col="{ span: 5 }">
      <a-spin :spinning="loading">
        <a-form-item label="接口路径">
          <span>{{ row.key_name }}</span>
        </a-form-item>
        <a-form-item label="名称备注">
          <a-input v-model:value="formState.title" :maxlength="16" />
        </a-form-item>
        <a-form-item label="排序">
          <a-input-number v-model:value="formState.sort" :min="0" :max="9999" :precision="0" />
        </a-form-item>
        <a-form-item :wrapper-col="{ offset: 5 }">
          <a-button type="primary" html-type="submit">确定</a-button>
          <a-button @click="visible = false">取消</a-button>
        </a-form-item>
      </a-spin>
    </a-form>
  </a-drawer>
</template>
