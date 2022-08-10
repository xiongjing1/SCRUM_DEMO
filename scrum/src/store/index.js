import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    selectedItem:[]
  },
  getters: {
  },
  mutations: {
    clear(state){
      state.selectedItem = []
    },
    set(state , n){
      state.selectedItem = []
      state.selectedItem.push(n)
    }
  },
  actions: {
  },
  modules: {
  }
})
