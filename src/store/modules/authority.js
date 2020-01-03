import { constantRouterMap, asyncRouterMap } from '@/router'

/**
 * 通过 meta.authURL 判断是否与当前用户路由权限匹配
 * @param authUrls - 当前用户路由权限组
 * @param route - 单一路由
 * */
function hasPermission(authUrls, route) {
    if(route.meta && route.meta.authURL) {
        return authUrls.some(url => route.meta.authURL === url)
    } else {
        return true
    }
}


/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param routes 异步路由表
 * @param authUrls 用户持有权限路由
 * */
function filterAsyncRouter(routes, authUrls) {
    const res = []
    routes.forEach(route => {
        const tmp = { ...route }
        if(hasPermission(authUrls, tmp)) {
            if(tmp.children) {
                tmp.children = filterAsyncRouter(tmp.children, authUrls)
            }
            res.push(tmp)
        }
    })
    return res
}


const authority = {
    state: {
        routers: constantRouterMap,
        addRouters: []
    },
    mutations: {
        SET_ROUTERS: (state, routers) => {
            state.addRouters = routers
            state.routers = constantRouterMap.concat(routers)
        }
    },
    actions: {
        GenerateRoutes({ commit }, data) {
            return new Promise(resolve => {
                const { authUrls } = data
                const accessedRouters = filterAsyncRouter(asyncRouterMap, authUrls)
                commit('SET_ROUTERS', accessedRouters)
                resolve()
            })
        }
    }
}

export default authority
