<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
</style>
<template>
  <div id="app">
              <span @click="hello">hello world!</span>
              <router-link to="/haha">Go to Haha</router-link>
              <router-link to="/foo/user">Go to Foo</router-link>
              <router-view></router-view>
  </div>
</template>

<script type="es6">

import  test from './test.vue';

export default {
    components:{test},
    data(){
      return{

      }
   },
   name:'luozheao',
   methods:{
     hello(){

     },
   },

  mounted(){

  },
  beforeRouteEnter(to,from,next){
    next(vm=>{
      console.log(vm,'App');
    });
  },
}
</script>


