// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import router from './router'

Vue.use(Vuex)
Vue.config.productionTip = false
/*{
  id: '',//唯一ID
  detail: {},//PlaceSearch对象
  marker: '',//点标记对象
  transfer: {
    type: '',//换乘类型
    plan: {},//换乘方案
    kit:{}//换乘AMap对象
  }
}*/
const store = new Vuex.Store({
  state: {
    totalDays: 1,
    nowDay: 0,
    POIs: [[]],
    AMap_PlaceSearch: {
      config: {
        city: '全国'
      },
      search: {}
    }
  },
  mutations: {
    /**@description 设置PlaceSearch插件
     * @param {AMap.PlaceSearch} target 插件对象
    */
    setPlaceSearch(state, target) {
      console.log(target);
      state.AMap_PlaceSearch.config = target.config;
      state.AMap_PlaceSearch.search = target.search;
    },
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
      state.AMap_PlaceSearch.search.getDetails(payload.id, function (status, result) {
        if (status == 'complete') {
          payload.detail = result.poiList.pois[0];
        }
        else {
          console.log(result);
        }
      });
      state.POIs[state.nowDay].push(payload);
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
