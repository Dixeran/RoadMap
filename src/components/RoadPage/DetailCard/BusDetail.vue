<template>
  <div id="Busdetail">
    <p class="nums">路程花费：<code>{{Rtem.cost}}</code> 元</p>
    <p class="nums">预期时间：<code>{{Math.floor(Rtem.time / 60)}}</code> 分钟</p>
    <p class="nums">全程距离：<code>{{Rtem.distance}}</code> 米</p>
    <p class="nums">步行距离：<code>{{Rtem.walking_distance}}</code> 米</p>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "Busdetail",
  props: ["item"],
  computed: {
    Rtem: function() {
      return this.item.plan.plans ? this.item.plan.plans[0] : this.item.plan.routes[0];
    }
  }
};
</script>

<style scoped>
#Busdetail {
  color: #333;
  padding: 10px;
}

.nums {
  color: #333;
  margin: 2px 0;
  font-size: 12px;
}
</style>
