<template>
  <div id="Initmodel" v-if="!init">
    <div id="container">
      <div id="select">
        <h1>去哪？(･ω´･ )</h1>
        <div id="select-or">
          <el-cascader
            :options="option"
            size="medium"
            v-model="val">
          </el-cascader>
        </div>
      </div>
      <div id="import">
        <h1>导入！</h1>
        <el-button type="primary" @click="importLocal">本地导入</el-button>
        <el-button plain @click="importUser">云端导入</el-button>
      </div>
    </div>

    <el-dialog
      title="登录/注册"
      :modal="false"
      :visible.sync="dialogVisible">
      <User @login="dialogVisible = false; importUser()"/>
    </el-dialog>
  </div>
</template>

<script>
import User from "./User";
export default {
  name: "Initmodel",
  components:{
    User
  },
  data() {
    return {
      init: false,
      val: [],
      option: [],
      props: {
        label: "name",
        value: "name",
        children: "districtList"
      },
      dialogVisible: false
    };
  },
  created: function() {
    this.lcs.Init();
  },
  mounted: function() {
    let that = this;
    AMap.service("AMap.DistrictSearch", function() {
      let districtSearch = new AMap.DistrictSearch({
        level: "country",
        subdistrict: 2
      });
      districtSearch.search("中国", function(status, result) {
        that.formatArray(result.districtList[0].districtList);
        that.option = result.districtList[0].districtList;
      });
    });
    if (this.isMobile) {
      //this.importLocal();
      this.importCloud(this.email);
    }
  },
  methods: {
    /**
     * @description 格式化高德行政区查询结果
     * @param {array} target 待格式化数组
     */
    formatArray: function(target) {
      let that = this;
      target.forEach(element => {
        if (
          element.districtList &&
          element.districtList.length != 0 &&
          element.districtList[0].level != "district"
        ) {
          that.formatArray(element.districtList);
        } else {
          element.districtList = null;
        }
        element.label = element.value = element.name;
        element.children = element.districtList;
      });
    },
    /**
     * @description 从本地导入数据
     */
    importLocal() {
      let data = JSON.parse(localStorage.getItem("roadmap"));
      if(!data){
        this.$emit('error', '数据不存在');
        return;
      }
      this.$store.state.storge.localData = data;
      this.$store.state.city = data.city;
      this.$store.state.AMap_Bus.city = data.city;
      let searchConfig = this.$store.state.AMap_PlaceSearch.config;
      searchConfig.city = data.city;
      this.init = true;
      this.$emit("init");
    },
    /**
     * @description 从云端导入数据
     * @param {string} email 处理过的邮箱
     */
    importCloud(email) {
      this.lcs.getDataByEmail(email).then(result => {
        let data = JSON.parse(result);
        this.$store.state.storge.localData = data;
        this.$store.state.city = data.city;
        this.$store.state.AMap_Bus.city = data.city;
        this.$store.state.storge.toCloud = true;
        let searchConfig = this.$store.state.AMap_PlaceSearch.config;
        searchConfig.city = data.city;
        this.init = true;
        this.$emit("init");
      }).catch(err=>{
        this.$emit('error', err);
      });
    },
    /**
     * @description PC端导入用户
     */
    importUser(){
      if(this.lcs.isLogin()){//已登录
        this.importCloud();
      } else{
        this.dialogVisible = true;
      }
    }
  },
  watch: {
    val: function() {
      let city = this.val[this.val.length - 1];
      this.$store.state.city = city;
      this.$store.state.AMap_Bus.city = city;
      let searchConfig = this.$store.state.AMap_PlaceSearch.config;
      searchConfig.city = city;
      let search = new AMap.PlaceSearch(searchConfig);
      this.$store.commit("setPlaceSearch", {
        config: searchConfig,
        search: search
      });
      this.init = true;
      this.$emit("init");
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

.el-cascader {
  width: 100%;
}

#import > h1 {
  font-size: 3rem;
  color: steelblue;
}
</style>
