import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/* Router Modules */
import exampleRouter from './modules/example'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in subMenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if false, the item will hidden in breadcrumb(default is true)
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'Dashboard',
    hidden: true,
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index')
    }]
  },

  ...exampleRouter,

  // {
  //   path: 'external-link',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
  //       meta: { title: 'External Link', icon: 'link' }
  //     }
  //   ]
  // },


]

export const asyncRouterMap = [
    // 权限管理
    {
        path: '/authority',
        component: Layout,
        redirect: '/authority/admin',
        name: 'Authority',
        meta: { title: '权限管理', icon: 'example', authURL: '/authority' },
        children: [
            {
                path: 'role',
                name: 'Role',
                component: () => import('@/views/authority/role/index'),
                meta: { title: '角色管理', icon: 'role', authURL: '/authority/role' }
            },
            {
                path: 'node',
                name: 'Node',
                component: () => import('@/views/authority/node/index'),
                meta: { title: '节点管理', icon: 'node', authURL: '/authority/node' }
            },
            {
                path: 'admin',
                name: 'Admin',
                component: () => import('@/views/authority/admin/index'),
                meta: { title: '用户管理', icon: 'admin', authURL: '/authority/admin' }
            }
        ]
    },

    { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
