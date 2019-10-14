import request from '@/router/axios'

export function queryLogPage(query) {
  return request({
    url: '/task/execution-log/page',
    method: 'get',
    params: query
  })
}

export function delLog(id) {
  return request({
    url: '/task/execution-log/' + id,
    method: 'delete'
  })
}

export function getLogById(id) {
  return request({
    url: '/task/execution-log/' + id,
    method: 'get'
  })
}



export function queryTracePage(query) {
  return request({
    url: '/task/status-trace-log/page',
    method: 'get',
    params: query
  })
}

export function delTrace(id) {
  return request({
    url: '/task/status-trace-log/' + id,
    method: 'delete'
  })
}