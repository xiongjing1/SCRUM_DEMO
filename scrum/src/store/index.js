import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    selectedItem:[],
    pages:[],
    selectedPrototype:null,
    indexSelected:-1,
    idSelected:null,
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
    },
    add(state,n){
      state.pages.push(n)
    },

  }
  ,
  actions: {
  },
  modules: {
  }
})
