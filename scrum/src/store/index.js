import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    selectedItem:null
  },
  getters: {
  },
  mutations: {
    clear(state){
      state.selectedItem = null
    },
    set(state , n){
      state.selectedItem = null
      state.selectedItem = n
    }
  },
  actions: {
  },
  modules: {
  }
})
