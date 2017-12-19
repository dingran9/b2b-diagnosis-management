<template>
  <div class="questionList">
    <!--同步辅导，选择学科下拉列表el-select-->
    <section class="header" v-if="true">
      <div class="title">
        <span>同步跟踪</span>
      </div>
      <div class="listType">
        <button v-bind:class="storageSelectClass('edu')" @click.prev.stop="changeStorage('edu')">选择范例</button>
        <button v-bind:class="storageSelectClass('personal')" @click.prev.stop="changeStorage('personal')">我的学生</button>
        <el-select v-model="exerciseClass" placeholder="请选择测试班级" @change="getStudents(exerciseClass)"
                   v-show="storageSelect == 'personal'">
          <el-option
            v-for="item in exerciseOption"
            :key="item.groupId"
            :label="item.groupName"
            :value="item.groupId">
          </el-option>
        </el-select>
      </div>
    </section>
    <!--我的学生-->
    <section class="eduQuestionContent" v-show="storageSelect == 'personal'">
      <div class="myStudents">

        <ul class="studentList">
          <li><span></span> 学生列表</li>
          <li v-bind:class="{ active: activeStudent == item.userAccount }" v-for="(item,index) in studentLists"
              @click="changeActiveLi(item.userAccount)">{{item.userName}}
          </li>
        </ul>
        <!--<img src="../../../static/img/questionListDefaultBG.png"/>-->
        <div class="iframe-warp">
          <question :question-item="question" v-if="question"></question>
          <iframe :src="iframeSrc" frameborder="0" scrolling="no" width="100%" height="2500px"></iframe>
        </div>
      </div>
    </section>
    <!--选择范例-->
    <section class="eduQuestionContent" v-show="storageSelect == 'edu'">
      <div class="selectConditions">
        <div class="conditionItem">
          <span style="font-size: 18px">教学版本筛选:</span>
          <el-input
            placeholder="教学版本"
            v-model="materialVersion.name"
            :disabled="true">
          </el-input>
        </div>
        <div class="conditionItem">
          <span style="font-size: 18px">学科:</span>
          <el-input
            placeholder="学科"
            v-model="userSubject.name"
            :disabled="true">
          </el-input>
        </div>
        <div class="conditionItem">
          <span style="font-size: 18px">年级:</span>
          <el-input
            placeholder="年级"
            v-model="userGradeIden.name"
            :disabled="true">
          </el-input>
        </div>
        <div class="conditionItem">
          <span style="font-size: 18px">试题类型:</span>
          <el-select v-model="difficultStarValue" placeholder="请选择" @change="difficultStarChange">
            <el-option
              v-for="item in difficultStars"
              :key="item.id"
              :label="item.enlargeType"
              :value="item.id">
            </el-option>
          </el-select>
        </div>
      </div>
      <section class="eduLeftContent">
        <div class="selectPoint">
          <span></span>选择知识点
        </div>
        <el-tree :data="questionTree" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
      </section>
      <section class="eduRightContent">
        <div class="eduQuestionList" v-loading="loading">
          <eduQuestionItem
            @select="selectQuestion"
            v-for="(item, index) in data.eduStorageList"
            :key="index"
            :questionItem="item"
            :type="'eduType'"
          ></eduQuestionItem>
        </div>
        <!--edu分页-->
        <template>
          <el-pagination
            @size-change="handleEduSizeChange"
            @current-change="handleEduCurrentChange"
            :current-page.sync=data.eduPageNum
            :page-size=data.eduPageSize
            layout="total, prev, pager, next, jumper"
            :total=data.eduPages
            v-show="data.eduStorageList.length"
          >
          </el-pagination>
        </template>
      </section>
    </section>
  </div>
</template>
<script>
  import eduQuestionItem from "./questionComponent/eduQuestionItem.vue"
  import Question from './oneQuestion.vue'

  export default {
    components: {
      eduQuestionItem, Question
    },
    data() {
      return {
        //选中开始做题的题目
        question: '',
        data: {
          localData: null,//从localstorage得到的数据
          eduPageNum: 1,//当前页数
          eduPageSize: 10,//每页显示数量
          eduStorageList: [],//易教仓库列表
          eduPages: 0,//易教仓库总页数
        },
        storageSelect: "edu", //选择范例标签
        exerciseClass: null, // 测试班级
        exerciseOption: [],
        studentLists: [],
        activeStudent: null,   // http://zhhb.coolpen.net/?code=15011299052
        iframeSrc: null,
        userSubject: {}, //学科
        userGradeIden: {}, //年级
        materialVersion: {}, //教材版本
        difficultStars: [
          {value: "简单", difficultStar: 1}, {value: "普通", difficultStar: 2}, {
            value: "困难",
            difficultStar: 3
          }, {value: "全部", difficultStar: 4}
        ], //难度等级
        difficultStarValue: 4,//难度等级
        knowledgeCode: "",
        dialogFormVisible: false,
        addToQuestionPopup: false,
        addToQuestionTemp: {},
        questionTree: [],
        defaultProps: {
          children: 'children', //试题树的默认值
          label: 'knowledgeName'
        },
        loading: false
      }
    },
    mounted() {
      window.localStorage.page = "questionList";
      this.data.localData = this.localData.get("webTeacherUser");
      //获取易教题库数据(先获取教材版本,然后获取树状列表)
      this.getMaterialVersion();
      this.getTeachercla();
      this.getQuestionType();
    },
    methods: {
      //选择答题
      selectQuestion(question) {
        this.$set(this, 'question', question);
        this.changeStorage('personal');
        //默认选中第一个学生
        if (this.studentLists.length && !this.activeStudent)
          this.changeActiveLi(this.studentLists[0].userAccount)
      },
      //获取试题分类
      getQuestionType() {
        console.log(this.data.localData);
        this.$ajax.getQuestionType(this.data.localData.userSubject)
          .then((res) => {
            if (res.httpCode == 200) {
              console.log(res.result);
              this.difficultStars = res.result
              this.difficultStarValue = res.result[0].id
            } else {
              this.$message('获取试题类型失败');
            }
          })
      },
      //获取老师班级
      getTeachercla() {
        let sendData = {
          "userId": this.data.localData.userId
        }
        this.$ajax.getTeacherClass(sendData)
          .then((res) => {
            if (res.httpCode == 200) {
              this.exerciseOption = res.result
              this.exerciseClass = res.result[0].groupId
              this.getStudents(res.result[0].groupId)
            } else {
              this.$message('获取试卷列表失败,请刷新页面重试');
            }
          })
      },
      /*获取学生*/
      getStudents(item) {
        let sendData = {
          groupId: item
        }
        this.$ajax.getStudentListByClassId(sendData)
          .then(({httpCode, result}) => {
            if (httpCode == 200 && result) {
              this.studentLists = result;
            } else if (httpCode != "600002") {
              this.$message('获取班级列表失败,请刷新页面重试');
            }
          })
      },
      // tab切换
      storageSelectClass(storageName) {
        if (this.storageSelect == storageName) {
          return "active";
        } else {
          return ""
        }
      },
      //获取易教题库数据(先获取教材版本,然后获取树状列表)
      getMaterialVersion() {
        //获得易教数据,需要先获得1.教材版本2.学科3.年级  111111
        //1.获得学科,年级,学校的id来获得教材版本(同时修改搜索条件)
        //1.1学科
        this.userSubject = {
          name: this.commonSubject[this.data.localData.userSubject],
          code: this.data.localData.userSubject
        };
        //1.2年级
        this.userGradeIden = {
          name: this.commonGrond[this.data.localData.userGradeIden],
          code: this.data.localData.userGradeIden
        };
        //1.3学校id
        let schoolID = this.data.localData.userSchoolId;
        //2.根据以上信息,获取教学版本
        let sendData = {
          schoolId: schoolID,
          gradeIden: this.userGradeIden.code,
          subjectIden: this.userSubject.code
        };
        let _this = this;
        this.$ajax.getmanagerMaterial(sendData).then(({httpCode, result}) => {
          if (httpCode == 200) {
            //处理数据,进行教材版本的显示以及存储
            let material = result.filter(function (item) {
              return item.subjectName == _this.userSubject.name;
            });
            //取到符合条件的第一个值
            _this.materialVersion = {name: material[0]["materialVersion"], code: material[0]["versionCode"]}
            _this.getEduTreeList();
          } else {
            this.$message('获取教材版本失败,请刷新页面重试');
          }
        })
      },
      getEduTreeList() {
        //根据年级gradeCode,学科subjectCode,教材版本booktypeCode,获得树状数据
        let sendData = {
          booktypeCode: this.materialVersion.code,
          gradeCode: this.userGradeIden.code,
          subjectCode: this.userSubject.code
        };
//				console.log(sendData,"知识点");
        let _this = this;
        this.$ajax.getKnowledge(sendData).then(({httpCode, result}) => {
//    			console.log(httpCode,"httpCode");
//    			console.log(result,"result");
          if (httpCode == 200) {
            //处理返回的数据
            _this.dealTreeData(result.datas);
          } else {
            this.$message('获取题库知识点失败,请刷新页面重试');
          }
        });
      },
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
        //存储树状结构
        localStorage.setItem("KnowledgePointTree", JSON.stringify(val));
        //将树状数据赋值给树状结构
        this.questionTree = val;
      },

      getEduQuestionStorageList() {
        let sendData = {
          "gradeCode": this.userGradeIden.code,
          "subjectCode": this.userSubject.code,
          "knowledgeCode": this.knowledgeCode == "" ? null : this.knowledgeCode,
          "pageNum": this.data.eduPageNum,
          "pageSize": this.data.eduPageSize,
          "booktypeCode": this.materialVersion.code,
          "type": this.difficultStarValue,
          "stem": this.searchText == "" ? null : this.searchText
        }
        this.loading = true
        this.$ajax.getResourceQuestions(sendData).then(({httpCode, result}) => {
          if (httpCode == 200) {
            if (result.hasOwnProperty('rows')) {
              this.loading = false
              this.data.eduStorageList = result.rows;
              this.data.eduPages = parseInt(result.total)
            } else {
              //置空易教题库列表
              this.loading = false
              this.data.eduStorageList = [];
              this.$message('当前知识点没有相关题目');
            }
          } else {
            this.$message('获取易教题库失败,请选择要考查的知识点或者刷新页面重试');
          }
        })
      },

      changeActiveLi(code) {
        this.activeStudent = code
        this.iframeSrc = 'http://zhhb.coolpen.net/?code=' + code
      },
      changeStorage(tagName) {
        if (tagName == "personal") {
          //判断当前页面
          if (this.storageSelect == "personal") {
            return;
          }
//    			console.log(1);
          //切换显示隐藏
          this.storageSelect = "personal";
//          this.getQuestionStorageList();
        } else if (tagName == "edu") {
          //判断当前页面
          if (this.storageSelect == "edu") {
            return;
          }
          //切换显示隐藏
          this.storageSelect = "edu";
          //判断是否进行立即搜索
          if (this.knowledgeCode) {
            this.getEduQuestionStorageList();
          }
        }
      },
      handleEduSizeChange(val) {
        this.data.eduPageSize = val;
        this.data.eduPageNum = 1;
        this.getEduQuestionStorageList();
      },
      handleEduCurrentChange(val) {
        this.data.eduPageNum = val;
        this.getEduQuestionStorageList();
      },
      handleNodeClick(data) {
        if (data.chk != "0") {
          this.knowledgeCode = data.ctbCode;
          this.getEduQuestionStorageList();
        }
      },
      difficultStarChange(data) {
        //判断是否进行立即搜索
        if (this.knowledgeCode) {
          this.getEduQuestionStorageList();
        }
      },
    },
    computed: {},
    filters: {}

  }
</script>
<style lang="scss">
  @import '../../../static/css/contentRight';

  .questionList {
    .header {
      margin: 20px;
      margin-bottom: 0px;
      min-width: 1450px;
      .title {
        overflow: hidden;
        margin-top: 20px;
        /*margin-left:18px;*/
        box-sizing: border-box;
        padding: 10px 40px;
        background: white;
        border-bottom: 1px solid #e1e5ec;
        span {
          color: #000000;
          font-size: 18px;
          float: left;
          display: inline-block;
          height: 40px;
          line-height: 40px;
        }
        button {
          float: right;
          width: 143px;
          height: 40px;
          border-radius: 20px;
          font-size: 18px;
          color: #fff;
          background: #1fd094;
          outline: none;
          cursor: pointer;
        }
      }
      .listType {
        background: white;
        /*height: 90px;*/
        min-width: 1450px;
        min-height: 90px;
        overflow: hidden;
        padding-left: 20px;
        button {
          margin-top: 25px;
          margin-left: 20px;
          float: left;
          width: 143px;
          height: 40px;
          border-radius: 20px;
          font-size: 18px;
          outline: none;
          cursor: pointer;
          background: transparent;
          &:hover {
            background: #d3f2e5;
          }
        }
        button.active {
          background: #1fd094;
          color: #fff;
        }
        .sortCondition {
          margin-right: 40px;
          margin-top: 35px;
          float: right;
          .sortConItem {
            padding-right: 5px;
          }
          .sortConItem img {
            display: none;
          }
          .sortConItem.active {
            color: #1fd094;
          }
          .sortConItem.active img {
            display: initial;

          }
        }
        .el-input {
          margin-top: 27px;
          margin-right: 40px;
          float: right;
          width: 300px;
          height: 40px;

        }
      }
    }
    .eduQuestionContent {
      min-width: 1120px;
      margin: 20px;
      margin-bottom: 0px;
      height: 100%;
      box-sizing: border-box;
      position: relative;

      .selectConditions {
        min-width: 100%;
        overflow: hidden;
        background: #FFFFFF;
        /*height: 70px;*/
        border-bottom: 1px solid #e1e5ec;
        .conditionItem {
          margin-left: 40px;
          margin-top: 15px;
          margin-bottom: 10px;
          float: left;
          color: #505050;
          .el-input {

            width: 180px;
            height: 40px;
            .el-input__inner:focus, .el-input__inner:hover {
              border-color: #1FD094;
            }
          }
        }
      }

      .eduLeftContent {
        position: absolute;
        width: 312px;
        height: 100%;
        background: #FFFFFF;
        left: 0;
        top: 66px;
        overflow-y: scroll;
        .selectPoint {
          font-size: 18px;
          color: #505050;
          text-align: left;
          height: 70px;
          line-height: 70px;
          border-bottom: 1px solid #e5e5e5;
          padding-left: 30px;
          box-sizing: border-box;
          span {
            margin: 0 10px;
            display: inline-block;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: #1fd094;
          }
        }
        .el-tree {
          text-align: left;
          border: none;
          padding-top: 20px;
          padding-left: 25px;
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
          .el-tree-node.is-current {
            & > .el-tree-node__content {
              background: #d3f2e5;
            }
          }
        }
      }
      .eduRightContent {
        background: #FFFFFF;
        position: absolute;
        width: calc(100% - 312px);
        min-width: 1120px;
        top: 66px;
        left: 312px;
        height: 100%;

        .eduQuestionList {
          background: #FFFFFF;
          text-align: left;
          padding: 0 40px;
          box-sizing: border-box;
          width: 100%;
          height: calc(100% - 100px);
          border-bottom: 1px solid #e1e5ec;
          overflow-x: hidden;
          overflow-y: scroll;
        }
      }

      .el-pagination {
        margin-top: 40px;
      }
    }

    .el-pagination {
      margin-top: 30px;
      margin-bottom: 30px;
      * {
        display: inline-block;
        vertical-align: middle;
      }
      .el-pager li {
        font-size: 20px;
        min-width: 40px;
        height: 40px;
        line-height: 40px;
      }
      .el-pager li.active {
        background: #1fd094;
      }
      .btn-next, .btn-prev {
        height: 40px;
      }
      .el-input {
        width: 142px;
      }
      .el-input input {
        height: 40px;
        font-size: 20px;
      }
      .el-select {
        vertical-align: top;
      }
      button, span {
        height: 40px;
        line-height: 40px;
        font-size: 20px;
      }
      .el-pagination__editor {
        height: 40px;
        min-width: 40px;
        font-size: 20px;
        vertical-align: top;
      }
    }
  }

  .el-select-dropdown {
    .el-select-dropdown__item.hover {
      background-color: #d3f2e5;
    }
    .el-select-dropdown__item.selected {
      background-color: #1fd094;
    }
  }

  .myStudents {
    background: #fff;
    padding-top: 20px;
    padding-left: 25px;
    .studentList {
      width: 200px;
      height: 600px;
      float: left;
      li {
        height: 50px;
        line-height: 50px;
        text-align: center;
        cursor: pointer;
        border-bottom: 1px solid #f3f3f3;
        border-right: 1px solid #f3f3f3;
        border-left: 1px solid #f3f3f3;
      }
      li:first-child {
        border-top: 1px solid #f3f3f3;
        span {
          display: inline-block;
          height: 10px;
          width: 10px;
          /*margin: 0 10px;*/
          border-radius: 5px;
          background: #1fd094;
        }
      }
      li:hover:not(:first-child) {
        background: #1fd094;
      }
      .active {
        color: #fff;
        background: #1fd094;
      }
    }
    .iframe-warp {
      padding-left: 220px;
      padding-right: 20px;
    }
  }
</style>
