<template>
  <div class="rp-div">
    <div class="left">
      <p class="titlePc"><span class="titleRight">平均分变化曲线</span></p>
      <class8a></class8a>
    </div>
    <div class="right">
      <p class="titlePc"><span class="titleRight">学科能力变化曲线</span></p>
      <class8b></class8b>
    </div>
  </div>
</template>

<script>
  import class8a from "./class9a.vue"
  import class8b from "./class9b.vue"
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
      class8a,
      class8b,
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style  lang="scss" scoped>
  .rp-div {
    /*margin-top: 0.4rem;*/
    background: #fff;
    display: flex;
    /*justify-content: center;*/
    .titlePc{
      font-size:20px;
      text-align: left;
      border-bottom:1px solid #e1e5ec;
      padding:10px 40px;
      .titleLeft{
        border-right:1px solid #1fd094;
        width:236px;
        display:inline-block;
        text-align:center;
      }
      .titleRight{
        @extend  .titleLeft;
        border:0px;
        text-align:left;
        text-indent:5px;
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
