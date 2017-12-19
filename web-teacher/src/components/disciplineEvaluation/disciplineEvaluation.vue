<template>
  <div class="disciplineEvaluation">
    <!--同步辅导，选择学科下拉列表el-select-->
    <section class="header" v-if="true">
      <div class="title">
        <span>阶段考</span>
        <!--<button>发布测试</button>-->
      </div>
    </section>
    <!--试卷列表-->
    <section class="reportContent">
      <div v-if="data.testPaperList.length">
        <reportItemFofMaster v-for="(item,index) in data.testPaperList" :key="'testPaperList'"
        :tudos="item"
        :tudosIndex="index"
         @watchZi="dialogFn(index,item)"
        ></reportItemFofMaster>
      </div>
      <div v-else class="nodata">
        暂无数据
      </div>
    </section>
    <!--点击查看报告后，弹出的报告列表-->
    <section class="SmalltestPaperList">
      <el-dialog  title="选择报告" :visible.sync="flag.dialogVisible" size="large" class="llll" @close="dialogCloseFn">
        <div class="choose">
          <span>选择学科:</span>
          <template>
            <el-select v-model="flag.subjectSeleted" placeholder="请选择" class="select" @change="subjectSeleted">
              <el-option class="option"
                         v-for="(item,index) in data.subjectList"
                         :key="commonSubject[item]"
                         :label="commonSubject[item]"
                         :value="item">
              </el-option>
            </el-select>
          </template>
        </div>
        <div class="content" v-if="isEmptyObject(data.smalltestPaperList)!=true&&data.smalltestPaperList!=null">
          <div class="everyone" v-for="(item,index) in data.smalltestPaperList" @click="goReoortDetialPage(item)" v-if="(item.classCode!=null)||(item.classCode==null&&data.testPaperSeletedData.subjectCode == windowLocalStorage.getTeacherInfo.userSubject&&data.testPaperSeletedData.type!=2)">
            <p class="head">{{item.className!=null?item.className:"总报告"}}</p>
            <div v-if="item.hasReport" >
              <canvas-ground class="canvas" :circle="{totalScore: item.totalScore||100,width: 80,score: item.average||0}" :key="item.diagnosisClassRelationCode"></canvas-ground>
              <p class="foot">班级报告</p>
            </div>
            <div v-else>
              <p class="foot">班级报告</p>
              <img src="../../../static/img/noReport.png" height="60" width="60"/>
              <p class="foot">无报告</p>
            </div>
          </div>
        </div>
        <div class="nodata" v-else>暂无数据</div>
      </el-dialog>
    </section>
    <!--分页-->
    <template>
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page=data.pageNum
          :page-sizes="[100, 200, 500, 1000]"
          :page-size=data.pageSize
          layout="total, prev, pager, next, jumper"
          :total=data.testPaperData.total>
        </el-pagination>
      </div>
    </template>
  </div>
</template>
<script>
  import reportItemFofMaster from "./reportItemFofMaster.vue"
  import canvasGround from '../common/canvasGround.vue';
  export default {
    components: {
      reportItemFofMaster,canvasGround
    },
    data(){
      return {
        data: {
          localData:null,//从localstorage得到的数据
          subjectList: [],//学科列表
          pageNum:1,
          pageSize:100,
//          classCodes:[],//某个接口所需参数
          testPaperList:[],//试卷列表
          testPaperData:{total:0},
          smalltestPaperList:[],//由接口getDiagnosisDetail获得的报告列表
          testPaperSeletedData:'',//选中的试卷数据，用于组合数据传给报告详情页
        },
        flag: {
          subjectSeleted:0,//选中的学科
          testPaperSeleted:0,//选中的试卷序号//似乎没有用啊
          dialogVisible: false,
        },
        windowLocalStorage:{
          reportData:null,
          testDetail:null,
          getTeacherInfo:null,
          webUser:null,
        }

        /*下面都是临时数据*/
      }
    },
    mounted(){
      window.localStorage.page="disciplineEvaluation";
      this.data.localData=this.localData.get("webTeacherUser");

//      this.windowLocalStorage.reportData=this.localData.get("reportData");
//      this.windowLocalStorage.testDetail=this.localData.get("testDetail");
      this.windowLocalStorage.getTeacherInfo=this.localData.get("getTeacherInfo");
//      this.windowLocalStorage.webUser=this.localData.get("webTeacherUser");

      this.gettestPaperList();
    },
    methods: {
      fn(item){
        console.log(item)
      },
      dialogCloseFn(){
        this.flag.subjectSeleted='';
        this.data.smalltestPaperList=[];
      },
      gettestPaperList(){
        let classCodes=this.localData.get('webTeacherUser').classBeanList;
        let arr=[];
        classCodes.forEach((item,index)=>{
          arr.push(item.classId+"")
        })
        const set = new Set(arr);
        let classCodesArr=[...set];
        var sendData={
          "pageNum":this.data.pageNum,
          "pageSize":this.data.pageSize,
          "schoolCode":this.localData.get('webTeacherUser').userSchoolId,
          "gradeCode":this.localData.get('webTeacherUser').userGradeIden,
          "teacherCode":this.localData.get('webTeacherUser').userId,
          "subjectCode":this.localData.get('webTeacherUser').userSubject,
          "classCodes":classCodesArr,
        }
        this.$ajax.getDiagnosisListForMaster(sendData)
          .then(({httpCode, result}) => {
            if (httpCode == 200) {
              this.data.testPaperList = result.list;
              this.data.testPaperData=result;
            } else if(httpCode != "600002") {
              this.$message('获取班级列表失败,请刷新页面重试');
            }
          })
      },
      dialogFn(index,item){
          this.data.testPaperSeletedData=item;
          this.flag.testPaperSeleted=index;
          this.flag.dialogVisible=true;
          this.$ajax.getSubjectsForExam({ code:item.code})
            .then(({httpCode, result}) => {
              if (httpCode == 200) {
                this.data.subjectList = result;
                this.flag.subjectSeleted=result[0];
                let initialIndex=0;//应测试要求，初始显示老师的学科，没有老师的学科则显示第一个学科。
                for(index in result){
                  if(result[index]==this.localData.get("getTeacherInfo").userSubject){
                    initialIndex=index;
                  }
                }
                this.flag.subjectSeleted=result[initialIndex];
              } else if(httpCode!="600002"){
                this.$message('获取学科列表失败,请刷新页面重试');
              }
            })
      },
      getDiagnosisDetail(index,item){
        // console.log("发起请求")
        //来自syncCoach.vue【
        if (item.isSnapshot == 1) {
          item.type = 1;
          item.subjectCode = this.flag.subjectSeleted;//科目
          let groups = [];
          if (!item.groupId) {
            let classBeanList = this.data.localData.classBeanList;
            classBeanList.forEach(function (item) {
              groups.push(item.classId);
            })
          } else {
            groups.push(item.groupId);
          }
          let sendData={
            "code": item.code,
            "gradeCode": item.gradeCode,
            "classCodes": groups,
            "subjectCode": item.subjectCode || this.data.localData.userSubject,//this.routeSource.subjectCode,
            "pageSize": 100,
            "pageNum": 1,
            "teacherCode":this.localData.get('webTeacherUser').userId,
            "diagnosisType":1,
          }
          this.$ajax.getDiagnosisDetail(sendData)
            .then(({httpCode, result}) => {
              if (httpCode == 200) {
                this.data.smalltestPaperList = result;
//                this,data,smalltestPaperList.
              } else {
                this.$message('获取报告列表失败,请刷新页面重试');
              }
            })
          this.flag.dialogVisible=true;
        } else {
          this.$message('报告未生成');
          return
        }
      },
      subjectSeleted(index){
         // console.log("xialadognle")
//        this.flag.subjectSeleted=index;//可以省略，element自己做到了
        if(this.flag.dialogVisible==false){
            return;
        }
        this.getDiagnosisDetail(index,this.data.testPaperSeletedData);
      },
      goReoortDetialPage(item){
        this.data.testPaperSeletedData.classCode=item.classCode;
        this.data.testPaperSeletedData.className=item.className;
        window.localStorage.reportData=JSON.stringify(this.data.testPaperSeletedData);
        if(item.hasReport==false){
          return;
        }
        if(item.classCode==null){
          this.$router.push({path:'/showData/reportDetailsTotal/class1'});
        }else{
          this.$router.push({path:'/showData/reportDetailsSingleClass'});
        }
//        this.$router.push({path:'/showData/reportDetailsTotal/class1',query:item})

      },
      handleSizeChange(val) {
        //console.log(`每页 ${val} 条`);
        this.data.pageSize=val;
      },
      handleCurrentChange(val) {
        // console.log(`当前页: ${val}`);
        this.data.pageNum=val;
        this.gettestPaperList();
      },
    },
    computed: {

    },
    filters: {

    }

  }
</script>
<style lang="scss">
  @import '../../../static/css/contentRight';
  .disciplineEvaluation{
    .header{
      margin:20px;
      margin-bottom:0px;
      .title{
        overflow:hidden;
        margin-top: 20px;
        /*margin-left:18px;*/
        box-sizing:border-box;
        padding:10px 40px;
        background:white;
        border-bottom:1px solid #e1e5ec;
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
        }
      }
    }
    .reportContent{
      overflow:hidden;
  /*    .report{
        border:4px solid #ffffff;
        &:hover{
          border:4px solid #00d1b2;
        }
        &.active{
          border:4px solid #1fd094;
        }
      }*/
    }


    .SmalltestPaperList{
      .choose{
        margin-left:18px;
        box-sizing:border-box;
        padding:10px 40px;
        /*background:white;*/
        text-align: left;
        p{
          display:inline-block;
        }
        .select{
          input{
            background:#e4e8f1;
            /*background:#f0f4fb;*/
            border:0px;
          }
        }
      }
      .content{
        overflow:hidden;
        background:#ecf2f7;
        /*background: #ffffff;*/
        padding:40px;
        .everyone{
          width:130px;
          /*height:60px;*/
          background:#ffffff;
          float:left;
          margin-left: 40px;
          /*margin-top:20px;*/
          margin-bottom:40px;
          cursor: pointer;
          .head{
            color:#fff;
            background:#1fd094;
            height:30px;
            line-height:30px;
          }
          .canvas {
            height:80px;
            width:80px;
            margin-top:10px;
          }
          .foot{
            /*background:blue;*/
            height:30px;
            line-height:30px;
          }
        }
      }
      .el-dialog{//单独设定，不考虑与content的层级关系
        width:50%;height:50%;//相对于浏览器的比例，因为其遮罩是浏览器的100%
        background: #ffffff;
        .nodata{
          background:#ecf2f7;
        }
        .el-dialog__header{
          background:#d3f2e5;
          padding:0;
          height:60px;
          line-height:60px;
          position:relative;
          button{
            position:absolute;
            right: 24px;
            top: 22px;
            cursor: pointer;
          }
        }
        .el-dialog__body{
          padding:0px;
          height:90%;
          background:#ecf2f7;
          /*background: #ffffff;*/
          overflow:auto;

        }
        .el-dialog__footer{
          height:0px;
          text-align:center;
          padding-top:20px;
          button:nth-last-child(1){
            margin-left:50px;
          }
        }
      }
    }
    .nodata{
      height:100px;
      line-height:100px;
      font-size:20px;
      background:#fff;
      margin: 20px;
    }
    .el-pagination{
      margin-top:30px;
      *{
        display:inline-block;
        vertical-align: middle;
      }
      .el-pager li{
        font-size: 20px;
        min-width: 40px;
        height: 40px;
        line-height: 40px;
      }
      .el-pager li.active{
        background:#1fd094;
      }
      .btn-next, .btn-prev{
        height:40px;
      }
      .el-select .el-input{
        width:142px;
      }
      .el-select .el-input input{
        height:40px;
        font-size: 20px;
      }
      .el-select{
        vertical-align: top;
      }
      button,span{
        height:40px;
        line-height:40px;
        font-size:20px;
      }
      .el-pagination__editor{
        height:40px;
        min-width:40px;
        font-size:20px;
        vertical-align: top;
      }
    }
  }

</style>
