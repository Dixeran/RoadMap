<template>
  <div id="Roadpage">
    <Mapcontainer @setLoading="setLoading"
                  v-loading.fullscreen.lock="loading"/>
    <Daytransmit v-if="onDrag" @moveTo="moveTo"/>
    <Detailpath v-if="!isMobile"
                @updateTransferPlan="updateTransferPlan"
                @updateTransferIndex="updateTransferIndex"
                @setCenter="setCenter"
                @moveTo="moveTo"
                @drag="onDrag = !onDrag"
                @sort="sort"/>
    <Drawer :width="300" :enable="drawerOpen" v-if="isMobile" @close="drawerOpen = false">
      <Detailpath
        @updateTransferPlan="updateTransferPlan"
        @updateTransferIndex="updateTransferIndex"
        @setCenter="setCenter"
        @moveTo="moveTo"
        @drag="onDrag = !onDrag"
        @sort="sort"/>
    </Drawer>
    <div id="footer" v-if="isMobile" @click="drawerOpen = true">
      <i class="iconfont icon-menu"></i>
    </div>
  </div>
</template>

<script>
import Detailpath from "./RoadPage/DetailPath";
import Mapcontainer from "./RoadPage/MapContainer";
import Daytransmit from "./RoadPage/DayTransmit";
import Drawer from "./RoadPage/Drawer";
export default {
  name: "Roadpage",
  components: {
    Detailpath,
    Mapcontainer,
    Daytransmit,
    Drawer
  },
  data() {
    return {
      onDrag: false,
      loading: false,
      drawerOpen: false
    };
  },
  methods: {
    /**
     * @description 更新路段规划的类型
     * @param {item} itemIndex 节点索引
     * @param {string} type 出行方案类型
     */
    updateTransferPlan: function(itemIndex, type) {
      this.$emit("updateTransferPlan", itemIndex, type);
      //因为item在vuex里面，直接传item好像不太方便修改vuex对象？暂时先传index
      //要通过commit来修改的话，传一个vuex里面的对象的引用似乎没啥大用
    },
    /**
     * @description 更新路段规划的方案索引
     * @param {item} itemIndex 节点索引
     * @param {number} transferIndex 出行方案索引
     */
    updateTransferIndex: function(itemIndex, transferIndex) {
      this.$emit("updateTransferIndex", itemIndex, transferIndex);
    },
    /**
     * @description 设置地图中心
     * @param {number} index 设为中心的节点
     */
    setCenter: function(index) {
      this.$emit("setCenter", index);
    },
    /**
     * @description 移动节点到指定日期
     * @param {number} index 移动的节点
     * @param {number} day 移动到的日期
     */
    moveTo: function(index, day) {
      this.$emit("moveTo", index, day);
    },
    /**
     * @description 节点单日内排序
     * @param {number} itemOldIndex 节点旧索引
     * @param {number} itemNewIndex 节点新索引
     */
    sort: function(itemOldIndex, itemNewIndex) {
      this.$emit("sort", itemOldIndex, itemNewIndex);
    },
    /**
     * @description 设置读取状态
     * @param {bool} state loading状态
     */
    setLoading: function(state) {
      this.loading = state;
    }
  }
};
</script>

<style scoped>
#Roadpage {
  width: 100%;
  height: calc(100% - 60px);
  display: flex;
}

#Mapcontainer {
  width: calc(100% - 400px);
  height: 100%;
  display: inline-block;
}

#Daytransmit {
  width: 7rem;
  position: fixed;
  top: 60px;
  right: 400px;
}

#Detailpath {
  width: 400px;
  display: inline-block;
}

@media screen and (max-width: 600px) {
  #Roadpage {
    width: 100%;
    height: calc(100% - 40px);
    display: flex;
  }
  #Mapcontainer {
    width: 100vw;
    height: 100%;
  }
  #Detailpath {
    width: 100%;
    height: 100%;
  }
  #footer{
    position: fixed;
    right: 10px;bottom: 10px;
    height: 40px;
    width: 40px;
    border-radius: 100%;
    background-color: white;
    box-shadow: 0 0 2px rgba(0, 0, 0, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
