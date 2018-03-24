// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import router from './router'

Vue.use(Vuex)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})

const store = new Vuex.Store({
  state: {
    totalDays: 1,
    nowDay: 1,
    POIs:[]
  },
  mutations: {
    /**
     * @description 使天数+1
    */
    addNewDay() {
      state.totalDays++;
      state.POIs.push([]);
    },
    /**
     * @description 切换当前天数
     * @param {number} d 切换到d天
    */
    switchDay(d) {
      if (d <= state.totalDays) {
        state.nowDay = d;
      }
    }
  }
})
