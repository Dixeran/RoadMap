<template>
  <div id="app">
    <Navbar/>
    <keep-alive include="Roadpage">
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
import Navbar from "@/components/NavBar";
export default {
  name: "App",
  components: {
    Navbar
  }
};
</script>

<style>
* {
  box-sizing: border-box;
}
html, body, #app{
  height: 100%;
}
body {
  margin: 0;
}
</style>
