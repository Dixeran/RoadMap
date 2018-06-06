<template>
  <div id="Checklist">
    <el-row justify="end" type="flex">
      <el-col :span="20">
        <h1 class="text" id="hTitle">{{mapState.city}} {{mapState.POIs.length}} 日游</h1>
      </el-col>
    </el-row>
    <el-row justify="end" type="flex">
      <el-col :span="16">
        <h2 class="text" id="mTitle">{{hitokoto.hitokoto}}</h2>
        <h2 class="text" id="mTitle">—— 《{{hitokoto.from}}》</h2>
      </el-col>
    </el-row>
    <el-row v-for="(day, n) in $store.state.POIs" :key="n" type="flex" justify="center" class="block">
      <el-col :span="4">
        <el-card class="box-card">
          <h3 class="text dTitle">Day {{n + 1}}</h3>
          <p>门票花费：{{getDailyCost(n)}}</p>
        </el-card>
      </el-col>
      <el-col :span="20">
        <el-table :data="day">
          <el-table-column prop="detail.name" label="名称"></el-table-column>
          <el-table-column prop="detail.address" label="地址"></el-table-column>
          <el-table-column prop="detail.name" label="Tag">
            <template slot-scope="scope">
              <el-tag>{{scope.row.detail.type.split(';')[0]}}</el-tag>
              <el-tag v-if="scope.row.detail.groupby">团购</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "Checklist",
  mounted: function() {
    let that = this;
    var xhr = new XMLHttpRequest();
    xhr.open("get", "https://v1.hitokoto.cn/?c=d");
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        var data = JSON.parse(xhr.responseText);
        if (data.hitokoto[data.hitokoto.length - 1] == "。") {
          data.hitokoto = data.hitokoto.substring(0, data.hitokoto.length - 1); //delete coma
        }
        that.hitokoto = data;
      }
    };
    xhr.send();
  },
  data() {
    return {
      hitokoto: {}
    };
  },
  methods:{
    getDailyCost:function(day){
      day = this.$store.state.POIs[day];
      let cost = 0;
      for(let i = 0; i < day.length; i++){
        if(day[i].detail.deep_type == "SCENIC"){
          cost += parseFloat(day[i].detail.scenic.price);
        }
      }
      return cost;
    }
  },
  computed: {
    mapState: function() {
      return this.$store.state;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
* {
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
}
h3 {
  font-weight: 500;
}
.text {
  color: #333;
}
.block {
  margin: 3rem 0;
  border-top: dashed 2px #2384b8;
}

#Checklist {
  margin: 0 50px;
}

#hTitle {
  text-align: right;
  font-size: 5rem;
  font-weight: 500;
  margin-bottom: 1rem;
}
#mTitle {
  text-align: right;
  font-size: 1rem;
  font-weight: 300;
  text-indent: 2rem;
}
.dTitle {
  text-align: center;
  font-size: 2rem;
  margin: 1rem 0;
}

.box-card{
  text-align: center;
}
</style>
