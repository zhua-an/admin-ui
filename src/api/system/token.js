import request from '@/router/axios'

export function fetchList (query) {
  return request({
    url: '/cms/token/page',
    method: 'get',
    params: query
  })
}

export function delObj (token) {
  return request({
    url: '/cms/token/' + token,
    method: 'delete'
  })
}
