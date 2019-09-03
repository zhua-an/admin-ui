import request from '@/router/axios'

export function GetMenu () {
  return request({
    url: '/admin/permission',
    method: 'get'
  })
}

export function fetchMenuTree (query) {
  return request({
    url: '/admin/permission/getTree',
    method: 'get',
    params: query
  })
}

export function addObj (obj) {
  return request({
    url: '/admin/permission',
    method: 'post',
    data: obj
  })
}

export function delObj (id) {
  return request({
    url: '/admin/permission/' + id,
    method: 'delete'
  })
}

export function putObj (obj) {
  return request({
    url: '/admin/permission',
    method: 'put',
    data: obj
  })
}
