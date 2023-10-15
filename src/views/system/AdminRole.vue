<script setup lang="ts">
import api from '@/api'
import { FormInstance, message } from 'ant-design-vue'
import { ListArgs, RoleItem, RoleUpdateArgs, SysMenu, SystemAction } from 'models'
import { reactive, ref } from 'vue'

const tableData = ref<RoleItem[]>([])
const params = reactive<ListArgs>({
  page: 1,
  size: 10
})
const total = ref(0)
const loading = ref(true)

const queryData = () => {
  api.roleList
    .do(params, loading)
    .then((res) => {
      total.value = res.total
      tableData.value = res.list
    })
    .catch(api.errorPage)
}

var index = -1
const visible = ref(false)
const formRef = ref<FormInstance>()
const formState = reactive<RoleUpdateArgs>({ id: 0, name: '', actions: [], menus: [] })
const checkMenus = ref<SysMenu[]>([])
const checkActions = ref<SystemAction[]>([])

const openForm = (item: RoleItem, idx = -1) => {
  index = idx
  formState.id = item.id
  formState.name = item.name
  formState.actions = item.actions
  formState.menus = item.menus
  visible.value = true
}

const resetForm = () => {
  formRef.value?.clearValidate()
  checkMenus.value = []
  checkActions.value = []
}
const closeForm = () => {
  visible.value = false
  resetForm()
}

const submitForm = () => {
  if (checkMenus.value.length > 0) {
    let m: string[] = [] // leaf only
    checkMenus.value.forEach((item) => {
      if (!item.sub) {
        m.push(item.name)
      }
    })
    formState.menus = m
  }
  if (checkActions.value.length > 0) {
    let a: string[] = [] // leaf only
    checkActions.value.forEach((item) => {
      if (!item.sub) {
        a.push(item.key_name)
      }
    })
    formState.actions = a
  }
  if (formState.id) {
    api.roleUpdate
      .do(formState, loading)
      .then(() => {
        tableData.value[index].name = formState.name
        tableData.value[index].actions = formState.actions
        tableData.value[index].menus = formState.menus
        message.success('操作成功')
        closeForm()
      })
      .catch(api.errorMsg)
  } else {
    api.roleCreate
      .do(formState, loading)
      .then(() => {
        message.success('操作成功')
        closeForm()
        params.page = 1
        queryData()
      })
      .catch(api.errorMsg)
  }
}

const menus = ref<SysMenu[]>([])
const actions = ref<SystemAction[]>([])

{
  api.sysMenuList
    .do({})
    .then((res) => {
      menus.value = res.menus
      actions.value = res.actions
      queryData()
    })
    .catch(api.errorPage)
}
</script>

<template>
  <a-spin :spinning="loading">
    <a-table :data-source="tableData" row-key="id" :pagination="false" size="small" bordered>
      <a-table-column key="id" title="ID" data-index="id" :width="80" />
      <a-table-column key="name" title="名称" data-index="name" />
      <a-table-column key="action">
        <template #title>
          <a-space class="justify">
            <span>操作</span>
            <a-button
              v-if="api.roleCreate.permit()"
              type="link"
              size="small"
              @click="openForm({ id: 0, name: '', actions: [], menus: [] })"
            >
              + 新增
            </a-button>
          </a-space>
        </template>
        <template #default="{ record, index }">
          <a-button
            v-if="api.roleUpdate.permit()"
            type="primary"
            size="small"
            @click="openForm(record, index)"
          >
            编辑
          </a-button>
        </template>
      </a-table-column>
    </a-table>
    <a-pagination
      size="small"
      v-model:current="params.page"
      v-model:page-size="params.size"
      :page-size-options="['10', '20', '50', '100']"
      show-size-changer
      show-quick-jumper
      :total="total"
      :show-total="(total: number, range: number[]) => `${range[0]}~${range[1]} / ${total}`"
      @change="queryData"
    />
  </a-spin>

  <a-drawer
    v-model:open="visible"
    @close="resetForm"
    :title="(formState.id ? '编辑' : '新增') + `角色`"
    :width="800"
  >
    <a-form ref="formRef" :model="formState" @finish="submitForm" :label-col="{ span: 6 }">
      <a-spin :spinning="loading">
        <a-row>
          <a-col :span="10">
            <a-form-item
              label="角色名称"
              name="name"
              :rules="[{ required: true, min: 2, message: '请输入最少2个字符', trigger: 'blur' }]"
            >
              <a-input v-model:value="formState.name" :maxlength="32" />
            </a-form-item>
            <a-form-item label="菜单权限">
              <a-tree
                :tree-data="menus"
                :field-names="{ children: 'sub', title: 'title', key: 'name' }"
                v-model:checked-keys="formState.menus"
                @check="
                  (_: any, e: any) => {
                    checkMenus = e.checkedNodes
                  }
                "
                checkable
                block-node
                default-expand-all
              />
            </a-form-item>
          </a-col>
          <a-col :span="14">
            <a-form-item label="功能权限" style="overflow: hidden">
              <a-tree
                :tree-data="actions"
                :field-names="{ children: 'sub', key: 'key_name' }"
                v-model:checked-keys="formState.actions"
                @check="
                  (_: any, e: any) => {
                    checkActions = e.checkedNodes
                  }
                "
                checkable
                block-node
              >
                <template #title="{ title, key_name }">
                  <span :title="key_name">{{ title }} {{ key_name }}</span>
                </template>
              </a-tree>
            </a-form-item>
          </a-col>
        </a-row>
        <div class="center">
          <a-button type="primary" html-type="submit">确定</a-button>
          <a-button @click="closeForm">取消</a-button>
        </div>
      </a-spin>
    </a-form>
  </a-drawer>
</template>
<style scoped>
.ant-tree-title span {
  white-space: nowrap;
  overflow: hidden;
}
</style>
