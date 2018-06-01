<template>
  <div id="Walkdetail">
    <p class="nums">步行距离：<code>{{Rtem.distance}}</code> 米</p>
    <p class="nums">预计耗时：<code>{{Math.floor(Rtem.time / 60)}}</code> 分钟</p>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name:'Walkdetail',
  props: ["item"],
  computed:{
    Rtem:function(){
      return this.item.plan.routes[0];
    }
  }
}
</script>

<style scoped>
#Walkdetail{
  color: #333;
  padding: 10px;
}

.nums {
  color: #333;
  margin: 2px 0;
  font-size: 12px;
}
</style>

