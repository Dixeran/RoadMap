<template>
  <div id="Daytransmit">
    <ul>
      <div class="item" v-for="n in $store.state.totalDays">
        <div class="item-line" v-if="n != 1"></div>
        <i class="item-icon iconfont icon-right"></i>
        第{{n}}天
      </div>
    </ul>
  </div>
</template>

<script>
export default {
  name: "Daytransmit",
  data(){
    return{

    }
  }
};
</script>

<style scoped>
#Daytransmit{
  background-color: whitesmoke;
  border: 1px dashed rgba(0, 0, 0, 0.25);
  border-right: none;
}
#Daytransmit > ul{
  display: flex;
  flex-direction: column;
  padding: 0 1rem;
  margin: 0;
}
  .item{
    position: relative;
    //background-color: white;
    padding: 5px;
    text-align: center;
    margin: 1rem 0;
  }
  .item-line{
    height: 1.5rem;
    position: absolute;
    top: -1.75rem;
    left: 1rem;
    border-left: #2384b8 3px solid;
    border-radius: 2px;
  }
  .item-icon{
    color: #2384b8;
  }
</style>
