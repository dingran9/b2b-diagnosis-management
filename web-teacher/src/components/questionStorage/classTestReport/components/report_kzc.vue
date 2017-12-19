<template>
  <div class="report_kzc" @click="toDetail">
    <div class="top-right-corner" v-if="true">
      <i>...</i>
      <!--需要删除功能,去下面把hover解除注释-->
      <img src="../../../../../static/img/questionDelete.png" alt="" v-if="false">
    </div>
    <div class="container">
      {{item.inClassTestName}}
    </div>
    <div class="bottom">
      <span class="class">{{item.className}}</span>
      <span class="number">共<i class="red">{{item.questionCount}}</i>题</span>
      <span class="time">
        <i class="red">{{timeFormt.MonthDay}}</i>
        {{timeFormt.weekday}}
        <i class="red">{{timeFormt.HoursMinute}}</i>
      </span>
    </div>
    <!--<div class="gege">{{timeFormt}}</div>-->
  </div>
</template>

<script>
  export default {
    props:["item"],
    data() {
      return {
        data: {},
        list: {},
        flag: {},
      }
    },
    components: {},
    mounted() {
    },
    methods: {
      toDetail(){
        this.reportVerificationFrmoDB(()=>{
//          this.$router.push({path:'/questionStorage/reportDetail_kzc',query:this.item});//目前只用了inClassTestCode
          this.$router.push({path:'/questionStorage/reportDetail_duoheyi',query:this.item});
        })
      },
      reportVerificationFrmoDB(nextFn){
        this.$ajax.reportVerification({inClassTestCode:this.item.inClassTestCode})
          .then(({httpCode, result}) => {
            if (httpCode == 200) {
              if (!result) {
                this.$message("尚未有人答题");
                return;
              };
              if (nextFn) {
                nextFn();
              }
            } else {
              this.$message("通讯异常")
            }
          })
          .catch((error) => {
            console.log(error);
          })
      },
    },
    computed: {
      timeFormt(){
        //测试时间
        if(!this.item.testTime){
          console.log("曾JJ,你又给我来了一个null/undefined")
        }
        let testData=new Date(this.item.testTime);//1508313283109//this.item.testTime
        let testDataString=testData.toString();
        let weekdays=["日","一","二","三","四","五","六"];
//        console.log(testData.getMonth(),testData.getDate())
        let timeObj={
          time:testDataString,
          yearMonthDay:testData.getFullYear()+"-"+testData.getMonth()+'-'+testData.getDate(),
          MonthDay:testData.getMonth()+'-'+testData.getDate(),
          fullYear:testData.getFullYear(),
          Month:testData.getMonth(),
          day:testData.getDate(),
          weekday:"星期"+weekdays[testData.getDay()],
          HoursMinute:testDataString.split(" ")[4].split(":")[0]+":"+testDataString.split(" ")[4].split(":")[1],
        };
        //当前时间
        let now=new Date();//当前时间
        let prev=new Date(now*1-24*60*60*1000);
        let today=now.getFullYear()+"-"+now.getMonth()+'-'+now.getDate();//今天
        let yestoday=prev.getFullYear()+"-"+prev.getMonth()+'-'+prev.getDate();//昨天
        let arr=[today,yestoday];//今天,昨天,
        let where=arr.indexOf(timeObj.yearMonthDay);
//        console.log(where);
        if(where==0){
          timeObj.weekday="今天";
          timeObj.MonthDay='';
        }else if(where==1){
          timeObj.weekday="昨天"
          timeObj.MonthDay='';
        }
        return  timeObj;
      }
    },
    filters: {}

  }
</script>



<style lang="scss" scoped>
  .report_kzc {
    position: relative;
    overflow: hidden;
    width: 360px;
    height: 200px;
    background: #fff;
    margin-right:30px;
    display: inline-block;
    cursor:pointer;
    .top-right-corner{
      position: absolute;
      width: 88px;
      height: 88px;
      background-color: rgba(31, 208, 148, 1);
      border-radius: 50%;
      top:-44px;
      right:-44px;
      i{
        position: absolute;
        bottom: 16px;
        left: 16px;
        font-size: 30px;
        color: #fff;
        background:transparent;
      }
      img{
        position: absolute;
        bottom: 16px;
        left: 16px;
        display: none;
      }
/*      &:hover{
        background: #ff6666;
        cursor: pointer;
        img{
          display: initial;
        }
        i{
          display: none;
        }
      }*/
    }
    .container{
      height: 160px;
      line-height:160px;
      text-align: center;
      font-size:18px;
      color: #505050;
      border-bottom:1px solid rgba(225, 229, 236, 1);
    }
    .bottom{
      font-size:16px;
      color: #999;
      height:40px;
      line-height:40px;
      font-size:0;
      *{
        display: inline-block;
        font-size:16px;
      }
      .class{
        width: 100px;
        text-align: center;
      }
      .number{
        width: 90px;
        text-align: left;
      }
      .time{
        width: 148px;
        text-align: right;
      }
      .red{
        color:red;
      }
    }
  }
</style>
<style lang="scss">
  .report_kzc {

  }
</style>
