<template>
  <div id="User">
    <el-alert
      v-show="error != ''"
      title="登录/注册错误"
      type="error"
      :description="error"
      show-icon>
    </el-alert>
    <el-form ref="form" :model="form">
      <el-form-item label="邮箱">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="form.passwd" type="password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="login">登录</el-button>
        <el-button @click="signin">注册</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "User",
  data() {
    return {
      form: {
        name: "",
        passwd: ""
      },
      error: ""
    };
  },
  methods: {
    login: function() {
      this.lcs
        .Login(this.form.name, this.form.passwd)
        .then(() => {
          this.$emit("login");
        })
        .catch(() => {
          this.error = "登录出错！";
        });
    },
    signin: function() {
      this.lcs
        .Signin(this.form.name, this.form.passwd)
        .then(() => {
          this.$emit("login");
        })
        .catch(() => {
          this.error = "注册失败耶";
        });
    }
  }
};
</script>
