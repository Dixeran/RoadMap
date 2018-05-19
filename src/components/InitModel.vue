<template>
  <div id="Initmodel" v-if="!init">
    <div id="container">
      <div id="select">
        <h1>去哪？(･ω´･ )</h1>
        <div id="select-or">
          <el-select v-model="val">
            <el-option
            v-for="item in option"
            :key="item.name"
            :label="item.name"
            :value="item.citycode"></el-option>
          </el-select>
        </div>
      </div>
      <div id="import">
        <h1>导入！</h1>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Initmodel",
  data() {
    return {
      init: false,
      val: "全国",
      option: []
    };
  },
  mounted: function() {
    let that = this;
    AMap.service("AMap.DistrictSearch", function() {
      let districtSearch = new AMap.DistrictSearch({
        level: "country",
        subdistrict: 1
      });
      districtSearch.search("中国", function(status, result) {
        console.log(result);
        that.option = result.districtList[0].districtList;
      });
    });
  },
  watch: {
    val: function() {
      let searchConfig = this.$store.state.AMap_PlaceSearch.config;
      searchConfig.city = this.val;
      let search = new AMap.PlaceSearch(searchConfig);
      this.$store.commit("setPlaceSearch", {
        config: searchConfig,
        search: search
      });
      this.init = true;
      this.$emit('init');
    }
  }
};
</script>

<style scoped>
#Initmodel {
  position: fixed;
  width: 100vw;
  height: 100vh;
  background-color: rgba(255, 255, 255, 0.9);

  display: flex;
  align-items: center;
  justify-content: center;
}
#container {
  display: flex;
  justify-content: center;
  flex-direction: column;
  width: 60vw;
}
#container div {
  width: 100%;
}

#select {
  border-bottom: 2px dashed whitesmoke;
  padding-bottom: 10px;
}
#select > h1 {
  font-size: 3rem;
  color: steelblue;
}

#import > h1 {
  font-size: 3rem;
  color: steelblue;
}
</style>
