<style>

</style>
<template>
  <div  @click="haha">
           你好,世界!
    <img src="http://localhost:8088/logo.png">
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
     route(){
       return this.$route.params;
     }
  },
  watch:{
    route:{
      handler(a,b){
           console.log(a,b);
      },
      deep:true,
    },
  },
  methods:{
      hehe(){
        alert(1);
      },
    haha(){
        // let fn=(resolve)=>{
        //     setTimeout(()=>{
        //       console.log('fn');
        //       resolve();
        //     },2000)
        // }
        // this.test(fn).then(()=>{
        //    console.log(2);
        // });
'  '
      this.$api.get('/api/login', {}, response => {
                console.log(response);
      });
      this.$api.post('/api/out', {name:'luoshengmen123'}, response => {
        console.log(response,123);
      });
    },
    async test(fn){
       return  new Promise((so,re)=>{
              fn(so);
         })
    }
  },
  mounted(){

  },
  beforeRouteEnter(to,from,next){
    next(vm=>{
      console.log(vm,'foo');
    });
  },
}
</script>


