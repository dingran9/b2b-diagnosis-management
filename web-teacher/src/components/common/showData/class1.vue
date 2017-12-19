<template>
  <div class="rp-div">
    <div class="left">
      <p class="titlePc"><span class="titleLeft">知识模块掌握情况</span></p>
      <class5a></class5a>
    </div>
    <div class="right">
      <p class="titlePc"><span class="titleRight">共性错误知识点</span></p>
      <class5b></class5b>
    </div>
  </div>
</template>

<script>
  import class5a from "./class1a.vue"
  import class5b from "./class1b.vue"
  export default {
    data() {
      return {
      }
    },
    mounted: function () {

    },
    methods:{

    },
    components:{
      class5a,
      class5b,
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style  lang="scss" scoped>
  .rp-div {
    /*margin-top: 0.4rem;*/
    padding:0.5rem;
    background: #fff;
    display: flex;
    justify-content: center;
    .titlePc{
      font-size:20px;
      text-align: center;
      border-bottom:1px solid #e1e5ec;
      padding:10px 40px;
      .titleLeft{
        /*border-right:1px solid #1fd094;*/
        width:174px;
        display:inline-block;
        text-align:center;
      }
      .titleRight{
        @extend  .titleLeft;
        border:0px;
      }
    }
    .left{
      display:inline-block;
      width:45%;
      /*background:red;*/
    }
    .right{
      @extend .left;
      /*background:green;*/
      margin-left:5%;
    }
  }

</style>
