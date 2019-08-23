import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const store = new Vuex.Store({
  state: {
    token: localStorage.getItem('token') || '',
    person: JSON.parse(localStorage.getItem('myInfo')) || {},
    announceNum: localStorage.getItem("announceNum"),
    companyLogo:""
  },
  mutations: {
    set_token(state, token) {
      state.token = token
      localStorage.getItem("token", token)
    },
    del_token(state) {
      state.token = ''
      localStorage.removeItem('token')
      localStorage.removeItem("myInfo")
      localStorage.removeItem("announceNum")
    },
    set_info(state, person) {
      state.person = person
    },
    change_annNum(state, announceNum) {
      state.announceNum--
    },
    set_annNum(state, announceNum) {
      state.announceNum = announceNum
    },
    companyLogo(state, v) {
      state.person.companyLogo = v;
    }
  }
})
export default store
