<template>
  <div id="Mapcontainer">
    <div id="map"></div>
    <Searchbar @searchChecked="createInfoWindow"/>
  </div>
</template>

<script>
import Searchbar from "./SearchBar.vue";
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
     * @description 更新指定节点的出行方案
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

    this.$parent.$on('updateTransferIndex', function (itemIndex, transferIndex) {
      let result = that.$store.state.POIs[that.$store.state.nowDay][itemIndex].transfer;
      let newRoutes = that.drawResultOnMap(result.plan, transferIndex, result.type);
      that.$store.commit({
        type:'updateTransferIndex',
        newRoutes:newRoutes,
        index:itemIndex,
        transferIndex:transferIndex
      })
    });
  },
  mounted: function() {
    /*Create Map*/
    let map = new AMap.Map("map", {
      resizeEnable: true,
      zoom: 11,
      center: [116.397428, 39.90923],
      mapStyle: "amap://styles/fe7d1f157e05c97d6930995928e4f39d"
    });
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
          let _route = new AMap.Polyline({
            map: that.map,
            isOutline: true,
            outlineColor: "#FFFFFF",
            strokeWeight: 5,
            strokeColor:
              plan.segments[i].transit_mode == "BUS" ? "#2775b6" : "#fed71a",
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
          kit.search(poiFrom, poiTo, function(statue, result) {
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
            that.$store.dispatch("addPOIFromMap", payload);
          })
          .catch(error => {
            console.log(error);
          });
      } else {
        //提交至vuex
        that.$store.dispatch("addPOIFromMap", payload);
      }
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
  z-index: 10000;
}
</style>
