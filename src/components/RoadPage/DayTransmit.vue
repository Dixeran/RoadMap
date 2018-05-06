<template>
  <div id="Daytransmit">
    <div class="header">拖动至此处分发到其他日期</div>
    <ul>
      <div class="item" v-for="n in $store.state.totalDays"
            :key="n"
            v-if="(n-1) != $store.state.nowDay"
            @dragover.prevent
            @drop.prevent="moveTo($event)"
            :dayIndex="n - 1">
        <div class="item-line" v-if="n != 1 && !((n-2) == $store.state.nowDay && (n-1) == 1)"></div>
        <i class="item-icon iconfont icon-right"></i>
        第{{n}}天
      </div>
    </ul>
  </div>
</template>

<script>
export default {
  name: "Daytransmit",
  data() {
    return {};
  },
  methods: {
    moveTo: function(e) {
      let k = e.dataTransfer.getData("ItemIndex");
      this.$emit("moveTo", k, e.target.getAttribute("dayIndex"));
    }
  }
};
</script>

<style scoped>
#Daytransmit {
  background-color: whitesmoke;
  border: 1px dashed rgba(0, 0, 0, 0.25);
  border-right: none;
  border-radius: 0 5px;
}
#Daytransmit > ul {
  display: flex;
  flex-direction: column;
  padding: 0 1rem;
  margin: 0;
}
#Daytransmit > .header {
  text-align: center;
  font-size: 0.8rem;
  background-color: white;
  border-bottom: 1px dashed grey;
}
.item {
  position: relative;
  padding: 5px;
  text-align: center;
  margin: 1rem 0;
}
.item:hover {
  color: red;
}
.item-line {
  height: 1.5rem;
  position: absolute;
  top: -1.75rem;
  left: 1rem;
  border-left: #2384b8 3px solid;
  border-radius: 2px;
}
.item-icon {
  color: #2384b8;
}
</style>
