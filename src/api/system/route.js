import request from '@/router/axios'

export function queryList (query) {
    return request({
      url: '/cms/dept/page',
      method: 'get',
      params: query
    })
  }

