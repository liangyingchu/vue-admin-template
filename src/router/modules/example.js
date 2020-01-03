import Layout from '../../views/layout/Layout'

const exampleRouter = [
    {
        path: '/example',
        component: Layout,
        redirect: '/example/table',
        name: 'Example',
        meta: { title: 'Example', icon: 'example' },
        children: [
            {
                path: 'table',
                name: 'Table',
                component: () => import('@/views/example/table/index'),
                meta: { title: 'Table', icon: 'table' }
            },
            {
                path: 'form',
                name: 'Form',
                component: () => import('@/views/example/form/index'),
                meta: { title: 'Form', icon: 'form' }
            },
            {
                path: 'tree',
                name: 'Tree',
                component: () => import('@/views/example/tree/index'),
                meta: { title: 'Tree', icon: 'tree' }
            }
        ]
    }
]

export default exampleRouter
