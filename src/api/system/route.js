import request from '@/router/axios'

export function queryList () {
    return request({
      url: '/cms/route/queryList',
      method: 'get'
    })
  }

  export function updateObj (obj) {
    return request({
      url: '/cms/route/update',
      method: 'post',
      data: obj
    })
  }