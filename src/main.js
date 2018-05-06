// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import Vuex from "vuex";
import App from "./App";
import router from "./router";

Vue.use(Vuex);
Vue.config.productionTip = false;
/*{
  id: '',//唯一ID
  detail: {},//PlaceSearch对象
  marker: '',//点标记对象
  transfer: {
    type: '',//换乘类型
    index: number, //换乘方案索引
    plan: {},//换乘方案
    routes:[{}],//换乘绘制路线
    kit:{}//换乘AMap对象
  }
}*/
const store = new Vuex.Store({
  state: {
    city: "",
    totalDays: 1,
    nowDay: 0,
    POIs: [[]],
    /*地点搜索*/
    AMap_PlaceSearch: {
      config: {
        city: "全国"
      },
      search: {}
    },
    /*驾车规划*/
    AMap_Driving: {
      policy: AMap.DrivingPolicy.LEAST_TIME,
      hideMarkers: true,
      autoFitView: false,
      showTraffic: false
    },
    /*公交规划*/
    AMap_Bus: {
      city: this.city,
      hideMarkers: true,
      autoFitView: false
    },
    AMap_Ride: {
      hideMarkers: true,
      autoFitView: false
    },
    AMap_Walk: {
      hideMarkers: true,
      autoFitView: false
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
      if (d < state.totalDays && d >= 0) {
        let nowP = state.POIs[state.nowDay];
        for (var i = 0; i < nowP.length; i++) {
          nowP[i].marker.hide(); //hide marker
          if (nowP[i].transfer) {
            for (let z = 0; z < nowP[i].transfer.routes.length; z++) {
              nowP[i].transfer.routes[z].hide(); //hide path
            }
          }
        }
        let newP = state.POIs[d];
        for (var j = 0; j < newP.length; j++) {
          newP[j].marker.show(); //show marker
          if (newP[j].transfer) {
            for (let z = 0; z < newP[j].transfer.routes.length; z++) {
              newP[j].transfer.routes[z].show(); //hide path
            }
          }
        }
        state.nowDay = d;
      }
    },
    /**
     * @description 删除特定的天数
     * @param {number} d 删除第d天（数组编号）
     */
    deleteDay(state, d) {
      if (d < state.totalDays && d >= 0) {
        for (let t = 0; t < state.POIs[d].length; t++) {
          state.POIs[d][t].marker.hide(); //hide markers
          if (state.POIs[d][t].transfer)
            state.POIs[d][t].transfer.routes.hide(); //hide path
        }
        state.POIs.splice(d, 1);
        state.totalDays--;
        if (state.nowDay == d && state.nowDay > 0) {
          state.nowDay--;
          for (let i = 0; i < state.POIs[state.nowDay].length; i++) {
            state.POIs[state.nowDay][i].marker.show();
            if (state.POIs[state.nowDay][i].transfer) {
              state.POIs[state.nowDay][i].transfer.routes.show();
            }
          }
        }
      }
    },
    /**
     * @description 添加POI到数据集
     * @param {object} payload
     * @param {object} payload.data 数据
     * @param {number} payload.dayTo 可选，添加到的天
     */
    addPOIFromMap(state, payload) {
      if (!payload.dayTo) {
        state.POIs[state.nowDay].push(payload.data);
      }
      else state.POIs[payload.dayTo].push(payload.data);//move to
    },
    /**
     * @description 更新POI出行方案，替换整个transfer对象
     * @param {object} payload
     * @param {number} payload.index POI当日索引
     * @param {object} payload.newTransfer POI新transfer
     */
    updateTransferPlan: function (state, payload) {
      if (state.POIs[state.nowDay][payload.index].transfer) {
        console.log("clear old path");
        let route = state.POIs[state.nowDay][payload.index].transfer.routes;
        for (let i = 0; i < route.length; i++) {
          route[i].hide();
        }
      }
      state.POIs[state.nowDay][payload.index].transfer = payload.newTransfer;
    },
    /**
     * @description 更新POI出行方案索引
     * @param {object} payload
     * @param {number} payload.index POI当日索引
     * @param {object} payload.newRoutes POI新transfer.routes
     * @param {number} payload.transferIndex POI出行方案索引
     */
    updateTransferIndex: function (state, payload) {
      let item = state.POIs[state.nowDay][payload.index];
      item.transfer.routes = payload.newRoutes;
      item.transfer.index = payload.transferIndex;
    },
    /**
     * @description 从nowday删除index
     * @param {number} index 待删除POI索引
     */
    wipe: function (state, index) {
      state.POIs[state.nowDay].splice(index, 1);
    },
    /**
     * @description 当天内移动节点顺序
     * @param {object} payload
     * @param {number} payload.oldIndex 节点旧索引
     * @param {number} payload.newIndex 节点新索引
     */
    sortItem: function (state, payload) {
      let nowDay = state.POIs[state.nowDay];
      nowDay.splice(payload.newIndex, 0, nowDay.splice(payload.oldIndex, 1)[0]);
    }
  },
  actions: {
    addPOIFromMap(context, payload) {
      console.log(payload);
      if (!payload.data.detail) {//no detail
        context.state.AMap_PlaceSearch.search.getDetails(payload.data.id, function (
          status,
          result
        ) {
          if (status == "complete") {
            payload.data.detail = result.poiList.pois[0];
            context.commit("addPOIFromMap", payload);
          } else {
            console.log(result);
            context.commit("addPOIFromMap", payload);
          }
        });
      }
      else {//already exist data
        console.log("moveIN");
        console.log(payload.dayTo);
        context.commit("addPOIFromMap", payload);
      }
    }
  }
});

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  store,
  components: { App },
  template: "<App/>"
});
