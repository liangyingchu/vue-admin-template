import request from '@/utils/request'

export function fetchAdminList(params) {
    return request({
        url: '/auth/admin/list',
        method: 'get',
        params
    })
}

export function saveAdmin(payload) {
    return request({
        url: '/auth/admin/save',
        method: 'post',
        data: payload
    })
}

export function updateAdmin(payload) {
    return request({
        url: '/auth/admin/update',
        method: 'post',
        data: payload
    })
}



export function fetchRoleList(params) {
    return request({
        url: '/auth/role/list',
        method: 'get',
        params
    })
}

export function fetchRoleOptions() {
    return request({
        url: '/auth/role/options',
        method: 'get'
    })
}

export function fetchRegionList() {
    return request({
        url: '/auth/role/regions',
        method: 'get'
    })
}

export function saveRole(payload) {
    return request({
        url: '/auth/role/save',
        method: 'post',
        data: payload
    })
}

export function updateRole(payload) {
    return request({
        url: '/auth/role/update',
        method: 'post',
        data: payload
    })
}


export function fetchNodeList() {
    return request({
        url: '/auth/node/list',
        method: 'get'
    })
}

export function saveNode(payload) {
    return request({
        url: '/auth/node/save',
        method: 'post',
        data: payload
    })
}

export function updateNode(payload) {
    return request({
        url: '/auth/node/update',
        method: 'post',
        data: payload
    })
}