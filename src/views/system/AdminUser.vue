<script setup lang="ts">
import api from '@/api'
import { TableInstance, buildTable } from '@/types/table'
import rand from '@/utils/rand'
import { FormInstance, message } from 'ant-design-vue'
import {
  AdminCreateArgs,
  AdminItem,
  AdminListArgs,
  AdminSetPwdArgs,
  AdminSetRoleArgs,
  OptionItem
} from 'models'
import { ref, reactive } from 'vue'

const roleList = ref<OptionItem[]>([])
const roleOpt = ref<TableInstance<number>>()
const tableData = ref<AdminItem[]>([])
const params = reactive<AdminListArgs>({
  page: 1,
  size: 10,
  role_id: 0,
  username: '',
  status: 0
})
const total = ref(0)
const loading = ref(true)

const queryData = () => {
  api.adminList
    .do(params, loading)
    .then((res) => {
      total.value = res.total
      tableData.value = res.list
    })
    .catch(api.errorPage)
}

const searchFormRef = ref<FormInstance>()
const searchFormState = reactive({
  role_id: 0,
  username: '',
  status: 0
})
const submitSearch = () => {
  params.role_id = searchFormState.role_id
  params.username = searchFormState.username
  params.status = searchFormState.status
  params.page = 1
  queryData()
}

const setStatus = (id: number, status: number, idx: number) => {
  api.adminSetStatus
    .do({ id: id, status: status }, loading)
    .then(() => {
      tableData.value[idx].status = status
      message.success('操作成功！')
    })
    .catch(api.errorMsg)
}

var index = -1
const user = ref('')
const roleVisible = ref(false)
const roleFormRef = ref<FormInstance>()
const roleFormState = reactive<AdminSetRoleArgs>({ id: 0, role_id: 0 })

const openRole = (item: AdminItem, idx: number) => {
  index = idx
  user.value = item.username
  roleFormState.id = item.id
  roleFormState.role_id = item.role_id
  roleVisible.value = true
}
const resetRole = () => {
  roleFormRef.value?.resetFields()
}
const closeRole = () => {
  roleVisible.value = false
  resetRole()
}
const submitRole = () => {
  api.adminSetRole
    .do(roleFormState, loading)
    .then(() => {
      tableData.value[index].role_id = roleFormState.role_id
      message.success('变更成功')
      closeRole()
    })
    .catch(api.errorMsg)
}

const pwdVisible = ref(false)
const pwdFormRef = ref<FormInstance>()
const pwdFormState = reactive<AdminSetPwdArgs>({ id: 0, password: '' })

const openPwd = (item: AdminItem) => {
  user.value = item.username
  pwdFormState.id = item.id
  pwdVisible.value = true
}
const resetPwd = () => {
  pwdFormRef.value?.resetFields()
}
const closePwd = () => {
  pwdVisible.value = false
  resetPwd()
}
const submitPwd = () => {
  api.adminSetPwd
    .do(pwdFormState, loading)
    .then(() => {
      message.success('重置成功')
      closePwd()
    })
    .catch(api.errorMsg)
}

const addVisible = ref(false)
const addFormRef = ref<FormInstance>()
const addFormState = reactive<AdminCreateArgs>({ username: '', password: '', role_id: 0 })
const resetAdd = () => {
  addFormRef.value?.resetFields()
}
const closeAdd = () => {
  addVisible.value = false
  resetAdd()
}
const submitAdd = () => {
  api.adminCreate
    .do(addFormState, loading)
    .then(() => {
      message.success('创建成功')
      searchFormRef.value?.resetFields()
      submitSearch()
      closeAdd()
    })
    .catch(api.errorMsg)
}

{
  api.roleOption
    .do({})
    .then((res) => {
      roleList.value = res.list
      roleOpt.value = buildTable(res.list)
      queryData()
    })
    .catch(api.errorPage)
}
</script>

<template>
  <a-spin :spinning="loading">
    <a-form ref="searchFormRef" :model="searchFormState" @finish="submitSearch" layout="inline">
      <a-form-item label="用户名" name="username">
        <a-input
          v-model:value="searchFormState.username"
          :maxlength="32"
          placeholder="可根据前缀模糊查询"
        />
      </a-form-item>
      <a-form-item label="角色" name="role_id">
        <a-select
          v-model:value="searchFormState.role_id"
          show-search
          option-filter-prop="label"
          style="width: 214px"
        >
          <a-select-option label="全部" :value="0">全部</a-select-option>
          <a-select-option
            v-for="item in roleList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
            {{ item.name }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="状态" name="status">
        <a-select v-model:value="searchFormState.status" style="width: 80px">
          <a-select-option :value="0">全部</a-select-option>
          <a-select-option
            v-for="item in $table.instance.status.options()"
            :key="item.value"
            :value="item.value"
          >
            {{ item.text }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit">查询</a-button>
        <a-button @click="searchFormRef?.resetFields()">清空</a-button>
      </a-form-item>
    </a-form>

    <a-table :data-source="tableData" row-key="id" :pagination="false" size="small" bordered>
      <a-table-column key="id" title="ID" data-index="id" :width="80" />
      <a-table-column key="username" title="用户名" data-index="username" />
      <a-table-column key="role_id" title="角色">
        <template #default="{ record }">
          {{ record.is_super ? '超级管理员' : roleOpt?.render(record.role_id) }}
        </template>
      </a-table-column>
      <a-table-column key="status" title="状态" :width="80">
        <template #default="{ record }">
          <a-tag :color="$table.map.status[record.status]">
            {{ $table.instance.status.render(record.status) }}
          </a-tag>
        </template>
      </a-table-column>
      <a-table-column key="action" :width="242">
        <template #title>
          <a-space class="justify">
            <span>操作</span>
            <a-button
              v-if="api.roleCreate.permit()"
              type="link"
              size="small"
              @click="addVisible = true"
            >
              + 新增
            </a-button>
          </a-space>
        </template>
        <template #default="{ record, index }">
          <span v-if="!record.is_super">
            <template v-for="item in $table.instance.status.options()" :key="item.value">
              <a-popconfirm
                v-if="record.status !== item.value && api.adminSetStatus.permit()"
                :title="`确定要${$table.instance.status.render(item.value)}账号『${
                  record.username
                }』吗？`"
                @confirm="setStatus(record.id, item.value, index)"
              >
                <a-button type="primary" size="small" danger>
                  {{ $table.instance.status.render(item.value) }}
                </a-button>
              </a-popconfirm>
            </template>
            <a-button
              v-if="api.adminSetRole.permit()"
              type="primary"
              size="small"
              @click="openRole(record, index)"
            >
              变更角色
            </a-button>
            <a-button v-if="api.adminSetPwd.permit()" size="small" @click="openPwd(record)">
              重置密码
            </a-button>
          </span>
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

  <a-drawer v-model:open="roleVisible" @close="resetRole" title="变更角色">
    <a-form ref="roleFormRef" :model="roleFormState" @finish="submitRole" :label-col="{ span: 5 }">
      <a-spin :spinning="loading">
        <a-form-item label="用户名">
          <span> {{ user }}</span>
        </a-form-item>
        <a-form-item
          label="角色"
          name="role_id"
          :rules="[{ required: true, type: 'number', min: 1, message: '请选择角色!' }]"
        >
          <a-select v-model:value="roleFormState.role_id" show-search option-filter-prop="label">
            <a-select-option :value="0" disabled>请选择</a-select-option>
            <a-select-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
              {{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :wrapper-col="{ offset: 5 }">
          <a-button type="primary" html-type="submit">确定</a-button>
          <a-button @click="closeRole">取消</a-button>
        </a-form-item>
      </a-spin>
    </a-form>
  </a-drawer>

  <a-drawer v-model:open="pwdVisible" @close="resetPwd" title="重置密码">
    <a-form ref="pwdFormRef" :model="pwdFormState" @finish="submitPwd" :label-col="{ span: 5 }">
      <a-spin :spinning="loading">
        <a-form-item label="用户名">
          <span> {{ user }}</span>
        </a-form-item>
        <a-form-item
          label="新密码"
          name="password"
          :rules="[{ required: true, min: 6, message: '请输入至少6字符的新密码!' }]"
        >
          <a-input-group compact>
            <a-input v-model:value="pwdFormState.password" :maxlength="32" style="width: 75%" />
            <a-button @click="pwdFormState.password = rand.strings()" style="width: 25%">
              生成
            </a-button>
          </a-input-group>
        </a-form-item>
        <a-form-item :wrapper-col="{ offset: 5 }">
          <a-button type="primary" html-type="submit">确定</a-button>
          <a-button @click="closePwd">取消</a-button>
        </a-form-item>
      </a-spin>
    </a-form>
  </a-drawer>

  <a-drawer v-model:open="addVisible" @close="resetAdd" title="新增用户" :width="450">
    <a-form ref="addFormRef" :model="addFormState" @finish="submitAdd" :label-col="{ span: 5 }">
      <a-spin :spinning="loading">
        <a-form-item
          label="用户名"
          name="username"
          :rules="[{ required: true, min: 6, message: '请输入至少6字符的用户名!' }]"
        >
          <a-input v-model:value="addFormState.username" :maxlength="32" />
        </a-form-item>
        <a-form-item
          label="初始密码"
          name="password"
          :rules="[{ required: true, min: 6, message: '请输入至少6字符的密码!' }]"
        >
          <a-input-group compact>
            <a-input v-model:value="addFormState.password" :maxlength="32" style="width: 80%" />
            <a-button @click="addFormState.password = rand.strings()" style="width: 20%">
              生成
            </a-button>
          </a-input-group>
        </a-form-item>
        <a-form-item
          label="角色"
          name="role_id"
          :rules="[{ required: true, type: 'number', min: 1, message: '请选择角色!' }]"
        >
          <a-select v-model:value="addFormState.role_id" show-search option-filter-prop="label">
            <a-select-option :value="0" disabled>请选择</a-select-option>
            <a-select-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
              {{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :wrapper-col="{ offset: 5 }">
          <a-button type="primary" html-type="submit">确定</a-button>
          <a-button @click="closeAdd">取消</a-button>
        </a-form-item>
      </a-spin>
    </a-form>
  </a-drawer>
</template>
