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
      map: {},
      /*驾车规划*/
      AMap_Driving: {
        /*驾车规划配置*/
        config: {
          policy: AMap.DrivingPolicy.LEAST_TIME,
          hideMarkers: true,
          autoFitView: false,
          showTraffic: false
        }
      }
    };
  },
  mounted: function() {
    /*Create Map*/
    let map = new AMap.Map("map", {
      resizeEnable: true,
      zoom: 11,
      center: [116.397428, 39.90923],
      mapStyle: "amap://styles/fe7d1f157e05c97d6930995928e4f39d"
    });
    //this.AMap_Driving.config.map = map;//每个规划需要新的换乘对象，不能统一创建
    this.map = map; //全局保存map实例 //let driving = new AMap.Driving(this.AMap_Driving.config);

    /*驾车换乘对象*/ //this.AMap_Driving.maker = driving;

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
     * @description 增加POI到总列表
     * @param {POI event} event 事件obj
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
      let transfer = {
        type: "driving",
        index: 0,
        kit: {},
        plan: {},
        routes: {}
      };
      let payload = {
        id: event.id,
        marker: marker,
        transfer: transfer
      };
      if (_pois.length > 0) {
        //若存在之前节点，计算路径
        //trsts:前一节点到当前节点的规划对象
        let trsts = new AMap.Driving(this.AMap_Driving.config);
        transfer.kit = trsts;
        trsts.search(
          _pois[_pois.length - 1].detail.location,
          event.lnglat,
          function(status, result) {
            if (status != "complete") {
              this.$emit(
                "error",
                "查询从" +
                  _pois[pois.length - 1].name +
                  "到" +
                  event.name +
                  "的路线出现错误"
              );
            } else {
              transfer.plan = result;

              //获取路径坐标自绘
              let routesPoints = [];
              for (let t = 0; t < result.routes[0].steps.length; t++) {
                //遍历子路段
                for (
                  let i = 0;
                  i < result.routes[0].steps[t].path.length;
                  i++
                ) {
                  //遍历路段坐标
                  routesPoints.push(result.routes[0].steps[t].path[i]);
                }
              }
              let routes = new AMap.Polyline({
                map: that.map,
                isOutline: true,
                outlineColor: "#FFFFFF",
                strokeWeight: 5,
                strokeColor: "#13afc8",
                showDir: true,
                lineJoin: "round",
                path: routesPoints
              });
              transfer.routes = routes;
            }
            payload.transfer = transfer;
            //提交至vuex
            that.$store.dispatch("addPOIFromMap", payload);
          }
        );
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
