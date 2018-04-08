<style>

</style>
<template>
  <div  >
           再见,世界!
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

  },
  watch:{

  },
  methods:{

  },
  mounted(){

  },
  beforeRouteEnter(to,from,next){
     next(vm=>{
        console.log(vm,'haha');
     });
  },
}
</script>


