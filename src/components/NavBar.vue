<template>
  <div id="Navbar">
    <div id="logo">
      <span>RoadMap</span>
    </div>
    <ul id="navlist">
      <router-link to="/">路径规划</router-link>
      <router-link to="/setting">参数设置</router-link>
    </ul>
    <input id="cityName" type="text"
           v-model="$store.state.city"
           v-bind:class="$store.state.city == '' ? 'unName' : ''"
           placeholder="输入城市名">
  </div>
</template>

<script>
export default {
  name: "Navbar",
  components: {},
  data() {
    return {

    };
  },
  methods: {

  }
};
</script>

<style scoped>
#Navbar {
  width: 100%;
  height: 60px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.25);
  display: flex;
  align-items: center;
  z-index: 10000;
}
@media print {
  #Navbar {
    display: none;
  }
}

#logo {
  display: inline-block;
  margin: 0 1rem;
  font-size: 1.5rem;
  font-weight: bold;
  color: #2384b8;
}
#logo > img {
  height: 60px;
}

#navlist {
  padding: 0;
  margin: 0 3rem;
  display: inline-block;
  margin-right: auto;
}
#navlist a {
  list-style: none;
  float: left;
  text-align: center;
  padding: 0.2rem 0.8rem;
  color: #333;
  border-radius: 5px;
  text-decoration: none;
  transition: all 0.2s ease;
}
#navlist a:hover {
  padding: 0.2rem 1.5rem;
}
#navlist .active {
  background-color: #2384b8;
  color: white;
}
#cityName {
  width: 6rem;
  margin-right: 10px;
  padding: 2px;
  border: 1px solid #2384b8;
  border-radius: 3px;
  text-align: center;
  transition: all 0.2s ease;
}
.unName {
  border: 2px solid #f05038 !important;
}
</style>
