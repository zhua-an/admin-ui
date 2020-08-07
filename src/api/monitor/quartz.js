import request from '@/router/axios'

export function queryLogPage(query) {
    return request({
        url: '/quartz/execution-log/page',
        method: 'get',
        params: query
    })
}

export function getJobPage(query) {
    return request({
        url: '/quartz/job/getJobPage',
        method: 'get',
        params: query
    })
}

export function addJob(data) {
    return request({
        url: '/quartz/job/addJob',
        method: 'put',
        data: data
    })
}

export function modifyJobTime(data) {
    return request({
        url: '/quartz/job/modifyJobTime',
        method: 'post',
        data: data
    })
}

export function getJobState(jobName, jobGroup) {
    return request({
        url: '/quartz/job/getJobState?jobName='+jobName+'&jobGroup='+jobGroup,
        method: 'get'
    })
}

export function removeJob(jobName, jobGroup) {
    return request({
        url: '/quartz/job/removeJob?jobName='+jobName+'&jobGroup='+jobGroup,
        method: 'delete'
    })
}

export function pauseAllJob() {
    return request({
        url: '/quartz/job/pauseAllJob',
        method: 'post'
    })
}

export function resumeAllJob() {
    return request({
        url: '/quartz/job/resumeAllJob',
        method: 'post'
    })
}

export function pauseJob(data) {
    return request({
        url: '/quartz/job/pauseJob',
        method: 'post',
        params: data
    })
}

export function resumeJob(data) {
    return request({
        url: '/quartz/job/resumeJob',
        method: 'post',
        params: data
    })
}

export function runAJobNow(data) {
    return request({
        url: '/quartz/job/runAJobNow',
        method: 'post',
        params: data
    })
}

export function startJobs() {
    return request({
        url: '/quartz/job/startJobs',
        method: 'post'
    })
}

export function shutdownJobs() {
    return request({
        url: '/quartz/job/shutdownJobs',
        method: 'post'
    })
}