<template>
  <div>
    <div class="crumbs" style="position: relative">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-menu"></i>校长列表</el-breadcrumb-item>
        <!--<el-breadcrumb-item>教师列表</el-breadcrumb-item>-->
      </el-breadcrumb>
    </div>
    <hr>
    <el-table :data="paperListData" border  style="width: 100%;margin-top: 15px">
      <el-table-column type="index" label="序号" width="105">
      </el-table-column>
      <el-table-column prop="userId" label="校长ID" width="125">
      </el-table-column>
      <el-table-column prop="userName" label="校长名称" width="125">
      </el-table-column>
      <el-table-column prop="userAccount" label="校长账号">
      </el-table-column>
      <el-table-column prop="userPhone" label="校长电话">
        <template scope="scope">
          <el-tag type='primary' v-if="scope.row.userPhone" close-transition>{{scope.row.userPhone}}</el-tag>
          <span v-else close-transition>--</span>
        </template>
      </el-table-column>
      <el-table-column prop="userPhone" label="校长状态" width="125">
        <template scope="scope">
          <el-tag type='primary' v-if="scope.row.status" close-transition>不可用</el-tag>
          <el-tag type='success'v-else close-transition>可用</el-tag>
        </template>
      </el-table-column>
      <!--<el-table-column label="操作(暂无)">-->
        <!--<template scope="scope">-->
          <!--<el-button size="small"  @click="openDialog(scope.row)" :disabled="Boolean(scope.row.isRelease)">发送</el-button>-->
          <!--<el-button size="small" type="primary" @click="openExamPaper(scope.row)">查看试卷</el-button>-->
        <!--</template>-->
      <!--</el-table-column>-->
    </el-table>
    <!--<div class="pagination">-->
      <!--<el-pagination-->
        <!--@size-change="handleSizeChange"-->
        <!--@current-change="handleCurrentChange"-->
        <!--:current-page="currentPage"-->
        <!--:page-sizes="[currentRootPageSize, currentRootPageSize*2]"-->
        <!--:page-size="currentPageSize"-->
        <!--layout="total, sizes, prev, pager, next, jumper"-->
        <!--:total="dataTotal">-->
      <!--</el-pagination>-->
    <!--</div>-->
  </div>
</template>

<script>
  export default {
    data() {
      return {
        paperListData:[],
        currentPage: 1,
        currentRootPageSize: 10,
        currentPageSize: 10,
        dataTotal: 0,
        userSchoolId: JSON.parse(window.localStorage.getItem("Userinfo")).userSchoolId,
        dialogVisible: false,
        form: {
          group:'',
          name: '',
          time: "",
        },
        submitForm: {}
      }
    },
    mounted(){
        this.postSearch()
    },
    methods: {
      //获取校长列表
      postSearch: function (parm) {
        this.$http.post(this.rootUrl + 'userManager/getPrincipalList?requestId=123',{"userSchoolId":this.userSchoolId}
        ).then((res) => {
          try {
            this.paperListData=res.body.result;  //学生列表
//            this.dataTotal=res.body.result.total;  //学生总数
//            let rootthis = this;
//            this.paperListData.forEach(function (e) {
//              e.subjectCode = e.subjectCode.split(',')
//              e.subjectCode =[...new Set(e.subjectCode)]
//            })
          }catch (e){
            console.log(e.message);
          }
        }, (res) => {
          console.log(res);
        });
      },
      handleSizeChange(val) {
        this.currentPageSize = val
        this.getPaper()
      },
      handleCurrentChange(val) {
        this.currentPage = val
        this.getPaper()
      },
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
  .comflter-p .demand{
    position: absolute;
    top: -10px;
    right: 0px;
  }
</style>
