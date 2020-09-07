import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import common from './common'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    info: {}
  },
  modules: {
    common
  },
  getters
})
