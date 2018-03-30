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
        <div class="nodeCard">
          <div class="cd-select">
            <select name="cd-method" class="cd-method">
              <option value="#">驾车</option>
              <option value="#">公交</option>
              <option value="#">步行</option>
              <option value="#">骑行</option>
            </select>
            <a href="#"></a>
          </div>
          <div class="cd-transfer"></div>
          <div class="cd-main"></div>
          <div class="cd-footer"></div>
        </div>
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
</style>
