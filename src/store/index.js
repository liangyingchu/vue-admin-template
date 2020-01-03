import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import authority from './modules/authority'
import user from './modules/user'
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
    modules: {
        app,
        authority,
        user
    },
    getters
})

export default store
