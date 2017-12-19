<template>
  <div class="perfectTestInformation">
    <div class="app-title">
      <div class="head">
        学业质量提升平台
      </div>
    </div>
    <div class="container">
      <div class="item_">
        <span class="title_">试卷名称 : </span>
        <el-input class="paperName" v-model="sendData.paperName" placeholder="请输入试卷名称"></el-input>
      </div>
      <div class="item_">
        <span class="title_">试卷难度 : </span>
        <el-rate v-model="sendData.difficultStar" show-text :max="3" :texts="['易','中','难']"></el-rate>
      </div>
      <div class="item_">
        <p class="item_left">
          <span class="title_">当前总分 : </span>
          <span class="right_">{{sendData.totalScore}}分</span>
        </p>
        <p class="item_right">
          <span class="title_ titleRight">达标分 : </span>
          <inputL v-model="sendData.standardScore" class="totalTime" :max="sendData.totalScore"></inputL>
        </p>
      </div>
      <div class="item_">
        <p class="item_left">
          <span class="title_">试卷时间 : </span>
          <inputL v-model="sendData.totalTime" class="standardScore"></inputL>
          <span>分钟</span>
        </p>
        <p class="item_right">
          <span class="title_">试卷类型 : </span>
          <el-select v-model="paperType.choosed" placeholder="请选择">
            <el-option
              v-for="(item,index) in paperType.list"
              :key="item.code"
              :label="item.name"
              :value="index">
            </el-option>
          </el-select>
        </p>
      </div>
      <div class="item_">
        <p class="item_left">
          <span class="title_">选择上下册 : </span>
          <el-radio-group v-model="shangxiace.VolumeChoosed" @change="VolumeChoosedFn">
            <el-radio class="radio semester"
                      :label="index"
                      v-for="(item,index) in shangxiace.VolumeList">{{item.name}}
            </el-radio>
          </el-radio-group>
        </p>
        <p class="item_right">
          <span class="title_">对应单元 : </span>
          <el-select v-model="shangxiace.uintChoosed" placeholder="请选择">
            <el-option
              v-for="(item,index) in shangxiace.uintList"
              :key="item.id"
              :label="item.name"
              :value="index">
            </el-option>
          </el-select>
        </p>
      </div>
      <div class="item_ item_tree">
        <span class="title_">考点选择 : </span>{{treeData.choosedList}}
        <div class="questionKnowWrap">
          <div class="questionKnowPoint">
            <div class="pointWrap">
              <el-tag
                v-for="(item,index) in treeData.choosedList"
                :key="item.id"
                closable
                :type="''"
                @close="handleClose(index)"
              >
                {{item.knowledgeName}}
              </el-tag>
            </div>
            <div class="treeWrap">
              <el-tree :data="treeData.list" :props="treeData.defaultProps" @node-click="handleNodeClick"></el-tree>
            </div>
          </div>
        </div>
      </div>
      <div class="buttons">
        <el-button class="cancel" @click="prevFn">返回修改</el-button>
        <el-button class="confirm" @click="nextFn">保存试卷</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import inputL from './input.vue'

  export default {
    data() {
      return {
        /*用户信息*/
        uesrInfor: this.localData.get("webTeacherUser"),
        /*试卷信息*///来自上个页面
        paperInfor: this.localData.get("questionAdded"),//
        /*获取上下册*/
        shangxiace: {
          materialVersion: "",
          versionCode: "",
          VolumeList: [],
          VolumeChoosed: 0,
          uintList: [],
          uintChoosed: 0,
        },
        /*树*/
        treeData: {
          list: [],
          defaultProps: {//暂时没有用
            children: 'children', //试题树的默认值
            label: 'knowledgeName'
          },
          choosedList: [],
        },
        paperType: {
          list: [
            {code: "p_015", name: "单元测试卷"},
            {code: "p_016", name: "期中测试卷"},
            {code: "p_017", name: "期末测试卷"},
          ],
          choosed: 0,
        },
        /*保存试卷需要参数*/
        sendData: {
          paperName: "",//试卷名称//ok
          stageCode: this.stageCode(this.localData.get("webTeacherUser").userGradeIden),//学段CODE
          gradeCode: this.localData.get("webTeacherUser").userGradeIden,//学年CODE
          subjectCode: this.localData.get("webTeacherUser").userSubject,//学科CODE
          schoolCode: this.localData.get("webTeacherUser").userSchoolId,//学校CODE
          schoolName: this.localData.get("webTeacherUser").schoolName,//学校名称
          operatorCode: this.localData.get("webTeacherUser").userId,//创建人CODE
          operatorName: this.localData.get("webTeacherUser").userName,//创建人Name
          totalScore: 0,//试卷总分//ok
          totalTime: 0,//试卷时长//ok
          difficultStar: 0,//试题难度（1：简；2：中；3：难）//ok
          platform: "",//自组卷来源
          areaDistrictId: this.localData.get("webTeacherUser").groupAreaDistrictId,//区县CODE
          areaDistrictName: this.localData.get("webTeacherUser").groupAreaDistrictName,//区县NAME
          standardScore: "0",//达标分
          bookVersionCode: "",//教材版本Code
          bookVersion: "",//教材版本NAME
          semester: 0,//上下册
          paperType: "",//试卷类型：p_015：单元测试卷，p_016：期中测试卷，p_017：期末测试卷
          unitCode: "",//单元CODE
          unitName: "",//单元名称
//          itemContent: "",//大题的名称
//          itemType: "",//大题的分类
//          logicType: "",//的精细分类
//          score: "",//大题的分值
//          sort: "",//大题的排序
//          repositoryQuestionCode: "",//小题资源库CODE
//          questionAnswer: "",//小题的答案
//          quesionOption: "",//小题的选项（JSON）
//          questionScore: "",//小题分数
//          voiceAnalyze: "",//语音解析
//          questionType: "",//试题类型
//          type: "",//客观/主观题
//          questionCode: "",//小题所属复合题小题序号
//          questionStem: "",//题干
//          questionAnalyze: "",//试题解析
//          questionKnowledge: "",//小题知识点
//          questionProduction: "",//知识点产生式
//          knowledgeCode: "",//知识点CODE
//          knowledgeName: "",//知识点
        },
        nandu:["简单难度","中等难度","困难难度"]
      }
    },
    components: {inputL},
    created() {

    },
    mounted() {
      /*data更新*/
      {
        let totalScore = 0;
        this.paperInfor.map((item, index) => {
          totalScore += item.score;
        })
        this.sendData.totalScore = totalScore;
      }
      this.getmaterialVersionFromDB();
      /*编辑功能的数据处理*/
      if(window.localStorage.updatePaperData&&window.localStorage.updatePaperData!=""){
        let updatePaperData=this.localData.get("updatePaperData");
        this.sendData.paperName=updatePaperData.paperName;
        this.sendData.difficultStar=updatePaperData.difficultStar;
//        this.sendData.totalScore=updatePaperData.totalScore;//不能加
        this.sendData.standardScore=updatePaperData.istopic;
        this.sendData.totalTime=updatePaperData.totalTime;
        this.paperType.list.map((item,index)=>{
          if(item.code==updatePaperData.type){
            this.paperType.choosed=index;
          }
        })
        //知识点
        {
          let diagnosisNodeList=JSON.parse(updatePaperData.diagnosisNodeList);
          let treeData=[];
          diagnosisNodeList.forEach((item,index)=>{
            treeData.push({
              booktypeCode:item.bookVersionCode,
              ctbCode:item.knowledgeCode,
              knowledgeName:item.knowledgeName,
              bookVersionName:item.bookVersionName,
            })
          })
          this.treeData.choosedList=treeData;
        }
      }
    },
    methods: {
      getmaterialVersionFromDB() {
        let senData = {
          "gradeId": this.uesrInfor.userGradeIden,
          "subjectId": this.uesrInfor.userSubject,
          "schoolId": this.uesrInfor.userSchoolId,
        }
        this.$ajax.getmaterialVersion(senData)
          .then((res) => {
            this.shangxiace.materialVersion = res.result.materialVersion;
            this.shangxiace.versionCode = res.result.versionCode;
            this.getVolumeFromDB();
            this.getKnowledgeFromDB()
          }, (res) => {
            console.log(res);
          });
      },
      getVolumeFromDB() {
        let sendData = {
          "gradeCode": this.uesrInfor.userGradeIden,
          "subjectCode": this.uesrInfor.userSubject,
          "booktypeCode": this.shangxiace.versionCode,
          "productsIds": "581c1b44f70541fc88f8658041477c6c",
          "code": "0"//固定为0
        }
        this.$ajax.getVolume(sendData)
          .then(({httpCode, result}) => {
            if (httpCode == 200) {
              this.shangxiace.VolumeList = result;
              this.getUnit();
            } else if (httpCode != "600002") {
              this.$message('获取学科列表失败,请刷新页面重试');
            }
          })
      },
      getUnit() {
        let sendData = {
          "gradeCode": this.uesrInfor.userGradeIden,
          "subjectCode": this.uesrInfor.userSubject,
          "booktypeCode": this.shangxiace.versionCode,
          "productsIds": "581c1b44f70541fc88f8658041477c6c",
          "code": this.shangxiace.VolumeList[this.shangxiace.VolumeChoosed].code,
        }
        this.$ajax.getbookTypeVersionAndUnit(sendData)
          .then(({httpCode, result}) => {
            if (httpCode == 200) {
              this.shangxiace.uintList = result;
            } else {
              this.$message('获取试卷列表失败,请刷新页面重试');
            }
          })
      },
      VolumeChoosedFn() {
        this.getUnit();
      },
      /*资源树*/
      getKnowledgeFromDB() {
        let sendata = {
          booktypeCode: this.shangxiace.versionCode,
          "gradeCode": this.uesrInfor.userGradeIden,
          "subjectCode": this.uesrInfor.userSubject,
        }
        this.$ajax.getKnowledge(sendata)
          .then(({httpCode, result}) => {
            if (httpCode == 200) {
              result.datas = this.dealTreeData(result.datas);
              this.treeData.list = result.datas;
            } else if (httpCode != "600002") {
              this.$message('获取学科列表失败,请刷新页面重试');
            }
          })
      },
      //dealTreeData来自ys
      dealTreeData(data) {
        //数据中不是知识点的就是目录
        let map = {};
        data.forEach(function (item) {
          map[item.ctbCode] = item;
        })
        //形成树状结构
        let val = [];
        data.forEach(function (item) {
          // 以当前遍历项的parentCode,去map对象中找到索引的ctbCode
          var parent = map[item.parentCode];
          if (parent) {
            (parent.children || (parent.children = [])).push(item);
          } else {
            val.push(item);
          }
        });
        return val;
      },//questionList.vue
      handleNodeClick(data) {
        if (data.chk != "0") {
          let arr = this.treeData.choosedList.filter((item)=>item.ctbCode==data.ctbCode);
          if (!arr.length) this.treeData.choosedList.push(data);
        }
      },
      handleClose(index) {
        this.treeData.choosedList.splice(index, 1);
      },
      prevFn() {
        window.history.go(-1);
      },
      nextFn() {
        if (this.sendData.paperName == "") {
          this.$message("请填写试卷名称");
          return;
        }
        if (this.sendData.difficultStar == "") {
          this.$message("请选择试卷难度");
          return;
        }
        if (this.sendData.totalTime == "") {
          this.$message("请设置试卷时间");
          return;
        }
        if (this.sendData.totalScore < this.sendData.standardScore) {
          this.$message("达标分不能大于总分");
          return;
        }
        if (this.sendData.standardScore == "") {
          this.$message("请设置试达标分");
          return;
        }
        if (this.treeData.choosedList.length == 0) {
          this.$message("请选择考点");
          return;
        }
        /*复合题小小题转为小题*/
        this.paperInfor.forEach((item,index) => {
          item.sort=index+1;
          item.logicType=item.diagnosisSmallQuestionDtosList[0].logicType;//后台要求,logicType放到外面.
          item.newDiagnosisSmallQuestionDtosList=[];//新的diagnosisSmallQuestionDtosList,用于存储,小小题化为与小题同一级别后的新形式.
          item.diagnosisSmallQuestionDtosList.forEach((item2,index2) => {
            item2.sort=index2+1;
            item.newDiagnosisSmallQuestionDtosList.push(Object.assign({},item2,{subtitle:"",levelLong:2}));//levelLong为2,说明是小题,3为小小题
            item2.subtitle.length&&item2.subtitle.forEach((item3,index3)=>{//非复合题length为0,是个空串,这里只为复合题服务
              let child={
                repositoryQuestionCode:item3.id,
                questionAnswer:item3.answer,
                quesionOption:item3.quesOption,///////////////////
//                questionScore:item3.id,
                difficultStar:0,
                questionType:item3.type,
                type:item2.type,
                stageCode: this.stageCode(this.localData.get("webTeacherUser").userGradeIden),//学段CODE
                gradeCode: this.localData.get("webTeacherUser").userGradeIden,//学年CODE
                subjectCode: this.localData.get("webTeacherUser").userSubject,//学科CODE
                bookVersion:item2.bookVersion,
                bookVersionCode:item2.bookVersionCode,
                questionCode:item3.quesId,
                questionStem:item3.stem,
                questionAnalyze:item3.quesAnalyze,
                questionKnowledge:item3.tree,
                questionProduction:item3.basetree,
                logicType:item2.logicType,
                subtitle:"",
                levelLong:3,//levelLong为2,说明是小题,3为小小题
                sort:index3+1,
                questionScore:item3.score,
              }
              //如果是更新状态,后台要求如下操作
              if(this.$route.query.code!=undefined){
//                console.log("更新")
                child.id=child.repositoryQuestionCode;
                child.questionCode=item2.repositoryQuestionCode;
                delete child.repositoryQuestionCode;
              }else{
//                console.log("新建")
              }
              item.newDiagnosisSmallQuestionDtosList.push(child);
            })
            item2.subtitle="";
          })
          item.diagnosisSmallQuestionDtosList=item.newDiagnosisSmallQuestionDtosList;
          delete item.newDiagnosisSmallQuestionDtosList;
        })
//        console.log(JSON.stringify(this.paperInfor));      return;
        /*序号处理之小题累加方案*/
        if(false){//暂时不用此方案,手机端接受不了,代码留存,防止变卦,如果用此方案,只需要变false为true即可,其他地方不用改
          let sortIndexSmall=1;
          let sortIndexBig=1;
          this.paperInfor.forEach((item,index)=>{
            item.sort=index;
            item.diagnosisSmallQuestionDtosList.forEach((item2,index2)=>{
              if(item.itemType!=6){
                item2.sort=sortIndexSmall;
                sortIndexSmall++;
                sortIndexBig++;
              }else{
                if(item2.questionCode!=null){
                  item2.sort=sortIndexSmall;
                  sortIndexSmall++;
                }else{
                  item2.sort=sortIndexBig;
                  sortIndexBig++;
                }
              }
            })
          })
        }
        /*知识点处理*/
        let questionKnowledge = [];
        this.treeData.choosedList.forEach((item, index) => {
          questionKnowledge.push({
            "knowledgeCode": item.ctbCode,
            "knowledgeName": item.knowledgeName,
            "bookVersionCode": item.booktypeCode,
            "bookVersionName": ""
          })
        })
        /*数据sendData聚合*/
        let sendData = Object.assign(this.sendData, {
          semester: this.shangxiace.VolumeList[this.shangxiace.VolumeChoosed].name,
          semesterCode: this.shangxiace.VolumeList[this.shangxiace.VolumeChoosed].code,
          platform: 1,//自组卷来源,此处默认1,
          bookVersionCode: this.shangxiace.versionCode,//教材版本Code
          bookVersion: this.shangxiace.materialVersion,//教材版本NAME
          paperType: this.paperType.list[this.paperType.choosed].code,
          unitCode: this.shangxiace.uintList[this.shangxiace.uintChoosed].code,//单元CODE
          unitName: this.shangxiace.uintList[this.shangxiace.uintChoosed].name,//单元名称
          bigQuestionList: this.paperInfor,
          diagnosisNodeList: questionKnowledge,//知识点
        });
//        console.log(JSON.stringify(sendData));return;

        if (this.$route.query.code != undefined) {//更新
          this.$ajax.updateMyPaper(this.$route.query.code, sendData)
            .then(({httpCode, result}) => {
              if (httpCode == 200) {
                this.$router.push({path: "/savePaperSuccess", query: {caozuo: "更新",code:this.$route.query.code}});
                window.localStorage.removeItem("questionAdded");
              } else if (httpCode != "600002") {
                this.$message('通讯错误');
              }
            })
        } else {//新增
          this.$ajax.saveMyPaper(sendData)
            .then(({httpCode, result}) => {
              if (httpCode == 200) {
//                debugger
                this.$router.push({path: "/savePaperSuccess", query: {caozuo: "新增",code:result}});
                window.localStorage.removeItem("questionAdded");
              } else if (httpCode != "600002") {
                this.$message('通讯错误');
              }
            })
        }

      },


    },
    computed: {},
    filters: {}
    /*
     bigQuestionList应该含有
     itemContent: "",//大题的名称
     itemType: "",//大题的分类
     logicType: "",//的精细分类********************等待杨森,沟通过,他会给我
     score: "",//大题的分值
     sort: "",//大题的排序
     repositoryQuestionCode: "",//小题资源库CODE
     questionAnswer: "",//小题的答案********************等待杨森,沟通过,没有值就是没有值.
     quesionOption: "",//小题的选项（JSON）
     questionScore: "",//小题分数
     voiceAnalyze: "",//语音解析
     questionType: "",//试题类型
     type: "",//客观/主观题********************等待杨森,换null为实际的,沟通过,现在不会有null,0是客观,1是主观
     questionCode: "",//小题所属复合题小题序号********************等待杨森,这是复合题的小题题号,小题的题号我也用了sort.沟通过,是subtitle中的id或者questionid.
     questionStem: "",//题干
     questionAnalyze: "",//试题解析
     questionKnowledge: "",//小题知识点
     questionProduction: "",//知识点产生式
     diagnosisNodeList应该含有
     knowledgeCode: "",//知识点CODE
     knowledgeName: "",//知识点
     * */
  }
</script>


<style lang="scss">
  .perfectTestInformation {
    background: #f0f4fb;
    padding-bottom: 40px;
    .app-title {
      z-index: 101;
      top: 0;
      left: 0;
      $h: 70px;
      height: $h;
      width: 100%;
      min-width: 640px;
      line-height: $h;
      background: #4c6175;
      color: #fff;
      margin-bottom: 40px;
      .head {
        width: 240px;
        float: left;
        font-size: 24px;
        border-right: 1px solid #324353;
        line-height: 40px;
        margin: ($h - 40 )/2 0;
        padding-left: 30px;
      }
    }
    .container {
      width: 1200px;
      margin: 0 auto;
      padding-top: 92px;
      padding-left: 195px;
      padding-bottom: 40px;
      background: #fff;
      text-align: left;

      .item_ {
        font-size: 0;
        margin-bottom: 23px;
        height: 50px;
        line-height: 50px;
        /*background: #000;*/
        * {
          font-size: 16px;
          display: inline-block;
          vertical-align: middle;
        }
        .item_left {
          width: 460px;
        }
        .title_ {
          font-size: 18px;
          margin-right: 28px;
        }
        span.right_ {
          width: 174px;
        }
        .paperName {
          width: 690px;
          height: 50px;
          background-color: #ffffff;
          border-radius: 4px;
          input {
            height: 100%;
          }
        }
        .semester {
          margin-right: 72px;
        }
        .totalTime, .standardScore {
          width: 100px;
          height: 40px;
          background-color: #f0f4fb;
          border-radius: 4px;
          border: solid 1px #bfcbd9;
          margin-right: 10px;
        }
        .el-radio-group {
          min-width: 100px;
        }
        .questionKnowWrap {
          vertical-align: top;
          width: 690px;
          position: relative;
          text-align: left;
          .questionKnowPoint {
            width: 100%;
            .pointWrap {
              /*background: #000;*/
              /*width: 100px;*/
              margin-bottom: 20px;
              min-height: 35px;
              display: block;
              /*background: transparent;*/
              .el-tag {
                display: inline-block;
                background: transparent;
                color: #000000;
                border: 1px solid #1fd094;
                margin-right: 10px;
                margin-bottom: 10px;
              }
            }
            .treeWrap {
              width: 100%;
              height: 300px;
              border: 1px solid #d1dbe5;
              overflow-y: scroll;
              display: block;
              .el-tree {
                border: none;
                display: block;
                text-align: left;
                border: none;
                padding-top: 20px;
                padding-left: 25px;
                .el-tree-node, .el-tree-node__content, .el-tree-node__children {
                  display: block;
                }
                .el-tree-node__expand-icon {
                  border: none;
                  display: inline-block;
                  background: url(../../../static/img/folder.png) no-repeat;
                  width: 20px;
                  height: 20px;
                }
                .el-tree-node__expand-icon.expanded {
                  transform: rotate(0);
                }
                .el-tree-node__expand-icon.is-leaf {
                  width: 10px;
                  height: 10px;
                  border-radius: 50%;
                  background: #1FD094;
                }

              }
            }
          }

        }
      }
      .item_.item_tree {
        height: auto;
      }
      .buttons {
        width: 100%;
        text-align: center;
        .el-button {
          color: #fff;
          border: 0;
          width: 141px;
          height: 40px;
          border-radius: 20px;
          font-size: 18px;
          &:hover {
            border: 0;
          }
        }
        .cancel {
          background: #afb1b3;
        }
        .confirm {
          background: #1fcc95;
        }
      }
    }

  }

  .pointTitle {
    position: absolute;
    left: 0;
    top: 0;
  }
</style>
