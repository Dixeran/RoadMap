<template>
  <div id="Roadpage">
    <Mapcontainer @setLoading="setLoading"
                  v-loading.fullscreen.lock="loading"/>
    <Daytransmit v-if="onDrag" @moveTo="moveTo"/>
    <Detailpath @updateTransferPlan="updateTransferPlan"
                @updateTransferIndex="updateTransferIndex"
                @setCenter="setCenter"
                @moveTo="moveTo"
                @drag="onDrag = !onDrag"
                @sort="sort"/>
  </div>
</template>

<script>
import Detailpath from "./RoadPage/DetailPath";
import Mapcontainer from "./RoadPage/MapContainer";
import Daytransmit from "./RoadPage/DayTransmit";
export default {
  name: "Roadpage",
  components: {
    Detailpath,
    Mapcontainer,
    Daytransmit
  },
  data() {
    return {
      onDrag: false,
      loading: false
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
</style>
