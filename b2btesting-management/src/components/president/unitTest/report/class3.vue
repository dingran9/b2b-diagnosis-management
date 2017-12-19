<template>
  <div class="rp-div">
    <p class="titlePc">各题出错情况</p>
    <div class="tableContent" v-if="isEmptyObject(result)!=true&&result!=null">
      <ul class="ct-ul">
        <li >序号</li>
        <li v-for="n in num">{{n}}</li>
      </ul><ul v-for="(item, index) in result" class="ct-ul">
      <li>{{item[0].className}}</li>
      <li v-for="s in item">
        <span>{{s.questionSn}}题/{{s.wrongCount}}人</span>
      </li>
      <li v-if="item.length<num"  v-for="n in num-item.length">-</li>
    </ul>

    </div>
    <div v-else class="nodata">
      暂无数据
    </div>
    <p style="height: 0.5rem;background: #fff"></p>
  </div>
</template>

<script>
  //  import config from '../../config/config'
  export default {
    data() {
      return {
        num: 0,
        result: {}
      }
    },
    mounted: function () {
      this.getSourceDate()
    },
    methods:{
      getSourceDate: function () {

        let url = this.getrequestInterface("teacherReport/getClassWrongQuestionRank")

        this.$http.get(url)
          .then(res => {

            if (res.body.message == "Success") {

              if(this.isEmptyObject(res.body.result)){
                return;
              }
              this.result=res.body.result
              var a = [];
              for(var key in this.result){
                a.push(this.result[key].length);
              }
              this.num = Math.max.apply(null, a)

            }

          }, res => {

            console.log(res)

          });

      }
    }
  }
</script>

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
    .tableContent{
      background: #ffffff;
      min-width: 100%;
      overflow: auto;
      white-space:nowrap;
      margin: 0.5rem 0 0.5rem 0;
      border-radius: 5px;
      margin-top:30px;
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
  /*  .rp-div {
      margin-top: 0.4rem;
      padding: 0 0.5rem;
      padding-top: 0.5rem;
      background: #fff;
    }*/
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
  .table_body1{min-width: 100%;
    line-height:1.6rem;
    background:#fff; font-size: 0.6rem;
    text-align: center;
  }
  .table_body1 th{
    font-weight: normal;
    background: #FFEFEF;
  }
  .table_body1 td{
    background:rgb(244, 247, 251);
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
  .ct-ul {
    display: inline-block;
    /*width: 5rem;*/
    vertical-align: top;
    text-align: center;
    font-size: 0.6rem;
    color: #666;
  }

  .ct-ul li{
    min-width:200px;
    height:36px;
    font-size:16px;
    line-height: 36px;
    border-bottom: 1px solid #fff;
    border-left: 1px solid #fff;
    border-right: 1px solid #fff;
    list-style: none;
  }
  .ct-ul li:nth-child(odd){
    background:#e1edf1;
    height:36px;
  }
  .ct-ul li:nth-child(even){
    background:#eff4f6;
    height:36px;
  }
  .ct-ul li:first-child{
    background: #8bb6c4;
  }




</style>
