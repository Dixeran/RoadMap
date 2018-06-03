<template>
  <div id="Collapse">
    <span class="select">
      <slot name="selector"></slot>
    </span>
    <span class="trigger" @click="transActive"><i class="iconfont icon-more"></i></span>
    <div id="content">
      <component v-if="transferItem" :is="transferComp" :item="transferItem">
        <el-button type="text" size="mini" @click="enterApp">在高德地图打开</el-button>
      </component>
    </div>
  </div>
</template>

<script>
import Drivedetail from "./DriveDetail";
import Walkdetail from "./WalkDetail";
import Busdetail from "./BusDetail";
import Ridedetail from "./RideDetail";
import TWEEN from "@tweenjs/tween.js";
export default {
  name: "Collapse",
  components: {
    Drivedetail,
    Walkdetail,
    Busdetail,
    Ridedetail
  },
  props: ["transferItem"],
  data() {
    return {
      isActive: false,
      contentHeight: 0,
      _mounted:false
    };
  },
  mounted: function() {
    if (this.$children[0]) {
      this.contentHeight =
        this.$el.clientHeight - this.$children[0].$el.clientHeight;
      //console.log(this.$el.style.height);
    }
  },
  methods: {
    transActive: function() {
      let th = 0;
      if (this.isActive) {
        th = this.$el.clientHeight - this.$children[0].$el.clientHeight;
      } else {
        th = this.$el.clientHeight + this.$children[0].$el.clientHeight;
      }
      console.log(this.$el.clientHeight);
      console.log(th);
      let tween = new TWEEN.Tween(this).to({ contentHeight: th }, 200);
      tween.easing(TWEEN.Easing.Cubic.InOut);
      tween.start();

      animate();
      function animate() {
        requestAnimationFrame(animate);
        TWEEN.update();
      }
      this.isActive = !this.isActive;
    },
    enterApp(){
      this.transferItem.kit.searchOnAMAP(
        {
          origin:this.transferItem.plan.origin,
          destination: this.transferItem.plan.destination
        }
      );
    }
  },
  computed: {
    transferComp: function() {
      // if(this._mounted && this.isActive) this.transActive();//中途变更类型时，先收起
      // this._mounted = true;
      let type = this.transferItem.type;
      if (type === "driving") return Drivedetail;
      else if (type === "walk") return Walkdetail;
      else if (type === "bus") return Busdetail;
      else if (type === 'ride') return Ridedetail;
      else{
        console.log('errfuck');
      }
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
#Collapse {
  box-sizing: content-box !important;
  /*在使用clientHeight获取、设置高度的时候，务必注意盒模型*/
  border-bottom: 2px dashed whitesmoke;
  overflow: hidden;
}

.select {
  display: inline-block;
  width: 90%;
}

.trigger {
  display: inline-block;
  width: 5%;
}
</style>
