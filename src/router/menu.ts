import { errorMap } from '@/types/errors'
import { MenuTree, dfsTree } from '@/types/route'
import {
  DragOutlined,
  FormOutlined,
  SettingOutlined,
  StarOutlined,
  ToolOutlined,
  WarningOutlined
} from '@ant-design/icons-vue'

const menuTree: MenuTree = {
  system: {
    title: '系统设置',
    icon: SettingOutlined,
    sub: {
      menu: {
        title: '接口菜单',
        conponent: () => import('@/views/system/ActionMenu.vue')
      },
      role: {
        title: '角色权限',
        conponent: () => import('@/views/system/AdminRole.vue')
      },
      user: {
        title: '用户列表',
        conponent: () => import('@/views/system/AdminUser.vue')
      }
    }
  },
  demo: {
    title: '示例',
    icon: StarOutlined,
    sub: {
      error: {
        title: '错误页',
        icon: WarningOutlined,
        sub: {
          '403': {
            title: '403',
            conponent: () => import('@/components/ErrorPage.vue'),
            isPub: true,
            props: errorMap[403]
          },
          '404': {
            title: '404',
            conponent: () => import('@/components/ErrorPage.vue'),
            isPub: true,
            props: errorMap[404]
          },
          '500': {
            title: '500',
            conponent: () => import('@/components/ErrorPage.vue'),
            isPub: true,
            props: errorMap[500]
          }
        }
      },
      form: {
        title: '表单组件',
        icon: FormOutlined,
        conponent: () => import('@/views/demo/FormItem.vue'),
        isPub: true
      },
      drag: {
        title: '拖拽表单',
        icon: DragOutlined,
        conponent: () => import('@/views/demo/DragForm.vue'),
        isPub: true
      }
    }
  },
  tool: {
    title: '工具助手',
    icon: ToolOutlined,
    sub: {
      crypto: {
        title: '数据加解密',
        conponent: () => import('@/views/tool/TextCrypto.vue')
      }
    }
  },
  password: {
    title: '修改密码',
    conponent: () => import('@/views/user/ChangePwd.vue'),
    isPub: true,
    hide: true
  }
}

export const { menus, routes, sys } = dfsTree(menuTree)
