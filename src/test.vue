<style>

</style>
<template>
  <div id="test">
           <div v-for="p in arr">{{p}}</div>
  </div>
</template>

<script type="es6">

export default {
  props:[],
  components:{},
   data(){
      return{

      }
   },
  computed:{
    arr(){
      return this.$store.state.arr;
    }
  },
  watch:{
    arr(newArr){
        console.log(newArr);
    }
  },
  methods:{

  },
  mounted(){

  }
}
</script>


