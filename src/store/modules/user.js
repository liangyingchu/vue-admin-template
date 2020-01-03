import { login, logout, getInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    menuList: []
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
      SET_MENULIST: (state, menuList) => {
          state.menuList = menuList
      }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        login(username, userInfo.password).then(data => {
          setToken(data.token)
          commit('SET_TOKEN', data.token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },


    // 获取用户信息
    GetInfo({ commit, state }) {
        return new Promise((resolve, reject) => {
            getInfo(state.token).then(data => {
                const { menuList, name, avatar } = data
                if(menuList.length === 0) {
                    reject('该用户没有任何权限')
                } else {
                    commit('SET_MENULIST', menuList)
                    commit('SET_NAME', name)
                    commit('SET_AVATAR', avatar || 'https://wpimg.wallstcn.com/577965b9-bb9e-4e02-9f0c-095b41417191')
                    resolve(data)
                }
            }).catch(error => {
                reject(error)
            })
        })
    },

    // 登出
    LogOut({ commit, state }) {
        return new Promise((resolve, reject) => {
            logout(state.token).then(() => {
                commit('SET_TOKEN', '')
                commit('SET_NAME', '')
                commit('SET_MENULIST', [])
                removeToken()
                resolve()
            }).catch(error => {
                reject(error)
            })
        })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }

  }
}

export default user
