<template>
  <div id="Cardcollapse">
    <div id="trigger" @click="transActive">
      <slot name="header"></slot>
    </div>
    <div id="content">
      <h1>{{detail.type}}</h1>
      <!-- 餐饮信息 -->
      <div class="dts" v-if="detail.deep_type == 'DINING'">
        <p>开业时间：<code>{{detail.dining.opentime}}</code></p>
        <p>打分：<code>{{detail.dining.cp_rating}}</code></p>
        <p>人均花费：<code>{{detail.dining.cost}}</code> 元</p>
      </div>
      <!-- 景点信息 -->
      <div class="dts" v-if="detail.deep_type == 'SCENIC'">
        <p>开放时间：<code>{{detail.scenic.opentime}}</code></p>
        <p v-if="detail.scenic.rating">评分：<code>{{detail.scenic.rating}}</code></p>
        <p v-if="detail.scenic.price != 0">门票价格：<code>{{detail.scenic.price}}</code> 元</p>
      </div>
      <!-- 酒店信息 -->
      <div class="dts" v-if="detail.deep_type == 'HOTEL'">
        <p>评分：<code>{{detail.hotel.rating}}</code></p>
        <p>星级：<code>{{detail.hotel.star}}</code></p>
        <p>最低价格：<code>{{detail.hotel.lowest_price}}</code> 元</p>
      </div>
    </div>
  </div>
</template>

<script>
import TWEEN from "@tweenjs/tween.js";
export default {
  name: "Cardcollapse",
  props: ["detail"],
  data(){
    return{
      isActive:false,
      contentHeight:0
    }
  },
  methods: {
    transActive: function() {
      let tc = this.$el.querySelector('#content');//content
      let th = 0;
      if (this.isActive) {
        th = this.$el.clientHeight - tc.clientHeight;
      } else {
        th = this.$el.clientHeight + tc.clientHeight;
      }
      let tween = new TWEEN.Tween(this).to({ contentHeight: th }, 200);
      tween.easing(TWEEN.Easing.Cubic.InOut);
      tween.start();

      animate();
      function animate() {
        requestAnimationFrame(animate);
        TWEEN.update();
      }
      this.isActive = !this.isActive;
    }
  },
  mounted:function(){
    this.contentHeight = this.$el.clientHeight - this.$el.querySelector('#content').clientHeight;
  },
  computed: {
    transferComp: function() {
      // if(this._mounted && this.isActive) this.transActive();//中途变更类型时，先收起
      // this._mounted = true;
      if (this.transferItem.type === "driving") return Drivedetail;
      else if (this.transferItem.type === "walk") return Walkdetail;
      else if (this.transferItem.type === "bus") return Busdetail;
      return Ridedetail;
    }
  },
  watch: {
    contentHeight: function() {
      this.$el.style.height = this.contentHeight + "px";
    }
  }
};
</script>

<style scoped>
#Cardcollapse {
  box-sizing: content-box !important;
  /*padding-bottom: 10px; /*for content margin botton*/
  overflow: hidden;
}
#content {
  box-sizing: border-box;
  margin: 0 10px;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
  border-radius: 3px;
  background-color: /*#fffef9*/white;
  color: #333;
  overflow: hidden;
}

h1{
  font-size: 1rem;
  font-weight: 300;
  text-align: center;
  background-color: whitesmoke;
  border-bottom: 1px solid rgba(0, 0, 0, 0.25);
  margin: 0;
}

.dts p{
  margin: 0;
  font-size: 0.85rem;
  padding: 2px 10px;
}
</style>
