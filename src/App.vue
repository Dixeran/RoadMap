<template>
  <div id="app">
    <Initmodel @init="init = true" @error="HandleError"/>
    <Navbar/>
    <transition name="slide">
      <Errorhandler @click.native="errorConfirmed" v-if="error != ''" :errorData="error"/>
    </transition>
    <keep-alive include="Roadpage" @error="HandleError" v-if="init">
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
import Navbar from "./components/NavBar";
import Errorhandler from "./components/ErrorHandler";
import Initmodel from "./components/InitModel";
export default {
  name: "App",
  components: {
    Navbar,
    Errorhandler,
    Initmodel
  },
  methods: {
    errorConfirmed: function(e) {
      this.error = "";
    },
    HandleError: function(error) {
      this.$notify.error({
          title: '错误',
          message: error
        });
    }
  },
  data() {
    return {
      error: "",
      init:false
    };
  }
};
</script>

<style>
@import url("//at.alicdn.com/t/font_603677_y7a78e3f6iggb9.css");
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
