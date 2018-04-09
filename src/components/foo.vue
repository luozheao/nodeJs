<style type="text/css" lang="less">
.el-col{
  line-height: 2em;
  &.red{
    color:red;
  }
}
</style>
<template>
  <div  style="width:700px;margin: 0 auto;">
    <br>
      <el-row>
        <el-col :span="4"  class="red">   姓名: </el-col>
        <el-col :span="10">   <el-input v-model="name"></el-input> </el-col>
        <el-col :span="4">    <el-button type="primary" @click="submit" size="mini">提交</el-button> </el-col>
      </el-row>

    <el-row v-for="item,index in data" :key="index">
      <el-col :span="4">姓名:{{item.name}}</el-col>
      <el-col :span="2">id:{{item.id}}</el-col>
    </el-row>

  </div>
</template>

<script type="es6">

export default {
  props:[],
  components:{},
   data(){
      return{
          name:'',
          data:[],
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
    submit(){
      this.$api.post('/api/out', {name:this.name}, response => {
                if(response.status==200){
                   this.data=response.data;
                }
      });
    },
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


