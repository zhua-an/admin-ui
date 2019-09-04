import request from '@/router/axios'

export function getRoleList () {
  return request({
    url: '/cms/role/getRoleList',
    method: 'get'
  })
}

export function queryPage (query) {
  return request({
    url: '/cms/role/page',
    method: 'get',
    params: query
  })
}

export function getObj (id) {
  return request({
    url: '/cms/role/' + id,
    method: 'get'
  })
}

export function addObj (obj) {
  return request({
    url: '/cms/role/add',
    method: 'post',
    data: obj
  })
}

export function updateObj (obj) {
  return request({
    url: '/cms/role/update',
    method: 'post',
    data: obj
  })
}

export function delObj (id) {
  return request({
    url: '/cms/role/delete/' + id,
    method: 'delete'
  })
}

export function updateRolePermit (roleId, permissionIds) {
  return request({
    url: '/cms/role/updateRolePermit',
    method: 'post',
    params: {
      roleId: roleId,
      permissionIds: permissionIds
    }
  })
}

export function fetchRoleTree (roleId) {
  return request({
    url: '/cms/permission/fetchRoleTree/' + roleId,
    method: 'get'
  })
}
