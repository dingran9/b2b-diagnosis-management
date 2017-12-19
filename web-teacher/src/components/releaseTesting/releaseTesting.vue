<template>
  <div>
    <section class="header" v-if="true">
      <span>单元测>发布测试</span>
      <button @click="goBack">返回上一级</button>
    </section>

    <!--学科列表-->
    <section class="subjectContent">
      <div class="subjectTitle">
        <!--这里报错-->
        <span>当前版本:</span><span>{{data.subjectList[flag.subjectSeleted].name}}</span>
      </div>
      <div class="subject"
           v-for="(item,index) in this.data.subjectList"
           @click="subjectSeleted(index)"
           :class="{active:flag.subjectSeleted==index}"
      >
        <p>{{commonSubject[item.subjectCode]}}</p>
        <p>{{item.name}}</p>
      </div>
    </section>
    <!--单元列表-->
    <section class="unitContent">
      <div class="unitTitle">
        <span>单元名称</span>
      </div>
      <div v-if="data.unitList.length!=0">
        <div class="unit"
             v-for="(item,index) in data.unitList"
             @click="unitSeleted(index)"
             :class="{active:flag.unitSeleted==index}"
             :title="item.name"
        >
          {{item.name}}
        </div>
      </div>
      <div v-else class="nodata">暂无数据</div>
    </section>


    <!--试卷列表-->
    <section class="testPaperContent">
      <div class="testPaperTitle">
        <span>试卷名称</span>
      </div>
      <div v-if="data.testPaperList.length!=0">
        <div class="testPaper"
             v-for="(item,index) in data.testPaperList"
             @click="testPaperSeleted(item,index)"
             :class="{active:flag.testPaperSeleted==index}"
             :title="item.diagnosisPaperName"
        >
          {{item.diagnosisPaperName}}
        </div>
      </div>
      <div v-else class="nodata">暂无数据</div>
    </section>

  </div>
</template>
<script>
  export default {
    props: [],
    components: {},
    data() {
      return {
        data: {
          localData: null,//从localstorage得到的数据
          subjectList: [
            {name: ''}//有空对比一下，为啥这里就需要加上，其他文件不需要加上
          ],//学科列表
          pageNum: 1,
          pageSize: 100,
          classCodes: [],//某个接口所需参数
          unitList: [],//章节列表。
          testPaperList: [],//试卷列表。
        },
        flag: {
          subjectSeleted: 0,//选中的学科
          unitSeleted: 0,//选中的章节
          testPaperSeleted: 0,//选中的试卷
        },
        materialVersion: "",
        versionCode: "",
      }
    },
    mounted() {
      this.data.localData = this.localData.get("webTeacherUser");
      //[
      let senData = {
        "gradeId": this.data.localData.userGradeIden,
        "subjectId": this.data.localData.userSubject,
        "schoolId": this.data.localData.userSchoolId,
      }
      this.$ajax.getmaterialVersion(senData)
        .then((res) => {
          this.materialVersion = res.result.materialVersion;
          this.versionCode = res.result.versionCode;
          this.getSubject();
        }, (res) => {
          console.log(res);
        });
      //]


    },
    methods: {
      goBack() {
        this.$router.push({path: "/" + window.localStorage.page + "/" + window.localStorage.page})
      },
      getSubject() {
        //【
        let sendData = {
          "gradeCode": this.data.localData.userGradeIden,
          "subjectCode": this.data.localData.userSubject,
          "booktypeCode": this.versionCode,
          "productsIds": "581c1b44f70541fc88f8658041477c6c",
          "code": "0"//固定为0
        }
        //】
        this.$ajax.getVolume(sendData)
          .then(({httpCode, result}) => {
            if (httpCode == 200) {
              this.data.subjectList = result;
              this.getUnit(this.data.subjectList[this.flag.subjectSeleted]);
            } else if (httpCode != "600002") {
              this.$message('获取学科列表失败,请刷新页面重试');
            }
          })
      },
      subjectSeleted(index) {
        this.flag.subjectSeleted = index;
        this.getUnit(this.data.subjectList[this.flag.subjectSeleted]);
      },
      getUnit(item) {
        let sendData = {
          "gradeCode": this.data.localData.userGradeIden,
          "subjectCode": this.data.localData.userSubject,
          "booktypeCode": this.versionCode,
          "productsIds": "581c1b44f70541fc88f8658041477c6c",
          "code": this.data.subjectList[this.flag.subjectSeleted].code
        }
        this.$ajax.getbookTypeVersionAndUnit(sendData)
          .then(({httpCode, result}) => {
            if (httpCode == 200) {
              this.data.unitList = result;
              this.getTestPaper(this.data.unitList[this.flag.unitSeleted]);
              this.unitSeleted(0);
            } else {
              this.$message('获取试卷列表失败,请刷新页面重试');
            }
          })
      },
      unitSeleted(index) {
        this.flag.unitSeleted = index;
        localStorage.setItem('PaperCode', JSON.stringify(this.data.unitList[this.flag.unitSeleted]))
        this.getTestPaper(this.data.unitList[this.flag.unitSeleted]);
      },
      getTestPaper(item) {
        let sendData = {
          "pageNum": this.data.pageNum,
          "pageSize": this.data.pageSize,
          "unitCode": this.data.unitList[this.flag.unitSeleted].code,
          resourceType: this.$route.query.resourceType
        }
        this.$ajax.getDiagnosisPaperByPaper(sendData)
          .then(({httpCode, result}) => {
            if (httpCode == 200) {
              this.data.testPaperList = result.list;
              window.localStorage.testDetail = JSON.stringify(this.data.testPaperList[this.flag.testPaperSeleted]);
            } else {
              this.$message('获取试卷列表失败,请刷新页面重试');
            }
          })
      },
      testPaperSeleted(item, index) {
        this.flag.testPaperSeleted = index;
        window.localStorage.testDetail = JSON.stringify(this.data.testPaperList[this.flag.testPaperSeleted]);
        this.$router.push({path: '/main/testDetail',query:this.$route.query})
      }
    },
    computed: {},
    filters: {}

  }
</script>
<style lang="scss">
  @import '../../../static/css/contentRight';

  .header {
    overflow: hidden;
    margin-top: 20px;
    margin-left: 18px;
    box-sizing: border-box;
    padding: 10px 40px;
    background: white;
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
    }
  }

  .subjectContent {
    @extend .header;
    .subjectTitle {
      width: 100%;
      height: 60px;
      line-height: 60px;
      box-sizing: border-box;
      border-bottom: 1px solid #cccccc;
      span:nth-of-type(1) {
        font-weight: 700;
      }
    }
    .subject {
      float: left;
      width: 160px;
      height: 215px;
      background-image: url(../../../static/img/book.png);
      background-size: 100% 100%;
      background-repeat: no-repeat;
      margin-left: 10px;
      margin-top: 36px;
      font-size: 30px;
      box-sizing: border-box;
      border: 4px solid white;
      cursor: pointer;
      color: #ffffff;
      border-radius: 13px;
      p:nth-of-type(1) {
        font-size: 34px;
        margin-top: 47px;
        margin-bottom: 18px;
      }
      p:nth-of-type(2) {

      }
      &:hover {
        border: 4px solid #d3f2e5;
      }
      &.active {
        border: 4px solid #1fd094;
      }
    }
  }

  .unitContent, .testPaperContent {
    @extend .header;
    .unitTitle, .testPaperTitle {
      @extend .subjectTitle; /*继承失败，原因不明*/
      width: 100%;
      height: 60px;
      line-height: 60px;
      box-sizing: border-box;
      border-bottom: 1px solid #cccccc;
      span:nth-of-type(1) {
        font-weight: 700;
      }
    }
    .unit, .testPaper {
      width: 440px;
      /*height:56px;*/
      box-sizing: border-box;
      border: 4px solid white;
      float: left;
      background: white;
      margin-top: 25px;
      margin-left: 80px;
      font-size: 18px;
      line-height: 56px;
      cursor: pointer;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      border-radius: 10px;
      &:hover {
        border: 4px solid #d3f2e5;
      }
      &.active {
        border: 4px solid #1fd094;
      }
    }
    .nodata {
      height: 100px;
      line-height: 100px;
      font-size: 20px;
    }
  }
</style>
