import { ResultProps } from 'ant-design-vue'

export type ErrorCode = '0' | '403' | '404' | '500' | 'error'

export type ErrorResult = {
  code: string
  status: ResultProps['status']
  title: ResultProps['title']
  subTitle: ResultProps['subTitle']
}

export const errorMap: { [key in ErrorCode]: ErrorResult } = {
  '0': {
    code: '',
    status: 'info',
    title: '',
    subTitle: ''
  },
  '403': {
    code: '403',
    status: '403',
    title: 'Forbidden',
    subTitle: 'Sorry, you are not authorized to access this page.'
  },
  '404': {
    code: '404',
    status: '404',
    title: 'Not Found',
    subTitle: 'Sorry, the page you visited does not exist.'
  },
  '500': {
    code: '500',
    status: '500',
    title: 'Internal Server Error',
    subTitle: 'Sorry, something went wrong.'
  },
  error: {
    code: 'error',
    status: 'error',
    title: 'Netwrok Error',
    subTitle: 'Sorry, something went wrong.'
  }
}
