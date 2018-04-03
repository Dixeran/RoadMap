<template>
  <div id="Detailpath">
    <div id="daySelector">
      <div id="selector">
        <a href="#" @click="$store.commit('switchDay', $store.state.nowDay-1)">
          <i class="iconfont icon-left"></i>
        </a>
        <span>第<span>{{$store.state.nowDay + 1}}</span>天</span>
        <a href="#" @click="$store.commit('switchDay', $store.state.nowDay+1)">
          <i class="iconfont icon-right"></i>
        </a>
        <a href="#" @click="$store.commit('addNewDay')">
          <i class="iconfont icon-plus"></i>
        </a>
        <a href="#" class="alert" @click="$store.commit('deleteDay', $store.state.nowDay)">
          <i class="iconfont icon-minus"></i>
        </a>
      </div>
      <div id="total">
        共{{$store.state.totalDays}}天
      </div>
    </div>
    <div id="paths">
      <ul>
        <template v-for="item in $store.state.POIs[$store.state.nowDay]">
          <div class="nodeCard" :key="item.name">
            <!--换乘选择-->
            <div class="cd-select-group">
              <select name="cd-method" class="cd-select">
                <option value="#">驾车</option>
                <option value="#">公交</option>
                <option value="#">步行</option>
                <option value="#">骑行</option>
              </select>
              <select name="cd-plan" class="cd-select">
                <option value="#">方案一</option>
                <option value="#">方案二</option>
              </select>
              <a href="#"><!--TODO:click-->
                <i class="iconfont icon-more"></i>
              </a>
            </div>
            <!--路程规划详情-->
            <div class="cd-transfer"></div>
            <!--目的地详情-->
            <div class="cd-main">
              <div type="simple">
                <!--TODO:click-->
                <span><i class="iconfont icon-more"></i></span>
                <p>{{item.detail.name}}</p>
                <p class="sm">{{item.detail.address}}</p>
              </div>
              <div type="detail"></div>
            </div>
            <!--底部操作-->
            <div class="cd-footer">
              <a href="#"><i class="iconfont icon-androidlocate"></i></a>
              <a href="#"><i class="iconfont icon-move"></i></a>
              <a href="#"><i class="iconfont icon-delete color-alert"></i></a>
            </div>
          </div>
        </template>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "Detailpath",
  data() {
    return {};
  }
};
</script>

<style scoped>
#Detailpath {
  border-left: 1px solid rgba(0, 0, 0, 0.2);
  overflow-y: hidden;
}

#daySelector {
  width: 100%;
  height: 3rem;
  overflow: hidden;
  transition: all 0.1s ease;
}
#daySelector:hover {
  height: calc(3rem + 16px);
}
#selector {
  width: 100%;
  height: 3rem;
  display: flex;
  background-color: #2384b8;
}
#selector > a {
  color: whitesmoke;
  text-decoration: none;
  flex: 1 1 auto;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}
#selector > a:hover {
  background-color: #4d8eb1;
}
.alert {
  background-color: #f05b66 !important;
}
.alert:hover {
  background-color: #e2414c !important;
}
#selector > span {
  color: whitesmoke;
  line-height: 3rem;
  text-align: center;
  flex: 5 5 auto;
}
#selector > span > span {
  color: white;
  font-size: 1.5rem;
  margin: 0 1rem;
  line-height: 3rem;
}
#total {
  text-align: center;
  font-size: 12px;
  color: whitesmoke;
  background-color: #2384b8;
}

#paths {
  width: 100%;
  height: calc(100% - 3rem);
  overflow-y: auto;
  background-color: #f1f1f1;
}

#paths > ul {
  width: 100%;
  padding: 0;
  margin: 0;
}

.nodeCard {
  width: 100%;
  margin: 1rem 0;
  background-color: white;
  border-top: 1px solid rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  box-shadow: 0 0 1px rgba(0, 0, 0, 0.1);
}
.cd-select-group {
  display: flex;
  padding: 5px;
  border-bottom: 2px dashed whitesmoke;
}
.cd-select-group > select {
  flex: 1 1 auto;
  margin: 0 16px;
  border: none;
  outline: none;
}
.cd-select-group > a {
  text-decoration: none;
  transition: all 0.2s ease;
}
.cd-select-group > a:hover {
  background-color: rgb(212, 212, 212);
}

.cd-main {
  color: white;
  background-color: #2384b8;
  border-left: #4d8eb1 1rem solid;
  border-radius: 2px;
}
.cd-main > div[type="simple"] {
  padding: 5px;
}
.cd-main > div[type="simple"] > p {
  margin: 0;
}
.cd-main > div[type="simple"] > .sm {
  font-size: 12px;
  color: rgb(202, 202, 202);
}
.cd-main > div[type="simple"] > span {
  float: right;
}

.transfer {
  border-bottom: 2px dashed whitesmoke;
}

.cd-footer {
  border-top: 2px dashed whitesmoke;
  padding: 2px;
  display: flex;
  align-content: center;
  justify-content: center;
}
.cd-footer > a {
  text-decoration: none;
  color: #333;
  flex: 1 1 auto;
  text-align: center;
}
.cd-footer > a:hover {
  background-color: whitesmoke;
}
.color-alert {
  color: #e2414c;
}
</style>
