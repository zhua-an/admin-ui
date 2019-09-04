import request from '@/router/axios'

export function fetchList (query) {
  return request({
    url: '/cms/dict/page',
    method: 'get',
    params: query
  })
}

export function addObj (obj) {
  return request({
    url: '/cms/dict/',
    method: 'post',
    data: obj
  })
}

export function getObj (id) {
  return request({
    url: '/cms/dict/' + id,
    method: 'get'
  })
}

export function delObj (row) {
  return request({
    url: '/cms/dict/' + row.id + '/' + row.type,
    method: 'delete'
  })
}

export function putObj (obj) {
  return request({
    url: '/cms/dict/',
    method: 'put',
    data: obj
  })
}

export function remote (type) {
  return request({
    url: '/cms/dict/type/' + type,
    method: 'get'
  })
}
