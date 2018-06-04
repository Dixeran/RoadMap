<template>
  <div id="Navbar">
    <div id="logo">
      <span>RoadMap</span>
    </div>
    <ul id="navlist" v-if="!isMobile">
      <router-link to="/">路径规划</router-link>
      <router-link to="/abstract">行程概览</router-link>
    </ul>
    <input id="cityName" type="text"
      v-if="!isMobile"
      v-model="$store.state.city"
      v-bind:class="$store.state.city == '' ? 'unName' : ''"
      placeholder="输入城市名">
    <el-popover
      placement="top-start"
      trigger="hover"
      v-if="!isMobile">
      <el-switch
        active-text="保存至云端"
        :value="$store.state.storge.toCloud"
        @change="storgeStateChange">
      </el-switch>
      <el-button @click="mycode = true" v-if="$store.state.storge.toCloud">生成分享二维码</el-button>
      <el-button icon="el-icon-upload" circle slot="reference" @click="save" v-loading="loading"></el-button>
    </el-popover>

    <el-dialog
      title="登录/注册"
      :visible.sync="dialogVisible">
      <User @login="dialogVisible = false;login_success()"/>
    </el-dialog>

    <el-dialog
      title="分享二维码"
      :visible.sync="mycode"
      @open="showCode">
      <canvas id="qrcode"></canvas>
    </el-dialog>
  </div>
</template>

<script>
import Qrcode from "qrcode";
import User from "./User";
export default {
  name: "Navbar",
  components: {
    User
  },
  data() {
    return {
      dialogVisible: false,
      loading: false,
      mycode: false
    };
  },
  methods: {
    storgeStateChange(new_state) {
      if (new_state) {
        //设置上云
        if (!this.lcs.isLogin()) {
          this.dialogVisible = true; //未登录，弹窗
          this.$store.state.storge.toCloud = false;
        } else {
          this.login_success();
        }
      } else {
        //取消上云
        this.$store.state.storge.toCloud = false;
      }
    },
    login_success() {
      this.$store.state.storge.toCloud = true;
    },
    save() {
      this.loading = true;
      if (!window.localStorage) {
        this.$message({
          message: "保存需要使用localstorge",
          type: "error"
        });
        this.loading = false;
      } else {
        localStorage.setItem(
          "roadmap",
          JSON.stringify(this.$store.getters.exportData)
        );
        console.log(localStorage.getItem("roadmap"));
        if (this.$store.state.storge.toCloud) {
          this.lcs
            .saveToCloud(JSON.stringify(this.$store.getters.exportData))
            .then(result => {
              console.log(result);
              this.loading = false;
            })
            .catch(err => {
              console.log(err);
              this.loading = false;
            });
        } else {
          this.loading = false;
        }
      }
    },
    showCode() {
      let that = this;
      setTimeout(function() {
        let canvas = document.getElementById("qrcode");
        Qrcode.toCanvas(canvas, "https://dixeran.github.io/RoadMap/?type=mobile&email=" + that.lcs.getEmail() + "/", function(error) {
          if (error) console.error(error);
          console.log("success!");
        });
      }, 100);
    }
  }
};
</script>

<style scoped>
#Navbar {
  width: 100%;
  height: 60px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.25);
  padding-right: 10px;
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

@media screen and (max-width: 600px) {
  #Navbar {
    height: 40px;
  }
}
</style>
