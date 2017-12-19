<template>
  <div>
    <div class="crumbs" style="position: relative">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-menu"></i> 试卷管理</el-breadcrumb-item>
        <!--<el-breadcrumb-item>学校列表</el-breadcrumb-item>-->
      </el-breadcrumb>
      <router-link :to="{path:'/addPaper'}">
        <el-button type="primary" style="position: absolute;right:0;top: -10px;">添加试卷</el-button>
      </router-link>
    </div>
    <hr>
    <div class="comflter">
      <p class="comflter-p">
        <span class="comflter-p-span">年级:</span>
        <el-radio-group v-model="grondRadio" @change="getSubject()">
          <el-radio  v-for="(item,index) in groundCode" :key = 'item.code' class="radio"  v-bind:label=item.code  >{{item.name}}</el-radio>
        </el-radio-group>
      </p>
      <p class="comflter-p" v-if="subjectlist.length > 0">
        <span class="comflter-p-span">学科:</span>
        <el-radio-group v-model="subjectRadio" @change="getBookTypeVersion()">
          <el-radio v-for="(item,index) in subjectlist" :key = 'item.subject_code' class="radio"  v-bind:label=item.subject_code>{{item.subject_name}}</el-radio>
        </el-radio-group>
      </p>
      <p class="comflter-p" v-if="bookVersionlist.length > 0">
        <span class="comflter-p-span">教材:</span>
        <el-radio-group v-model="bookVersionRadio" @change="getbookTypeVersionAndUnit()">
          <el-radio v-for="(item,index) in bookVersionlist" :key = 'item.ctb_code' class="radio"  v-bind:label=item.ctb_code>{{item.book_type}}</el-radio>
        </el-radio-group>
      </p>
      <p class="comflter-p" v-if="bookTopBotlist.length > 0">
        <span class="comflter-p-span">上下册:</span>
        <el-radio-group v-model="bookTopBotRadio" @change="getbookTypeVersionUnit()">
          <el-radio v-for="(item,index) in bookTopBotlist" :key = 'item.code' class="radio"  v-bind:label=item.code>{{item.name}}</el-radio>
        </el-radio-group>
      </p>
      <p class="comflter-p" style="padding-right: 100px" v-if="unitlist.length > 0">
        <span class="comflter-p-span">单元:</span>
        <el-radio-group v-model="UnitRadio" @change="getPaperByUnit()">
          <el-radio v-for="(item,index) in unitlist" :key = 'item.code' class="radio"  v-bind:label=item.code>{{item.name}}</el-radio>
        </el-radio-group>
      </p>
    </div>
    <hr>
    <div style="margin: 15px 0;width: 40%">
      <el-input placeholder="请输入内容" v-model="input5" >
        <el-select v-model="select" slot="prepend" placeholder="请选择" style="width: 110px;">
          <el-option label="试卷名称" value="diagnosisPaperName"></el-option>
          <el-option label="资源名称" value="resourcePaperName"></el-option>
          <el-option label="作者" value="operator"></el-option>
        </el-select>
        <el-button slot="append" icon="search" @click="getPaperBySearch()"></el-button>
      </el-input>
    </div>
    <el-table :data="tableData" border  style="width: 100%">
      <el-table-column type="index" label="序号" width="105">
      </el-table-column>
      <el-table-column prop="diagnosisPaperName" label="名称" width="490">
      </el-table-column>
      <el-table-column prop="updateTime" label="创建日期" sortable>
      </el-table-column>
      <el-table-column prop="gradeCode" label="年级" >
      </el-table-column>
      <el-table-column prop="subjectCode" label="学科" >
      </el-table-column>
      <!--<el-table-column prop="code" label="教材版本" >-->
      <!--</el-table-column>-->
      <el-table-column prop="operator" label="作者" >
      </el-table-column>
      <!--<el-table-column prop="name" label="题目数量" >-->
      <!--</el-table-column>-->
      <!--<el-table-column label="操作(暂无)">-->
        <!--<template scope="scope">-->
          <!--<el-button size="small"-->
                     <!--@click="handleEdit(scope.$index, scope.row)">编辑</el-button>-->
          <!--<el-button size="small" type="danger"-->
                     <!--@click="handleDelete(scope.$index, scope.row)">删除</el-button>-->
        <!--</template>-->
      <!--</el-table-column>-->
    </el-table>
    <div class="pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[currentRootPageSize, currentRootPageSize*2]"
        :page-size="currentPageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="dataTotal">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import paperFilterCondition from '../common/paperFilterCondition.vue';
  export default {
    data() {
      return {
        groundCode: [
          {code:11,name:'一年级'},
          {code:12,name:'二年级'},
          {code:13,name:'三年级'},
          {code:14,name:'四年级'},
          {code:15,name:'五年级'},
          {code:16,name:'六年级'},
          {code:21,name:'七年级'},
          {code:22,name:'八年级'},
          {code:23,name:'九年级'},
          {code:31,name:'高一'},
          {code:32,name:'高二'},
          {code:33,name:'高三'},
        ],
        grondRadio: 11,
        subjectlist:[],
        subjectRadio: ' ',
        bookVersionlist:[],
        bookVersionRadio: ' ',
        bookTopBotlist:[],
        bookTopBotRadio:' ',
        unitlist:[],
        UnitRadio:' ',
        input5: ' ',
//        input5: '董',
        select: 'operator',
        tableData: [],
        currentPage: 1,
        currentRootPageSize: 10,
        currentPageSize: 10,
        dataTotal: 0,
        searchFlag: 0
      }
    },
    components:{
      paperFilterCondition
    },
    mounted: function () {

    },
    methods: {
      //根据学年获取学科
      getSubject: function () {
          this.tableData = [];
          this.dataTotal = 0;
          if(this.grondRadio != 0){
            this.input5 = '';
            this.$http.post(this.rootUrl + 'teacher/rescours/getSubjectByGradeCode?requestId=123',{"gradeCode":this.grondRadio}).then((res) => {
              this.subjectlist=res.body.result;
              this.subjectRadio = ' ';
              this.bookVersionlist = [];
              this.bookTopBotlist = [];
              this.unitlist = [];
            }, (res) => {
              console.log(res);
            });
          }
      },
      //根据学科获取教材版本
      getBookTypeVersion: function () {
        this.tableData = [];
        this.dataTotal = 0;
        if(this.subjectRadio != null && this.subjectRadio != ' '){
          this.input5 = '';
          this.$http.post(this.rootUrl + 'teacher/rescours/getBookTypeVersion?requestId=123',
            {
              "gradeCode":this.grondRadio,
              "subjectCode":this.subjectRadio
            }).then((res) => {
            this.bookVersionlist=res.body.result;
            this.bookVersionRadio= ' ';
            this.bookTopBotlist = [];
            this.unitlist = [];
            this.UnitRadio = ' ';
          }, (res) => {
            console.log(res);
          });
        }
      },
      //根据教材版本获取上下册
      getbookTypeVersionAndUnit: function () {
        this.tableData = [];
        this.dataTotal = 0;
        if(this.bookVersionRadio != null && this.bookVersionRadio != ' '){
          this.input5 = '';
          this.$http.post(this.rootUrl + 'teacher/rescours/getbookTypeVersionAndUnit?requestId=123',
            {
              "gradeCode":this.grondRadio,
              "subjectCode":this.subjectRadio,
              "booktypeCode":this.bookVersionRadio,
              "productsIds":"581c1b44f70541fc88f8658041477c6c",
              "code":"0"
            }).then((res) => {
            this.bookTopBotlist=res.body.result;
            this.bookTopBotRadio= ' ';
            this.unitlist = [];
          }, (res) => {
            console.log(res);
          });
        }
      },
      //根据上下册获取单元
      getbookTypeVersionUnit: function () {
        this.tableData = [];
        this.dataTotal = 0;
        if(this.bookTopBotRadio != null && this.bookTopBotRadio != ' '){
          this.input5 = '';
          this.$http.post(this.rootUrl + 'teacher/rescours/getbookTypeVersionAndUnit?requestId=123',
            {
              "gradeCode":this.grondRadio,
              "subjectCode":this.subjectRadio,
              "booktypeCode":this.bookVersionRadio,
              "productsIds":"581c1b44f70541fc88f8658041477c6c",
              "code":this.bookTopBotRadio
            }).then((res) => {
            this.unitlist=res.body.result;
            this.UnitRadio= ' ';
          }, (res) => {
            console.log(res);
          });
        }
      },
      //根据单元获取试卷
      getPaperByUnit: function () {
          this.searchFlag = 1
        let parms = {
          "pageNum": this.currentPage,
          "pageSize": this.currentPageSize,
          "unitCode":this.UnitRadio
        }
        this.postSearch(parms);
      },
      getPaperBySearch: function () {
        this.searchFlag = 2
        this.grondRadio = 0;
          this.subjectlist= [];
          this.bookVersionlist = [];
          this.bookTopBotlist = [];
          this.unitlist = [];
        let parms = {
          "pageNum": this.currentPage,
          "pageSize": this.currentPageSize,
        }
        switch (this.select){
          case "diagnosisPaperName":
            parms.diagnosisPaperName = this.input5
            break;
          case "resourcePaperName":
            parms.resourcePaperName = this.input5
            break;
          case "operator":
            parms.operator = this.input5
            break;
        }
        this.postSearch(parms);
      },
      postSearch: function (parm) {
        this.$http.post(this.rootUrl + 'manager/teacher/getDiagnosisPaperByPaper?requestId=123',parm
          ).then((res) => {
          this.tableData=res.body.result.list;
          this.dataTotal=res.body.result.total;
          let rootThis = this;
          this.tableData.forEach(function(e){
            e.updateTime = rootThis.fTime(e.updateTime)
            e.gradeCode = rootThis.fGradeCode(e.gradeCode)
            e.subjectCode = rootThis.fSubjectCode(e.subjectCode)
          })
        }, (res) => {
          console.log(res);
        });
      },

      handleSizeChange(val) {
        this.currentPageSize = val
          if(this.searchFlag == 1){
              this.getPaperByUnit()
          }else{
            this.getPaperBySearch()
          }
      },
      handleCurrentChange(val) {
        this.currentPage = val
        if(this.searchFlag == 1){
          this.getPaperByUnit()
        }else{
          this.getPaperBySearch()
        }
      }
    }
  }
</script>
<style>
  .comflter {
    margin: 15px 0;
  }
  .comflter-p {
    margin: 15px 0;
    padding-left: 70px;
    position: relative;
  }
  .comflter-p-span{
    position: absolute;
    top: 0;
    left: 0;
  }
</style>
