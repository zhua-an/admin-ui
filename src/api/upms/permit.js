import request from '@/router/axios'

export function GetMenu () {
  return request({
    url: '/cms/permission',
    method: 'get'
  })
}

export function fetchMenuTree (query) {
  return request({
    url: '/cms/permission/getTree',
    method: 'get',
    params: query
  })
}

export function addObj (obj) {
  return request({
    url: '/cms/permission',
    method: 'post',
    data: obj
  })
}

export function delObj (id) {
  return request({
    url: '/cms/permission/' + id,
    method: 'delete'
  })
}

export function putObj (obj) {
  return request({
    url: '/cms/permission',
    method: 'put',
    data: obj
  })
}
