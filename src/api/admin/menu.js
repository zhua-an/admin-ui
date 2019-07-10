import request from '@/router/axios'

export function GetMenu () {
  return request({
    url: '/admin/sysPermission',
    method: 'get'
  })
}

export function fetchMenuTree (query) {
  return request({
    url: '/admin/sysPermission/tree',
    method: 'get',
    params: query
  })
}

export function addObj (obj) {
  return request({
    url: '/admin/sysPermission',
    method: 'post',
    data: obj
  })
}

export function getObj (id) {
  return request({
    url: '/admin/sysPermission/' + id,
    method: 'get'
  })
}

export function delObj (id) {
  return request({
    url: '/admin/sysPermission/' + id,
    method: 'delete'
  })
}

export function putObj (obj) {
  return request({
    url: '/admin/sysPermission',
    method: 'put',
    data: obj
  })
}
