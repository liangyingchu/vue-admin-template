import Mock from 'mockjs'

export default {
    adminList: () => {
        const data = Mock.mock({
            'list|10': [{
                createTime: '@datetime',
                username: 'name',
                email: '123456789@zz.com',
                mobile: '136xxxx8539',
                status: 1
            }],
            total: 10
        })

        return {
            code: 200,
            body: data,
            message: 'success'
        }
    },

    saveAdmin: res => {
        const data = JSON.parse(res.body)

        return {
            code: 200,
            body: data,
            message: 'success'
        }
    },

    updateAdmin: res => {
        const data = JSON.parse(res.body)

        return {
            code: 200,
            body: data,
            message: 'success'
        }
    },

    roleList: () => {
        const data = Mock.mock({
            'list|10': [{
                roleId: '@id',
                createTime: '@datetime',
                roleName: 'name',
                remark: '无',
                regions: [{regionName: '深圳'},{regionName: '云南'}]
            }],
            total: 10
        })

        return {
            code: 200,
            body: data,
            message: 'success'
        }
    },

    roleOptions: () => {
        const data = Mock.mock({
            'list|5': [{
                roleId: '@id',
                'roleName|1': ['管理员', '程序猿', '圣上']
            }]
        })
        return {
            code: 200,
            body: data,
            message: 'success'
        }
    },

    roleRegions: () => {
        const data = Mock.mock({
            'regions|7': [{
                id: '@id',
                'regionName|1': ['深圳', '云南', '大理']
            }]
        })
        return {
            code: 200,
            body: data,
            message: 'success'
        }
    },

    saveRole: res => {
        const data = JSON.parse(res.body)
        return {
            code: 200,
            body: data,
            message: 'success'
        }
    },

    updateRole: res => {
        const data = JSON.parse(res.body)
        return {
            code: 200,
            body: data,
            message: 'success'
        }
    },


    nodeList: () => {
        return {
            code: 200,
            body: {
                menuList: [
                    { menuId: 1, parentId: 0, name: 'Example' },
                    { menuId: 2, parentId: 1, name: 'form' },
                    { menuId: 3, parentId: 1, name: 'table' },
                    { menuId: 4, parentId: 1, name: 'tree' },

                    { menuId: 5, parentId: 0, name: '权限管理' },
                    { menuId: 6, parentId: 5, name: '用户管理' },
                    { menuId: 7, parentId: 5, name: '角色管理' },
                    { menuId: 8, parentId: 5, name: '节点管理' }
                ]
            },
            message: 'success'
        }
    },

    saveNode: res => {
        const data = JSON.parse(res.body)
        return {
            code: 200,
            body: data,
            message: 'success'
        }
    },

    updateNode: res => {
        const data = JSON.parse(res.body)
        return {
            code: 200,
            body: data,
            message: 'success'
        }
    }
}

