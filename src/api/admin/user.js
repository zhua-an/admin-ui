import request from '@/router/axios'

export function queryList (query) {
  return request({
    url: '/admin/sysuser/page',
    method: 'get',
    params: query
  })
}

export function addObj (obj) {
  return request({
    url: '/admin/sysuser',
    method: 'post',
    data: obj
  })
}

export function getObj (id) {
  return request({
    url: '/admin/sysuser/' + id,
    method: 'get'
  })
}

export function delObj (id) {
  return request({
    url: '/admin/sysuser/' + id,
    method: 'delete'
  })
}

export function putObj (obj) {
  return request({
    url: '/admin/sysuser',
    method: 'put',
    data: obj
  })
}

export function getDetails (obj) {
  return request({
    url: '/admin/sysuser/details/' + obj,
    method: 'get'
  })
}
