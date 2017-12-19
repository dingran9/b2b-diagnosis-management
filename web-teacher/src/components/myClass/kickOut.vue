<template>
<div class="alterOuter">
  <div class="alterBody">
    <div class="title"></div>
    <img :src="(!toZi.userImage)? img222:toZi.userImage" alt="">
    <p>是否将{{toZi.userName}}踢出班级？</p>
    <div>
      <button @click="colose">取消</button>
      <button @click="confrm">踢出班级</button>
      <!--{{toZi}}-->
    </div>
  </div>
</div>
</template>
<script>
  // import reportItem from '../../../common/reportItem.vue';
  import img111 from '../../../static/img/student.png'
  export default {
    props:["toZi"],
    components: {
      // reportItem
    },
    data(){
      return {
        data: {
          classList: [],
          studentList:[],
        },
        flag: {
          classSelect: 0,
          studentSlect:0,
        },
        img222: img111
      }
    },
    mounted(){


    },
    methods: {
      colose(){
        this.$emit('watchZi',false);
      },
      confrm(){
        this.$emit('watchZi',true)
      }
    },
    computed: {},
    filters: {}

  }
</script>
<style lang="scss">
  @import '../../../static/css/contentRight';
  .alterOuter{
    width:100%;
    height:100%;
    background:rgba(178,178,178,0.2);
    /*background:red;*/
    position:fixed;
    z-index: 2045;
    top:0;left:0;
    .alterBody{
      position:absolute;
      top:50%;
      left:50%;
      $w : 630px;
      $h : 340px;
      width: $w;
      height:$h;
      margin-top:-$h / 2;
      margin-left:-$w / 2;
      box-sizing:border-box;
      background:#ffffff;
      .title{
        background:#d3f2e5;
        width:100%;
        height:64px;
      }
      img{
        margin-top:24px;
        width:106px;
        height:106px;
        border-radius:50%;
        border:4px solid #ffffff;//等待换色。
      }
      p{
        margin-top:16px;
        font-size:18px;
        height:18px;
      }
      button{
        width:143px;
        height:40px;
        margin-top:30px;
        border-radius:20px;
        font-size:18px;
        color:#fff;
        background:#b3b3b3;
        outline:none;
        cursor: pointer;
      }
      button:nth-of-type(2){
        margin-left:50px;
        background:#1fd094;
      }
    }
  }
</style>
