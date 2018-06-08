<template>
  <div id="Mapcontainer">
    <div id="map"></div>
    <Searchbar @searchChecked="createInfoWindow" v-if="!isMobile"/>
  </div>
</template>

<script>
import Searchbar from "./SearchBar.vue";
import index from "../../../node_modules/_vue@2.5.16@vue";
export default {
  name: "Mapcontainer",
  components: {
    Searchbar
  },
  data() {
    return {
      count: 0,
      /*地图对象*/
      map: {}
    };
  },
  created: function() {
    let that = this;
    /**
     * @description 更新指定节点的出行方案类型
     * @param {number} itemIndex 指定节点的索引
     * @param {string} type 出行类型
     * */
    this.$parent.$on("updateTransferPlan", function(itemIndex, type) {
      let m_From =
        that.$store.state.POIs[that.$store.state.nowDay][itemIndex - 1].detail
          .location;
      let m_To =
        that.$store.state.POIs[that.$store.state.nowDay][itemIndex].detail
          .location;
      that.createTransferObj(m_From, m_To, type).then(newTransfer => {
        that.$store.commit({
          type: "updateTransferPlan",
          newTransfer: newTransfer,
          index: itemIndex
        });
      });
    });

    /*修改出行计划索引*/
    this.$parent.$on("updateTransferIndex", function(itemIndex, transferIndex) {
      that.updateTransferIndex(itemIndex, transferIndex);
    });

    /*移动地图到指定点*/
    this.$parent.$on("setCenter", function(index) {
      let position = that.$store.state.POIs[that.$store.state.nowDay][
        index
      ].marker.getPosition();
      that.map.panTo(position);
    });

    /*移动地图到指定天*/
    this.$parent.$on("moveTo", function(index, day) {
      let cache = that.$store.state.POIs[that.$store.state.nowDay][index];
      cache.marker.hide();
      for (let i = 0; cache.transfer && i < cache.transfer.routes.length; i++) {
        cache.transfer.routes[i].hide();
      }
      that.$store.commit("wipe", index); //wipe from nowDay
      if (day === null) {
        //delete
        cache = null;
        let locFrom =
          that.$store.state.POIs[that.$store.state.nowDay][index - 1] || null;
        let locTo =
          that.$store.state.POIs[that.$store.state.nowDay][index] || null;
        if (locFrom && locTo) {
          //有前驱和后继
          that
            .createTransferObj(
              locFrom.detail.location,
              locTo.detail.location,
              locTo.transfer.type
            )
            .then(result => {
              that.$store.commit({
                type: "updateTransferPlan",
                newTransfer: result,
                index: index
              });
            });
        } else if (locTo) {
          //只有后继
          that.$store.commit({
            type: "updateTransferPlan",
            newTransfer: null,
            index: index
          });
        }
      } else {
        //move to
        let locFrom =
          that.$store.state.POIs[that.$store.state.nowDay][index - 1] || null;
        let locTo =
          that.$store.state.POIs[that.$store.state.nowDay][index] || null;
        if (locFrom && locTo) {
          //有前驱和后继
          that
            .createTransferObj(
              locFrom.detail.location,
              locTo.detail.location,
              locTo.transfer.type
            )
            .then(result => {
              that.$store.commit({
                type: "updateTransferPlan",
                newTransfer: result,
                index: index
              });
            });
        } else if (locTo) {
          //只有后继
          that.$store.commit({
            type: "updateTransferPlan",
            newTransfer: null,
            index: index
          });
        }
        let newDay = that.$store.state.POIs[day]; //切换到的那一天
        if (newDay.length != 0) {
          //有前驱
          let locFrom = newDay[newDay.length - 1].detail.location; //last
          let locTo = cache.detail.location;
          that.createTransferObj(locFrom, locTo, "driving").then(result => {
            cache.transfer = result;
            for (let i = 0; i < result.routes.length; i++)
              result.routes[i].hide(); //切换后消除路线
            that.$store.dispatch({
              type: "addPOIFromMap",
              data: cache,
              dayTo: day
            });
          });
        } else {
          //没前驱
          cache.transfer = null;
          that.$store.dispatch({
            type: "addPOIFromMap",
            data: cache,
            dayTo: day
          });
        }
      }
    });

    /*POI当日更改顺序*/
    this.$parent.$on("sort", function(itemOldIndex, itemNewIndex) {
      //oldIndex是带移动节点当前的位置
      let cache =
        that.$store.state.POIs[that.$store.state.nowDay][itemOldIndex]; //待移动节点
      /*该节点 移动前 后方节点更新 */
      let oldBefore =
        that.$store.state.POIs[that.$store.state.nowDay][itemOldIndex - 1] ||
        null;
      let oldAfter =
        that.$store.state.POIs[that.$store.state.nowDay][itemOldIndex + 1] ||
        null;
      if (oldBefore && oldAfter) {
        //后继节点有新前驱
        let locFrom = oldBefore.detail.location;
        let locTo = oldAfter.detail.location;
        that.createTransferObj(locFrom, locTo, "driving").then(result => {
          that.$store.commit("updateTransferPlan", {
            newTransfer: result,
            index: itemOldIndex + 1
          });
        });
      } else if (oldAfter) {
        that.$store.commit("updateTransferPlan", {
          newTransfer: null,
          index: itemOldIndex + 1
        });
      }
      /*移动元素到newIndex */
      that.$store.commit("sortItem", {
        oldIndex: itemOldIndex,
        newIndex: itemNewIndex
      });
      /*该节点本身更新 */
      let newBefore =
        that.$store.state.POIs[that.$store.state.nowDay][itemNewIndex - 1] ||
        null; //待移动节点 移动后 新前驱
      if (newBefore) {
        let locFrom = newBefore.detail.location;
        let locTo = cache.detail.location;
        that.createTransferObj(locFrom, locTo, "driving").then(result => {
          that.$store.commit("updateTransferPlan", {
            newTransfer: result,
            index: itemNewIndex
          });
        });
      } else {
        //移动后没有前驱
        that.$store.commit("updateTransferPlan", {
          newTransfer: null,
          index: itemNewIndex
        });
      }
      /*该节点 移动后 后方节点更新 */
      let newAfter =
        that.$store.state.POIs[that.$store.state.nowDay][itemNewIndex + 1] ||
        null;
      if (newAfter) {
        let locFrom = cache.detail.location;
        let locTo = newAfter.detail.location;
        that.createTransferObj(locFrom, locTo, "driving").then(result => {
          that.$store.commit("updateTransferPlan", {
            newTransfer: result,
            index: itemNewIndex + 1
          });
        });
      }
    });
  },
  mounted: function() {
    /*Create Map*/
    let map = new AMap.Map("map", {
      resizeEnable: true,
      zoom: 11,
      center: [116.397428, 39.90923],
      animateEnable: true,
      mapStyle: "amap://styles/fe7d1f157e05c97d6930995928e4f39d"
    });
    map.setCity(this.$store.state.city);
    this.map = map; //全局保存map

    /*初始化地点搜索插件*/
    let searchConfig = this.$store.state.AMap_PlaceSearch.config;
    let search = new AMap.PlaceSearch(searchConfig);
    this.$store.commit("setPlaceSearch", {
      config: searchConfig,
      search: search
    });

    /*绑定热点单击事件*/
    let that = this;
    let hpclick = map.on("hotspotclick", function(event) {
      that.createInfoWindow(event);
    });

    /* 从本地导入 */
    if (this.$store.state.storge.localData) {
      this.$emit("setLoading", true);
      let src = this.$store.state.storge.localData;
      let searchTool = new AMap.PlaceSearch({
        city: src.city,
        extensions: 'all'
      });
      function importNode(local_node, pre_node, search_tool) {
        return new Promise((resolve, reject) => {
          let node = {};
          node.id = local_node.id;
          search_tool.getDetails(local_node.id, function(status, result) {
            node.detail = result.poiList.pois[0];
            /*create Marker */
            let marker = new AMap.Marker({
              map: that.map,
              position: node.detail.location,
              animation: "AMAP_ANIMATION_DROP",
              title: node.detail.name
            });
            marker.show();
            node.marker = marker;
            /*create transfer */
            if (local_node.transfer && pre_node) {
              let poiFrom = pre_node.detail.location;
              that
                .createTransferObj(
                  poiFrom,
                  node.detail.location,
                  local_node.transfer.type
                )
                .then(result => {
                  node.transfer = result;
                  resolve(node);
                });
            } else {
              node.transfer = null;
              resolve(node);
            }
          });
        });
      }

      (async function() {
        for (let i = 0; i < src.POIs.length; i++) {
          if (i != src.POIs.length - 1) that.$store.commit("addNewDay");
          for (let j = 0; j < src.POIs[i].length; j++) {
            let poi_node = await importNode(
              src.POIs[i][j],
              j == 0 ? null : that.$store.state.POIs[i][j - 1],
              searchTool
            );
            console.log(poi_node);
            await that.$store.dispatch({
              type: "addPOIFromMap",
              data: poi_node,
              dayTo: i
            });
            if (src.POIs[i][j].transfer && src.POIs[i][j].transfer.index != 0) {
              let idx = src.POIs[i][j].transfer.index;
              that.updateTransferIndex(j, idx);
            }
          }
          if (i != src.POIs.length - 1) that.$store.commit("switchDay", i + 1);
        }
        that.$store.commit("switchDay", 0);
        that.$emit("setLoading", false);
      })();
    }
    /*end 导入 */
  },
  methods: {
    /**
     * @description 创建点击热点信息窗体
     * @param {AMP click event} event 点击地图触发的事件对象
     */
    createInfoWindow: function(event) {
      let infoDiv = document.createElement("div");
      let InfoWindowDemo =
        '<div id="infoWindow">\
        <span class="infoName">' +
        event.name +
        '</span>\
        <span id="infoAction">\
          <i class="iconfont icon-plus"></i>\
        </span>\
      </div>\
      <div id="infoWindowArrow">\
        <div></div>\
      </div>';
      infoDiv.innerHTML += InfoWindowDemo;
      //绑定点击加号的事件
      let that = this;
      infoDiv.querySelector("#infoAction").onclick = function(e) {
        that.addPOIToData(event);
      };

      let infoWindow = new AMap.InfoWindow({
        isCustom: true, //使用自定义窗体
        content: infoDiv,
        offset: new AMap.Pixel(0, -10),
        closeWhenClickMap: true,
        autoMove: true
      });
      infoWindow.open(this.map, event.lnglat);
    },
    /**
     * @description 根据type将result的路径画出
     * @param {object} result 搜索结果
     * @param {string} type 搜索类型
     * @param {number} index 方案索引
     * @return {array} routes 绘制了路线的数组
     */
    drawResultOnMap(result, index, type) {
      let that = this;
      let routes = [];
      if (type === "driving") {
        //driving plan
        let routesPoints = [];
        for (let t = 0; t < result.routes[index].steps.length; t++) {
          //遍历子路段
          for (let i = 0; i < result.routes[index].steps[t].path.length; i++) {
            //遍历路段坐标
            routesPoints.push(result.routes[index].steps[t].path[i]);
          }
        }
        let _route = new AMap.Polyline({
          map: that.map,
          isOutline: true,
          outlineColor: "#FFFFFF",
          strokeWeight: 5,
          strokeColor: "#13afc8",
          showDir: true,
          lineJoin: "round",
          path: routesPoints
        });
        routes.push(_route);
        return routes;
      } else if (type === "bus") {
        //bus plan
        let plan = result.plans[index];
        for (let i = 0; i < plan.segments.length; i++) {
          let seg_type = plan.segments[i].transit_mode;
          let _route = new AMap.Polyline({
            map: that.map,
            isOutline: true,
            outlineColor: "#FFFFFF",
            strokeWeight: 5,
            strokeColor:
              seg_type == "BUS"
                ? "#2775b6"
                : seg_type == "SUBWAY" ? "#51c4d3" : "#fed71a",
            showDir: true,
            lineJoin: "round",
            path: plan.segments[i].transit.path
          });
          routes.push(_route);
        }
        return routes;
      } else if (type === "ride") {
        let plan = result.routes[index];
        let routesPoints = [];
        for (let i = 0; i < plan.rides.length; i++) {
          for (let j = 0; j < plan.rides[i].path.length; j++) {
            routesPoints.push(plan.rides[i].path[j]);
          }
        }
        let _route = new AMap.Polyline({
          map: that.map,
          isOutline: true,
          outlineColor: "#FFFFFF",
          strokeWeight: 5,
          strokeColor: "#21a265",
          showDir: true,
          lineJoin: "round",
          path: routesPoints
        });
        routes.push(_route);
        return routes;
      } else if (type === "walk") {
        let plan = result.routes[index];
        let routesPoints = [];
        for (let i = 0; i < plan.steps.length; i++) {
          for (let j = 0; j < plan.steps[i].path.length; j++) {
            routesPoints.push(plan.steps[i].path[j]);
          }
        }
        let _route = new AMap.Polyline({
          map: that.map,
          isOutline: true,
          outlineColor: "#FFFFFF",
          strokeWeight: 5,
          strokeColor: "#fed71a",
          showDir: true,
          lineJoin: "round",
          path: routesPoints
        });
        routes.push(_route);
        return routes;
      }
    },
    /**
     * @description 生成路径规划结果
     * @param {object} poiFrom 高德lnglat对象
     * @param {object} poiTo 高德lnglat对象
     * @param {string} type 路径规划类别
     * @return {object} transfer对象
     */
    createTransferObj: function(poiFrom, poiTo, type) {
      let that = this;
      return new Promise(function(resolve, reject) {
        let transfer = {
          type: "",
          index: 0,
          kit: {},
          plan: {},
          routes: {}
        };
        if (type === "driving") {
          //Driving plan
          transfer.type = "driving";
          let kit = new AMap.Driving(that.$store.state.AMap_Driving);
          transfer.kit = kit;
          kit.search(poiFrom, poiTo, function(statue, result) {
            if (statue == "complete") {
              transfer.plan = result;
              transfer.routes = that.drawResultOnMap(result, 0, "driving"); //draw result
              resolve(transfer); //resolve result
            } else {
              console.log(result);
              reject();
            }
          });
        } else if (type === "bus") {
          //bus plan
          transfer.type = "bus";
          let kit = new AMap.Transfer(that.$store.state.AMap_Bus);
          transfer.kit = kit;
          console.log('set');
          kit.search(poiFrom, poiTo, function(statue, result) {
            console.log('reso');
            if (statue == "complete") {
              transfer.plan = result;
              transfer.routes = that.drawResultOnMap(result, 0, "bus");
              resolve(transfer);
            } else {
              reject(result);
            }
          });
        } else if (type === "ride") {
          transfer.type = "ride";
          let kit = new AMap.Riding(that.$store.state.AMap_Ride);
          transfer.kit = kit;
          kit.search(poiFrom, poiTo, function(statue, result) {
            if (statue == "complete") {
              transfer.plan = result;
              transfer.routes = that.drawResultOnMap(result, 0, "ride");
              resolve(transfer);
            } else {
              reject(result);
            }
          });
        } else if (type === "walk") {
          transfer.type = "walk";
          let kit = new AMap.Walking(that.$store.state.AMap_Walk);
          transfer.kit = kit;
          kit.search(poiFrom, poiTo, function(statue, result) {
            if (statue == "complete") {
              transfer.plan = result;
              transfer.routes = that.drawResultOnMap(result, 0, "walk");
              resolve(transfer);
            } else reject(result);
          });
        } else {
        }
      });
    },
    /**
     * @description 增加POI到总列表
     * @param {object} event 事件obj
     */
    addPOIToData: function(event) {
      /*校验是否已存在id*/
      let pois = this.$store.state.POIs;
      for (let i = 0; i < pois.length; i++) {
        for (let j = 0; j < pois[i].length; j++) {
          if (pois[i][j].id == event.id) return; //existed
        }
      }

      let that = this;
      /*生成marker*/
      let marker = new AMap.Marker({
        map: that.map,
        position: event.lnglat,
        animation: "AMAP_ANIMATION_DROP",
        title: event.name
      });
      marker.show();

      /*生成换乘*/
      //_pois:当前日子的poi列表
      let _pois = this.$store.state.POIs[this.$store.state.nowDay];
      let payload = {
        id: event.id,
        marker: marker,
        transfer: null
      };
      if (_pois.length > 0) {
        //若存在之前节点，计算路径
        //trsts:前一节点到当前节点的规划对象
        this.createTransferObj(
          _pois[_pois.length - 1].detail.location,
          event.lnglat,
          "driving"
        )
          .then(result => {
            console.log(result);
            payload.transfer = result;
            that.$store.dispatch({
              type: "addPOIFromMap",
              data: payload
            });
            that.$emit("setLoading", false); //set loading
          })
          .catch(error => {
            console.log(error);
          });
      } else {
        //提交至vuex
        that.$store.dispatch({
          type: "addPOIFromMap",
          data: payload
        });
      }
    },
    updateTransferIndex:function(itemIndex, transferIndex){
      let that = this;
      let result =
        that.$store.state.POIs[that.$store.state.nowDay][itemIndex].transfer;
      let newRoutes = that.drawResultOnMap(
        result.plan,
        transferIndex,
        result.type
      );
      that.$store.commit({
        type: "updateTransferIndex",
        newRoutes: newRoutes,
        index: itemIndex,
        transferIndex: transferIndex
      });
    }
  }
};
</script>

<style>
#Mapcontainer {
  position: relative;
}
#map {
  height: 100%;
  width: 100%;
}

#infoWindow {
  height: 2rem;
  padding: 0.5rem;
  padding-right: 0;
  border-radius: 5px;
  border: #2384b8 1px solid;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.25);
  background-color: white;
  display: flex;
  align-items: center;
}
.infoName {
  padding: 0 1rem;
  text-align: center;
}
#infoAction {
  height: 2rem;
  width: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #2384b8;
  transition: all 0.2s ease;
}
#infoAction:hover {
  background-color: #4d8eb1;
}
#infoAction > i {
  color: white;
}
#infoWindowArrow > div {
  width: 0;
  height: 0;
  margin: 0 auto;
  border-top: 10px solid #4d8eb1;
  border-right: 40px solid transparent;
  border-left: 40px solid transparent;
}

#Searchbar {
  position: absolute;
  left: 20px;
  top: 20px;
  z-index: 1000;
}
</style>
