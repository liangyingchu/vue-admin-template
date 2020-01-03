import { param2Obj } from './utils'

const tokens = {
  admin: {
    token: 'admin-token'
  },
  editor: {
    token: 'editor-token'
  }
}

const users = {
    'admin-token': {
        menuList: ['/authority', '/authority/role', '/authority/node', '/authority/admin'],
        name: 'Super Admin',
        avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif'
    },
    'editor-token': {
        menuList: ['/authority', '/authority/role', '/authority/node', '/authority/admin'],
        avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
        name: 'Normal Editor'
    }
}

export default {

    login: res => {
        const { username } = JSON.parse(res.body)
        const token = tokens[username]

        if (token) {
            return {
                code: 200,
                body: { token },
                message: 'success'
            }
        }
        return {
            code: 60204,
            message: 'Account and password are incorrect.'
        }
    },

    getInfo: res => {
        const { token } = param2Obj(res.url)
        const info = users[JSON.parse(token).token]

        if (info) {
            return {
                code: 200,
                body: info,
                message: 'success'
            }
        }
        return {
            code: 50008,
            message: 'Login failed, unable to get user details.'
        }
    },

    logout: () => {
        return {
            code: 200,
            body: 'success'
        }
    }
}
