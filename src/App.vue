<template>
  <div id="app">
      <router-view></router-view>
  </div>
</template>

<script>
import api from '@/api/index.js';
import commonJs from '@/common.js';
export default {
  name: 'App',
  created(){
    let info = commonJs.getCookie("userInfo");
    if(info){
        this.$store.commit('setInfo',JSON.parse(info));
    }else{
        this.$router.push({name:'login'});
    }
  }
}
</script>
<style lang="scss" scoped>
  #app{
    width: 100%;
    height: 100%;
  }
</style>
