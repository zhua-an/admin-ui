import request from '@/router/axios'

export function queryPage (query) {
  return request({
    url: '/admin/sysuser/page',
    method: 'get',
    params: query
  })
}

export function addObj (obj) {
  return request({
    url: '/admin/sysuser/add',
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

export function lockOrUnlock (id) {
  return request({
    url: '/admin/sysuser/lockOrUnlock/' + id,
    method: 'post'
  })
}

export function updateObj (obj) {
  return request({
    url: '/admin/sysuser/update',
    method: 'post',
    data: obj
  })
}

export function delObj (id) {
  return request({
    url: '/admin/sysuser/lockOrUnlock/' + id,
    method: 'delete'
  })
}


