import Mock from 'mockjs'
import userAPI from './user'
import tableAPI from './table'
import authAPI from './authority'

// Fix an issue with setting withCredentials = true, cross-domain request lost cookies
// https://github.com/nuysoft/Mock/issues/300
Mock.XHR.prototype.proxy_send = Mock.XHR.prototype.send
Mock.XHR.prototype.send = function() {
  if (this.custom.xhr) {
    this.custom.xhr.withCredentials = this.withCredentials || false
  }
  this.proxy_send(...arguments)
}
// Mock.setup({
//   timeout: '350-600'
// })

// User
Mock.mock(/\/user\/login/, 'post', userAPI.login)
Mock.mock(/\/user\/info/, 'get', userAPI.getInfo)
Mock.mock(/\/user\/logout/, 'post', userAPI.logout)

// Table
Mock.mock(/\/table\/list/, 'get', tableAPI.list)

// Authority
Mock.mock(/\/auth\/admin\/list/, 'get', authAPI.adminList)
Mock.mock(/\/auth\/admin\/save/, 'post', authAPI.saveAdmin)
Mock.mock(/\/auth\/admin\/update/, 'post', authAPI.updateAdmin)

Mock.mock(/\/auth\/role\/list/, 'get', authAPI.roleList)
Mock.mock(/\/auth\/role\/save/, 'post', authAPI.saveRole)
Mock.mock(/\/auth\/role\/update/, 'post', authAPI.updateRole)
Mock.mock(/\/auth\/role\/options/, 'get', authAPI.roleOptions)
Mock.mock(/\/auth\/role\/regions/, 'get', authAPI.roleRegions)

Mock.mock(/\/auth\/node\/list/, 'get', authAPI.nodeList)
Mock.mock(/\/auth\/node\/save/, 'post', authAPI.saveNode)
Mock.mock(/\/auth\/node\/update/, 'post', authAPI.updateNode)

export default Mock
