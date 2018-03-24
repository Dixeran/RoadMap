<template>
  <div id="Mapcontainer">
    <div id="map"></div>
  </div>
</template>

<script>
export default {
  name: "Mapcontainer",
  data() {
    return {
      count: 0
    };
  },
  mounted: function() {
    /*Create Map*/
    let map = new AMap.Map("map", {
      resizeEnable: true,
      zoom: 11,
      center: [116.397428, 39.90923],
      mapStyle:'amap://styles/fe7d1f157e05c97d6930995928e4f39d'
    });

    /*绑定热点单击事件*/
    let that = this;
    let hpclick = map.on("hotspotclick", function(event) {
      console.log(event);
      let infoWindow = new AMap.InfoWindow({
        isCustom: true, //使用自定义窗体
        content: that.createInfoWindow(event),
        offset: new AMap.Pixel(0, -10),
        closeWhenClickMap: true
      });
      infoWindow.open(map, event.lnglat);
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
        that.addPOIFromMap(event.id);
      };
      return infoDiv;
    },
    /**
     * @description 增加POI到总列表
     * @param {POI id} id 高德地图POI.id
    */
    addPOIFromMap:function(id){

    }
  }
};
</script>

<style>
@import url("//at.alicdn.com/t/font_603677_nal037ttt5m9ggb9.css");
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
</style>
