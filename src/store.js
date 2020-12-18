import Vue from 'vue'
import "babel-polyfill";
import Vuex from 'vuex'
Vue.use(Vuex)

const state = {
    userInfo: {},//用户信息
    baseUrl:"https://qitui.yueyilan.com/api/retirement",
    userType:0,//老人列表-老人消费类型
    userSearch:'',//老人列表-老人搜索关键字
    // http://192.168.5.175:8081
    // http://test.qitui.yueyilan.com/test/api/retirement
    // https://qitui.yueyilan.com/api/retirement
  }

  const getters = {
  }
  
  const mutations = {
    setInfo(state, flag) {
      state.userInfo = flag
    },
    setUserType(state, flag){
      state.userType = flag
    },
    setUserSearch(state, flag){
      state.userSearch = flag
    }
  }
  
  const actions = {
    setInfo({commit}, flag) {
      commit("setInfo", flag)
    },
    setUserType({commit}, flag){
      commit("setUserType", flag)
    },
    setUserSearch({commit}, flag){
      commit("setUserSearch", flag)
    }
  }
  
  export default new Vuex.Store({
    state,
    getters,
    mutations,
    actions
  })

  