import request from '@/router/axios'

export function queryPage (query) {
  return request({
    url: '/cms/sysuser/page',
    method: 'get',
    params: query
  })
}

export function addObj (obj) {
  return request({
    url: '/cms/sysuser/add',
    method: 'post',
    data: obj
  })
}

export function getObj (id) {
  return request({
    url: '/cms/sysuser/' + id,
    method: 'get'
  })
}

export function lockOrUnlock (id) {
  return request({
    url: '/cms/sysuser/lockOrUnlock/' + id,
    method: 'post'
  })
}

export function updateObj (obj) {
  return request({
    url: '/cms/sysuser/update',
    method: 'post',
    data: obj
  })
}

export function delObj (id) {
  return request({
    url: '/cms/sysuser/lockOrUnlock/' + id,
    method: 'delete'
  })
}


