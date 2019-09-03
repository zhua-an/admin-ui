import request from '@/router/axios'

export function queryPage (query) {
  return request({
    url: '/admin/dept/page',
    method: 'get',
    params: query
  })
}

export function getTree (query) {
  return request({
    url: '/admin/dept/getTree',
    method: 'get',
    params: query
  })
}

export function addObj (obj) {
  return request({
    url: '/admin/dept/add',
    method: 'post',
    data: obj
  })
}

export function delObj (id) {
  return request({
    url: '/admin/dept/delete/' + id,
    method: 'delete'
  })
}

export function updateObj (obj) {
  return request({
    url: '/admin/dept/update',
    method: 'post',
    data: obj
  })
}
