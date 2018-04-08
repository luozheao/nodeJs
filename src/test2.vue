<template>
    <div>
      {{test}}
         <div v-for="p,index in hostDB">
             <div  @click="delEvent(p,index)">{{p.name}}</div>
         </div>
    </div>
</template>

<script>
    export default {
        name: "test2",
        props:['hostDB','test'],
      watch:{
          hostDB(a){
            console.log(a);
          }
      },
        methods:{
        delEvent(p,index){
          this.hostDB.splice(index,1);
        }
      }
    }
</script>

<style scoped>

</style>
