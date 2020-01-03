const getters = {
    sidebar: state => state.app.sidebar,
    device: state => state.app.device,

    routers: state => state.authority.routers,
    addRouters: state => state.authority.addRouters,

    token: state => state.user.token,
    avatar: state => state.user.avatar,
    name: state => state.user.name,
    menuList: state => state.user.menuList
}
export default getters
