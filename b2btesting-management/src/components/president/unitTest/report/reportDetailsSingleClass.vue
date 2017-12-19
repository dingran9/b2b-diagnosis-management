<template>
  <div class="rp-div">
    <section class="header" v-if="true">
      <div class="title">
        <span>考试名称：{{paperDetail.diagnosisName}}</span>
        <button @click="goBack">返回上一级</button>
      </div>
    </section>
    <section class="report-section-main">
      <section class="main-header">
        <div class="head-title">
          <span>年级：{{commonGrond[paperDetail.gradeCode]}}</span>
          <span>测试日期：{{paperDetail.startTime|time}}</span>
        </div>
        <div class="head-title">
          <span>学科：{{commonSubject[paperDetail.subjectCode || userInfo.userSubject]}}</span>
          <span>报告日期：{{paperDetail.endTime|time}}</span>
        </div>
      </section>

      <section class="main-content">
        <p class="titlePc">合格率及达标率</p>
        <!--<h3 class="content-title"><span></span>合格率及达标率<span></span></h3>-->
        <section class="content-table">
          <table cellpadding="1" cellspacing="1">
            <thead>
            <tr>
              <th>优秀率</th>
              <th>合格率</th>
              <th>不合格率</th>
              <th>达标率</th>
              <th>未达标率</th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td>{{result.excellent || 0}}%</td>
              <td>{{result.qualified || 0}}%</td>
              <td>{{result.unQualified || 0}}%</td>
              <td>{{result.standard || 0}}%</td>
              <td>{{result.notStandard || 0}}%</td>
            </tr>
            </tbody>
          </table>
        </section>
        <p class="titlePc">班级学科成绩</p>
        <!--<h3 class="content-title"><span></span>班级学科成绩<span></span></h3>-->
        <div class="content-number">
          <p>参加考试人数：{{attended}}人</p>
          <p>未参加考试人数：{{notAttended}}人</p>
        </div>
        <section class="content-table">
          <table cellpadding="1" cellspacing="1">
            <thead>
            <tr>
              <th></th>
              <th>总分</th>
              <th>平均分</th>
              <th>标准差</th>
              <th>最高分</th>
              <th>最低分</th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td>{{result.className}}</td>
              <td>{{result.paperTotalScore||0}}</td>
              <td>{{result.avgScore||0}}</td>
              <td>{{result.standardDeviation||0}}</td>
              <td>{{result.maxScore||0}}</td>
              <td>{{result.minScore||0}}</td>
            </tr>
            </tbody>
          </table>
          <table cellpadding="1" cellspacing="1">
            <thead>
            <tr>
              <th>排名</th>
              <th>姓名</th>
              <th>分数</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for ="(item, index) in result.studentScoreModels">
              <td>{{index+1}}</td>
              <td>{{item.studentName}}</td>
              <td>{{item.score}}</td>
            </tr>
            <tr v-for ="(item, index) in result.notAttendedStudentScoreModels">
              <td>{{result.studentScoreModels.length+index+1}}</td>
              <td>{{item.studentName}}</td>
              <td>未参加考试</td>
            </tr>
            </tbody>
          </table>
        </section>

      </section>
    </section>

  </div>
</template>

<script>
  export default {
    data() {
      return {
        paperDetail: JSON.parse(window.localStorage.getItem('reportData')),
        type:this.$route.query.type,//地址栏type参数 返回跳转页面
        userInfo:JSON.parse(window.localStorage.getItem('webTeacherUser')),
        result:{},//初始化数据
        notAttended:0,//未参加考试人数
        attended:0,//参加考试人数
        list:[{
          insertId: 'asfasf252',
          bb:29
        },{
          insertId: '2652',
          bb:20
        },{
          insertId: '996',
          bb:18
        }],
        a:[]
      }
    },
    components: {

    },
    mounted(){
      this.$nextTick(function(){
        this.initData();
      })
    },
    computed:{
      cc: function(){
        var sum = 0;
        for(var i= 0 ;i< this.a.length; i++) {
          sum += (Math.pow(parseInt(this.a[i]),2));/*Math.sqrt()*/
        }
        return sum;
      }
    },
    methods:{
      goBack(){
            this.$router.push({path:'/unitTest'})
      },
      goPage() {
        if(this.type==1){
          this.$router.push({path:'/home/classReport',query:this.paperDetail})
        }else if(this.type==3){
          this.$router.push({path:'/home/classReport',query:this.paperDetail})
        }else if(this.$route.query.type==4){
          this.$router.push({path:'/home/classReport',query:this.paperDetail})
        }else{
          this.paperDetail.type=2;
          this.$router.push({path:'/home/classReport',query:this.paperDetail})
        }
      },

      initData: function () {

        let classCode = JSON.parse(window.localStorage.getItem('reportData')).classCode

        let subjectCode = JSON.parse(window.localStorage.getItem('reportData')).subjectCode

        let teacherCode = JSON.parse(window.localStorage.getItem('reportData')).teacherCode

        let releaseExamCode = JSON.parse(window.localStorage.getItem('reportData')).releaseExamCode


        let path = "teacherReport/getSingleClassReport" + "/" + teacherCode + "/" + subjectCode + "/" + releaseExamCode + "/" + classCode

        var url = this.rootUrl + path + '?requestId=123';

        console.log('第一次');

        console.log(url);

        this.$http.get(url)
          .then(res => {

            console.log((res.body.result));;

            if (res.body.message == "Success") {

              this.result=res.body.result;
              this.notAttended=res.body.result.notAttendedStudentScoreModels.length;
              this.attended=res.body.result.studentScoreModels?res.body.result.studentScoreModels.length:0;

            }

          }, res => {

            console.log(res)

          });

      }
    }
  }
</script>

<style lang="scss" scoped>

  @import '../../../../../static/css/mixin';

  .header{
    .title{
      overflow:hidden;
      /*margin-top: 20px;*/
      /*margin-left:18px;*/
      box-sizing:border-box;
      padding:10px 40px;
      background:white;
      span{
        color:#000000;
        font-size:18px;
        float:left;
        display:inline-block;
        height:40px;
        line-height:40px;
      }
      button{
        float:right;
        width:143px;
        height:40px;
        border-radius:20px;
        font-size:18px;
        color:#fff;
        background:#1fd094;
        outline:none;
        cursor: pointer;
        border-width: 0;
      }
    }
  }

  .titlePc{
    font-size:20px;
    text-align: left;
    border-bottom:1px solid #e1e5ec;
    padding:10px 40px 10px 0px;
    margin-top:30px;
  }

  .report-section-main{
    padding:10px 40px;
    background:#ffffff;
    /*height:100px;*/
    /*margin-left:18px;*/
    .main-header{
      padding-top:30px;
      /*background:url('../../../static/image/class_bg.png')!*#daeeda*!;*/
      p{
        @include sc(.6rem,#6ca86c);
        padding-bottom:.4rem;
      }
      .head-title{
        display: flex;
        justify-content:space-between;
        line-height:30px;
        font-size:20px;
        height:30px;
        color:#6ca86c;
      }
      .head-title:nth-of-type(1){
        border-bottom:1px dashed #6ca86c;
      }
    }
    .main-content{
      background-color:$fc;
      margin-top:.6rem;
      .content-title{
        @include sc(.7rem,#4c4c4c);
        font-weight: normal;
        /*margin-bottom:.6rem;*/
        border-bottom:1px dashed #ccc;
        display: inline-block;
        position:relative;
        span{
          width:.2222rem;
          height:.2222rem;
          background:#ccc;
          display:block;
          @include borderRadius(50%);
          position: absolute;

        }
        span:nth-of-type(1){
          left:0rem;
        }
        span:nth-of-type(2){
          right:0rem;
        }
      }
      .content-number{
        margin-top:20px;
        margin-bottom:20px;
        text-align:left;
        /*text-indent:20px;*/
        /*display: flex;*/
        /*justify-content:space-between;*/
        p{
          @include sc(16px,#808080);
          line-height:26px;
        }
      }
      .content-table{
        @include sc(.6rem,#808080);
        line-height:1.4rem;
        table{
          margin: 10px auto 10px;
          min-width:600px;
          text-align:center;
          tr:nth-of-type(odd){
            background:#e1edf1;
          }
          tr:nth-of-type(even){
            background:#eff4f6;
          }
          th{
            @include sc(16px,#ffffff);
            background:#8bb6c4;
            font-weight:normal;
            line-height: 30px;
          }
          th:first-of-type{
            border-top-left-radius:.2rem;
          }
          th:last-of-type{
            border-top-right-radius:.2rem;
          }
          tbody{
            border-top:1px solid #fff;
            background-color:#f8f8f8;
          }
          td{
            line-height: 30px;
            @include sc(16px,#997878);
          }
        }
      }
    }
  }

</style>
