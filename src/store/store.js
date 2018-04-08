
let storeOptions={
  strict:true,
  state:{
      arr:'luozheao'
  },
  mutations: {
     changeArr(state,arr){
       setTimeout(p=>{
         state.arr=arr;
       },1000); 
     }
  },
  actions:{
     changeArr({commit},arr){
       setTimeout(p=>{
         commit('changeArr2',arr);
       },1000);

     }
  }
};

module.exports=storeOptions;
