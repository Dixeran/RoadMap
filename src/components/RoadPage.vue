<template>
  <div id="Roadpage">
    <Mapcontainer/>
    <Detailpath @updateTransferPlan="updateTransferPlan"/>
  </div>
</template>

<script>
import Detailpath from "./RoadPage/DetailPath";
import Mapcontainer from "./RoadPage/MapContainer";
export default {
  name: "Roadpage",
  components: {
    Detailpath,
    Mapcontainer
  },
  methods:{
    /**
     * @description 更新路段规划的类型
     * @param {item} itemIndex 节点索引
     * @param {string} type 出行方案类型
     */
    updateTransferPlan:function (itemIndex, type) {
      this.$emit("updateTransferPlan", itemIndex, type);
      //因为item在vuex里面，直接传item好像不太方便修改vuex对象？暂时先传index
      //要通过commit来修改的话，传一个vuex里面的对象的引用似乎没啥大用
    },
    /**
     * @description 更新路段规划的方案索引
     * @param {item} itemIndex 节点索引
     * @param {number} transferIndex 出行方案索引
     */
    updateTransferIndex:function (itemIndex, transferIndex) {
      this.$emit('updateTransferIndex', itemIndex, transferIndex);
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

#Detailpath {
  width: 400px;
  display: inline-block;
}
</style>
