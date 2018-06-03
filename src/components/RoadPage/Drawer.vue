<template>
  <div id="Drawer" :style="{width: width + 'px', marginLeft: leftMargin + 'px'}">
    <div id="content">
      <slot></slot>
    </div>
    <transition name="fade">
      <div id="mask" v-if="enable" @click="$emit('close')"></div>
    </transition>
  </div>
</template>

<script>
import TWEEN from "@tweenjs/tween.js";
export default {
  name: "Drawer",
  props: ["width", "enable"],
  data() {
    return {
      leftMargin: 0
    };
  },
  watch: {
    enable: function(val) {
      if (val) {
        let tween = new TWEEN.Tween(this).to({ leftMargin: -this.width }, 150);
        tween.start();

        animate();
        function animate() {
          requestAnimationFrame(animate);
          TWEEN.update();
        }
      } else {
        let tween = new TWEEN.Tween(this).to({ leftMargin: 0 }, 150);
        tween.start();

        animate();
        function animate() {
          requestAnimationFrame(animate);
          TWEEN.update();
        }
      }
    }
  }
};
</script>

<style scoped>
#Drawer {
  z-index: 2000;
  position: fixed;
  top: 0;
  left: 100vw;
  height: 100vh;
  border-left: solid 1px rgba(0, 0, 0, 0.25);
  box-shadow: 0 0 1px rgba(0, 0, 0, 0.1);
}
#content{
  z-index: 2001;
  height: 100%;
}
#mask {
  z-index: -1;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.35);
}

.fade-enter-active, .fade-leave-active{
  transition: all 0.1s ease;
}
.fade-enter, .fade-leave-to{
  opacity: 0;
}
</style>
