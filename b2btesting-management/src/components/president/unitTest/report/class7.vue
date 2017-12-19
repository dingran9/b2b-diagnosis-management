<template>
  <div class="rp-div">
    <p class="titlePc">班级达标率表</p>
    <div class="hg-div" v-if="isEmptyObject(result)!=true&&result!=null">
      <p class="hg-legend"><i class="youxiu"></i><span>达标线以上</span><i class="bujige"></i><span>达标线以下</span></p>
      <span>0%</span>
      <span style="float: right;">100%</span>
      <ul>
        <li class="hg-ul-dot"></li>
        <li class="hg-ul-lang"></li>
        <li class="hg-ul-lang" style="left: 40%"></li>
        <li class="hg-ul-lang" style="left: 60%"></li>
        <li class="hg-ul-lang" style="left: 80%"></li>
        <li v-for="(value,key,index) in result">
          <p class="hg-classname">{{key}}</p>
          <p class="hg-num">
            <span class="hg-num-l" v-bind:style="{width: value.standard+'%'}">{{value.standard}}%</span><span class="hg-num-r" v-bind:style="{width: value.unStandardCount+'%'}">{{value.unStandardCount}}%</span>
          </p>
        </li>
      </ul>
    </div>
    <div v-else class="nodata">
      暂无数据
    </div>
    <!--<div id="container" style="min-width: 310px; max-width: 800px; height: 400px; margin: 0 auto"></div>-->
  </div>
</template>

<script>
  //  import config from '../../config/config'
  export default {
    data() {
      return {
        result: {}
      }
    },
    mounted: function () {
      this.getSourceDate()
    },
    methods: {
      getSourceDate: function () {

        let url = this.getrequestInterface("teacherReport/getClassStandard")

        this.$http.get(url)
          .then(res => {

            if (res.body.message == "Success") {

              if(this.isEmptyObject(res.body.result)){
                return;
              }

              this.result=res.body.result

            }

          }, res => {

            console.log(res)

          });

      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  .rp-div{
    /*margin-top: 0.4rem;*/
    background:#fff;
    .titlePc{
      font-size:20px;
      text-align: left;
      border-bottom:1px solid #e1e5ec;
      padding:10px 40px;
    }
    .nodata{
      height:100px;
      line-height:100px;
      font-size:20px;
      background:#fff;
      margin-top: 20px;
      margin-left:18px;
    }
  }
  /*下面是从h5复制的，有空来调*/
  /*.rp-div {*/
  /*margin-top: 0.4rem;*/
  /*padding:0.5rem;*/
  /*background: #fff;*/
  /*}*/
  .rp-title {
    position: relative;
    line-height: 1rem;
    font-size: 0.56rem;
    width: 3.6rem;
    border-bottom: 1px dashed #CCCCCC;
  }
  .rp-title-l {
    position: absolute;
    left: 0;
    bottom: 0;
    margin-left: -0.1rem;
    margin-bottom: -0.1rem;
    display: block;
    width: 0.2rem;
    height: 0.2rem;
    background: #CCCCCC;
    border-radius: 0.09rem;
  }
  .rp-title-r {
    position: absolute;
    right: 0;
    bottom: 0;
    margin-right: -0.1rem;
    margin-bottom: -0.1rem;
    display: block;
    width: 0.2rem;
    height: 0.2rem;
    background: #CCCCCC;
    border-radius: 0.1rem;
  }
  .rp-table {
    width: 100%;
    overflow: auto;
    margin-top: 0.6rem;
  }
  .rp-table table{
    min-width: 100%;
    background: #F8F8F8;
    border-radius: 10px;
    font-size: 0.6rem;
    color: #828282;
    margin-bottom: 2rem;
    border-right: 1px solid #F8F8F8;
  }
  .rp-table table tr:first-child{
    background: #FFEFEF
  }
  .rp-table td{
    min-width: 5rem;
    text-align: center;
    line-height: 1.6rem;
    border-bottom: 1px solid #fff;
    border-right: 1px solid #fff;
  }
  .rp-table tr td:last-child {
    border-right: 0;
  }
  .hg-div {
    width: 684px;
    margin: 0px auto;
    padding: 30px 0px;
    color: #666666;
    box-sizing: border-box;
    min-height: 350px;
    font-size: 20px;
    text-align:left;
  }
  .hg-div ul {
    border: 1px solid #FFA1A1;
    margin-top:10px;
    padding-top: 0.3rem;
    padding-bottom: 0.3rem;
    position: relative;
  }
  .hg-ul-dot {
    position: absolute;
    display: block;
    top: 0;
    left: 0;
    margin-left: -0.1rem;
    margin-top: -0.1rem;
    width: 0.2rem;
    height: 0.2rem;
    background: #FF9E9E;
    border-radius: 0.1rem;
  }
  .hg-ul-lang {
    position: absolute;
    display: block;
    top:0;
    left: 20%;
    width: 1px;
    height: 100%;
    background: #FFE8E8;
  }
  .hg-div .hg-classname{
    margin-top: 0.3rem;
    margin-bottom: 0.3rem;
    padding-left: 0.5rem;
    z-index: 999!important;
  }
  .hg-div .hg-num {
    /*height: 30px;*/
    border-radius: 0.6rem;
    overflow: hidden;
    color: #fff;
  }
  .hg-num-l,.hg-num-c,.hg-num-r{
    display: inline-block;
    text-align: center;
    position:relative;
    z-index: 999!important;
  }
  .hg-num-l {
    background-color: #6CA5FE;
  }
  .hg-num-c{
    background-color: #81C2F5;
  }
  .hg-num-r{
    background-color: #FE964E;
  }
  .hg-legend {
    margin: 0.3rem 0;
    height: 20px;
    margin-bottom:20px;
    text-align: center;
  }
  .hg-legend .youxiu,.hg-legend .jige,.hg-legend .bujige {
    display: inline-block;
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 0.25rem;
    margin-left: 20px;
    margin-right: 0.3rem;
  }
  .hg-legend .youxiu {
    background-color: #6CA5FE;
  }
  .hg-legend .jige {
    background-color: #81C2F5;
  }
  .hg-legend .bujige {
    background-color: #FE964E;
  }
</style>
