// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import router from './router'

Vue.use(Vuex)
Vue.config.productionTip = false
/*{
  id: '',
  searchResult: '',
  marker: '',
  transfer: {
    type: '',
    plan: {}
  }
}*/
const store = new Vuex.Store({
  state: {
    totalDays: 1,
    nowDay: 0,
    POIs: [[]]
  },
  mutations: {
    /**
     * @description 使天数+1
    */
    addNewDay(state) {
      state.totalDays++;
      state.POIs.push([]);
    },
    /**
     * @description 切换当前天数
     * @param {number} d 切换到d天（数组编号）
    */
    switchDay(state, d) {
      if (d <= state.totalDays) {
        state.nowDay = d;
      }
    },
    /**
     * @description 删除特定的天数
     * @param {number} d 删除第d天（数组编号）
     */
    deleteDay(state, d) {
      if (d <= state.totalDays) {
        state.POIs.splice(d, 1);
      }
    },
    /**
     * @param {obj} payload
     * @param {String} payload.id POI唯一编号
     * @param {pointer} payload.marker 地图上标记物的引用
     * @param {*} payload.transfer 地图上路线规划的引用
     */
    addPOIFromMap(state, payload) {
      console.log(payload);
    }
  }
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
});
