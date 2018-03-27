<template>
  <div id="Errorhandler">
    {{errorData}}
  </div>
</template>
<script>
export default {
  name:'Errorhandler',
  props:['errorData']
}
</script>

<style scoped>
#Errorhandler{
  text-align: center;
  font-size: 1.25rem;
  padding: 0.2rem 0.5rem;
  background-color: #f05038;
  color: white;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.3);
  border-radius: 2px;
  transition: all ease 0.2s;
}
#Errorhandler:hover{
  box-shadow: 0 0 8px #b83e2c;
}
</style>
