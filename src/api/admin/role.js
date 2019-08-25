import request from '@/router/axios'

export function roleList () {
  return request({
    url: '/admin/role/roleList',
    method: 'get'
  })
}

export function queryPage (query) {
  return request({
    url: '/admin/role/page',
    method: 'get',
    params: query
  })
}

export function deptRoleList () {
  return request({
    url: '/admin/role/list',
    method: 'get'
  })
}

export function getObj (id) {
  return request({
    url: '/admin/role/' + id,
    method: 'get'
  })
}

export function addObj (obj) {
  return request({
    url: '/admin/role/add',
    method: 'post',
    data: obj
  })
}

export function updateObj (obj) {
  return request({
    url: '/admin/role/update',
    method: 'post',
    data: obj
  })
}

export function delObj (id) {
  return request({
    url: '/admin/role/delete/' + id,
    method: 'delete'
  })
}

export function updateRolePermit (roleId, permissionIds) {
  return request({
    url: '/admin/role/updateRolePermit',
    method: 'post',
    params: {
      roleId: roleId,
      permissionIds: permissionIds
    }
  })
}

export function fetchRoleTree (roleId) {
  return request({
    url: '/admin/permission/fetchRoleTree/' + roleId,
    method: 'get'
  })
}
