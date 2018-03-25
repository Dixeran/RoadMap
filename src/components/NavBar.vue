<template>
  <div id="Navbar">
    <div id="logo">
      <span>RoadMap</span>
    </div>
    <ul id="navlist">
      <router-link to="/" class="active">路径规划</router-link>
      <router-link to="/hello">路径检查</router-link>
    </ul>
  </div>
</template>

<script>
export default {
  name: "Navbar",
  components: {}
};
</script>

<style scoped>
#Navbar {
  width: 100%;
  height: 60px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.25);
  display: flex;
  align-items: center;
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
  margin: 0;
  padding: 0;
  margin: 0 3rem;
  display: inline-block;
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
</style>
