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
      <div id="total" @click="$emit('updateTransferPlan', 5, 5)">
        共{{$store.state.totalDays}}天
      </div>
    </div>
    <div id="paths">
      <ul id="nodex">
        <template v-for="(item, index) in $store.state.POIs[$store.state.nowDay]">
          <div class="nodeCard" :key="item.name" :index="index">
            <!--换乘选择-->
            <Collapse v-if="item.transfer" :transferItem="item.transfer">
              <!-- 选择器slot -->
              <div class="cd-select-group" slot="selector">
                <select name="cd-method" class="cd-select"
                        v-model="item.transfer.type"
                        @change="$emit('updateTransferPlan', index, item.transfer.type)">
                  <option v-for="option in transPlan" v-bind:value="option.data" :key="option.data">
                    {{option.name}}
                  </option>
                </select>
                <select name="cd-plan" class="cd-select"
                        v-model="item.transfer.index"
                        @change="$emit('updateTransferIndex', index, item.transfer.index)">
                  <option v-for="n in (item.transfer.plan.routes || item.transfer.plan.plans).length"
                          v-bind:value="n - 1"
                          :key="n">
                    方案{{n}}
                  </option>
                </select>
              </div>
              <!-- content -->
            </Collapse>
            <!--路程规划详情-->
            <div class="cd-transfer"></div>
            <!--目的地详情-->
            <div class="cd-main">
              <div type="simple" slot="header">
                <p>{{item.detail.name}}</p>
                <p class="sm">{{item.detail.address}}</p>
              </div>
            </div>
            <!--底部操作-->
            <div class="cd-footer">
              <button href="#" @click="$emit('setCenter', index)"><i class="iconfont icon-androidlocate"></i></button>
              <button href="#"><i class="iconfont icon-move"></i></button>
              <button href="#" @click="$emit('moveTo', index, null)"><i class="iconfont icon-delete color-alert"></i></button>
            </div>
          </div>
        </template>
      </ul>
    </div>
  </div>
</template>

<script>
import Sortable from "sortablejs";
import Collapse from "./DetailCard/Collapse";
export default {
  name: "Detailpath",
  components:{
    Collapse
  },
  data() {
    return {
      transPlan: [
        {
          data: "driving",
          name: "驾车"
        },
        {
          data: "bus",
          name: "公交"
        },
        {
          data: "ride",
          name: "骑行"
        },
        {
          data: "walk",
          name: "步行"
        }
      ]
    };
  },
  methods: {},
  updated: function() {
    let that = this;
    let container = document.getElementById("nodex");
    let sort = Sortable.create(container, {
      animation: 120,
      handle: ".cd-main",
      draggable: ".nodeCard",
      supportPointer: false,
      onStart: function(e) {
        that.$emit("drag");
      },
      onEnd: function(e) {
        that.$emit("drag");
        if (e.oldIndex !== e.newIndex) {
          //更改了poi顺序
          // console.log(e.item);
          // console.log(e.from);
          // console.log(e.from.childNodes);
          if (e.oldIndex < e.newIndex) {
            //从前往后移动，恢复回去
            let oldAfter = e.from.childNodes[e.oldIndex]; //当前数组下，原来在后面的元素
            e.from.insertBefore(e.item, oldAfter);
          } else {
            let oldAfter = e.from.childNodes[e.oldIndex + 1] || null;
            oldAfter
              ? e.from.insertBefore(e.item, oldAfter)
              : e.from.appendChild(e.item);
          }
          that.$emit("sort", e.oldIndex, e.newIndex);
        }
      },
      setData: function(dataTransfer, element) {
        dataTransfer.setData("ItemIndex", element.getAttribute("index"));
      }
    });
  }
};
</script>

<style scoped>
button:focus {
  outline: none;
}

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
  background-image: url("/static/trangle.png");
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
}
.cd-select-group  select {
  flex: 1 1 auto;
  margin: 0 16px;
  border: none;
  outline: none;
}

.cd-main {
  margin: 10px;
  color: white;
  background-color: #2384b8;
  border-left: #4d8eb1 1rem solid;
  border-radius: 2px;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
}
.cd-main div[type="simple"] {
  padding: 5px;
}
.cd-main div[type="simple"] > p {
  margin: 0;
}
.cd-main div[type="simple"] > .sm {
  font-size: 12px;
  color: rgb(202, 202, 202);
}
.cd-main div[type="simple"] > span {
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
.cd-footer > button {
  text-decoration: none;
  color: #333;
  background-color: white;
  border: none;
  flex: 1 1 auto;
  text-align: center;
  transition: all 0.2s ease;
}
.cd-footer > button:hover {
  background-color: whitesmoke;
}
.cd-footer > button:active {
  background-color: #c3c3c3;
  color: #333;
}
.color-alert {
  color: #e2414c;
}
</style>
