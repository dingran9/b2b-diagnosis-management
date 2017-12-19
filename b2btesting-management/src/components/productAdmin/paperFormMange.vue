<template>
  <div>
    <div class="crumbs" style="position: relative">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-menu"></i> 试卷管理</el-breadcrumb-item>
        <!--<el-breadcrumb-item>学校列表</el-breadcrumb-item>-->
      </el-breadcrumb>
      <router-link :to="{path:'/addPaperForm'}">
        <el-button type="primary" style="position: absolute;right:0;top: -10px;">添加全科试卷</el-button>
      </router-link>
      <el-button type="primary" style="position: absolute;right:0;top: 48px;" @click="getListBuyChild()">搜索试卷</el-button>
    </div>
    <paperFormFilter v-on:increment="listenToMyChild"></paperFormFilter>
    <el-table :data="tableData" border  style="width: 100%;margin-top: 20px">
      <el-table-column type="index" label="序号" width="105">
      </el-table-column>
      <el-table-column prop="diagnosisPaperName" label="试卷名称" width="290">
      </el-table-column>
      <el-table-column prop="gradeCode" label="年级">
        <template scope="scope">
          <span>{{ scope.row.gradeCode|gradeCodeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="subjectCode" label="试卷" width="290">
        <template scope="scope">
          <el-tag type='primary' v-for="item in scope.row.subjectCode" :key=item close-transition>{{item|subjectFilter}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template scope="scope">
          <el-button size="small"
                     @click="editExamPaper(scope.row)">编辑</el-button>
          <el-button size="small" type="primary"
                     @click="openExamPaper(scope.row)">详情</el-button>
        </template>
      </el-table-column>
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
  import paperFormFilter from '../common/paperFormFilter.vue';
  export default {
    data() {
      return {
        tableData: [],
        currentPage: 1,
        currentRootPageSize: 10,
        currentPageSize: 10,
        dataTotal: 0,
        searchFlag: 0,
        getChildDate:{}
      }
    },
    components:{
      paperFormFilter
    },
    mounted: function () {
        if(this.getChildDate.schoolValue && this.getChildDate.grondRadio){
            this.getListBuyChild()
        }

    },
//    watch: {
//      'getChildDate':'getListBuyChild'
//    },
    methods: {
      listenToMyChild: function (someDate) {
        this.getChildDate = someDate
      },
      //根据单元获取试卷
      getListBuyChild: function () {
        this.searchFlag = 1
        let parms = {
          "pageNum": this.currentPage,
          "pageSize": this.currentPageSize,
          "flag": 1,
        }
        if(this.getChildDate.schoolValue){
          parms.schoolCode = this.$store.state.paperFormFilter_data.schoolValue|| this.getChildDate.schoolValue
          parms.gradeCode = this.getChildDate.grondRadio
        }
        this.postSearch(parms);
      },
      postSearch: function (parm) {
        this.$http.post(this.rootUrl + 'manager/teacher/getDiagnosisComplexPaperByPaper?requestId=123',parm
        ).then((res) => {
          try {
            this.tableData=res.body.result.list;  //学生列表
            this.dataTotal=res.body.result.total;  //学生总数
            let rootthis = this;
            this.tableData.forEach(function (e) {
              e.subjectCode = e.subjectCode.split(',')
              e.subjectCode =[...new Set(e.subjectCode)]
            })
          }catch (e){
            console.log(e.message);
          }
        }, (res) => {
          console.log(res);
        });
      },

      handleSizeChange(val) {
        this.currentPageSize = val
        this.getListBuyChild()
      },
      handleCurrentChange(val) {
        this.currentPage = val
        this.getListBuyChild()
      },
      //试卷详情
      openExamPaper(row){
        this.$router.push({path:"/getExamPaperDetail",query:{code:row.code}});
      },
      //编辑全科试卷
      editExamPaper(row){
        this.$router.push({path:"/editPaperForm",query:{code:row.code}});
      }
    }
  }
</script>
<style>
</style>
