<template>
  <div id="Roadpage">
    <Mapcontainer/>
    <Detailpath/>
  </div>
</template>

<script>
import Detailpath from "./RoadPage/DetailPath";
import Mapcontainer from "./RoadPage/MapContainer";
export default {
  name: "Roadpage",
  components: {
    Detailpath,
    Mapcontainer
  }
};
</script>

<style scoped>
#Roadpage {
  width: 100%;
  height: calc(100% - 60px);
  display: flex;
}

#Mapcontainer {
  width: calc(100% - 400px);
  height: 100%;
  display: inline-block;
}

#Detailpath {
  width: 400px;
  display: inline-block;
}
</style>
