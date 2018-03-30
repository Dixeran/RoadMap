<template>
  <div id="app">
    <Navbar/>
    <transition name="slide">
      <Errorhandler @click.native="errorConfirmed" v-if="error != ''" :errorData="error"/>
    </transition>
    <keep-alive include="Roadpage" @error="HandleError">
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
import Navbar from "@/components/NavBar";
import Errorhandler from "@/components/ErrorHandler";
export default {
  name: "App",
  components: {
    Navbar,
    Errorhandler
  },
  methods: {
    errorConfirmed: function(e) {
      this.error = "";
    },
    HandleError: function(error) {
      this.error = error;
    }
  },
  data() {
    return {
      error: ""
    };
  }
};
</script>

<style>
@import url('//at.alicdn.com/t/font_603677_csdmkp41jv5nrk9.css');
* {
  box-sizing: border-box;
}
html,
body,
#app {
  height: 100%;
}
body {
  margin: 0;
}
#Errorhandler {
  position: fixed;
  right: 4rem;
  top: 4rem;
}

.slide-enter,
.slide-leave-to {
  opacity: 0;
  transform: rotateX(90deg);
  -webkit-transform: rotateX(90deg);
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.2s ease;
}
</style>
