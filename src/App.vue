<style type="text/less" lang="less">
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    height: 100%;
    background: url("./images/flower.jpg") repeat;
    .el-button {
      font-size: 28px;
    }
    font18{
      font-size: 18px;
    }
    .font20 {
      font-size: 20px;
    }
    .font28 {
      font-size: 28px;
    }
    .font32 {
      font-size: 32px;
    }
    .center {
      text-align: center;
    }
    .toLeft {
      text-align: left;
    }
    .red {
      color: red;
      a {
        color: red;
      }
    }
  }
</style>
<template>
  <div id="app">
    <br>
    <el-row>
      <el-col :span="24" class="font32 center">言情小说论坛快捷操作
        <div class="font28">（author：luozheao）</div>
      </el-col>
    </el-row>
    <br>
    <el-row>
      <el-col :span="24">
        <el-button type="success" @click="sign">签到</el-button>
        <el-button type="warning" @click="getTodayLoveBook">获取当日小说</el-button>
        <el-button type="warning" @click="downloadBook">下载</el-button>
      </el-col>
    </el-row>

    <br>
    <el-row>
      <el-col :span="24">
        <div class="toLeft font32">签到信息：</div>
        <div v-for="item in signMsg" class="font18">{{item}}</div>
      </el-col>
      <br>
      <el-col :span="24">
        <div class="toLeft font32">今日书籍信息：</div>
        <div v-show="showMsg" class="center font28">{{this.msg}}</div>
        <div v-for="item in loveBooks" class="font18 red"><a :href="item.realDownLink">{{item.name}} {{
          item.realDownLink?"":"(您的书币不足)"
          }} </a></div>
      </el-col>
    </el-row>
  </div>
</template>

<script type="es6">


  export default {
    components: {},
    data() {
      return {
        signMsg: [],
        loveBooks: [],
        showMsg:false,
        msg:"正在获取书籍，请不要离开页面...",
      }
    },
    name: 'luozheao',
    methods: {
      sign() {
        this.signMsg = ['正在加载...'];
        this.$api.get('/api/sign', "", response => {
          if (response.status == 200) {
            this.signMsg = response.data;
          }
        });
      },
      downloadBook(){
        this.$api.get('/api/download', "", response => {
          if (response.status == 200) {
              console.log(response);
          }
        });
      },
      getTodayLoveBook() {
        this.loveBooks=[];
        this.showMsg=true;
        this.msg="正在获取书籍，请不要离开页面...";
        this.$api.get('/api/getTodayLoveBook', "", response => {
          if (response.status == 200) {
            this.loveBooks = response.data;

            if(this.loveBooks.length==0){
              this.msg="今日没有可下载书籍";
            }else{
              this.showMsg=false;
            }
          }
        });
      },
    },
    created() {

    },
    mounted() {


    },
    beforeRouteEnter(to, from, next) {

    },
  }
</script>


