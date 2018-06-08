<template>
  <div id="Drivedetail">
    <p class="nums">驾驶距离：<code>{{Rtem.distance}}</code> 米</p>
    <p class="nums">预计耗时：<code>{{Math.floor(Rtem.time / 60)}}</code> 分钟</p>
    <p class="nums" v-if="Rtem.tolls !== 0">路费：<code>{{Rtem.tolls}}</code> 元</p>
    <p class="nums" v-if="Rtem.restriction  == 1"><i></i><code>存在限行警告</code></p>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "Drivedetail",
  props: ["item"],
  computed:{
    Rtem:function(){
      return this.item.plan.routes[0];
    }
  }
};
</script>

<style scoped>
#Drivedetail {
  color: #333;
  padding: 10px;
}

.nums {
  color: #333;
  margin: 2px 0;
  font-size: 12px;
}
</style>
