<template>
  <div>
    <div class="crumbs" style="position: relative">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-menu"></i> 学生管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <hr>
    <div class="comflter">
      <p class="comflter-p">
        <span class="comflter-p-span">年级:</span>
        <el-radio-group v-model="grondRadio" @change="getStuBySearch()">
          <el-radio class="radio"  v-bind:label=null>全部</el-radio>
          <el-radio  v-for="(item,index) in groundCode" :key = 'item.code' class="radio"  v-bind:label=item.code  >{{item.name}}</el-radio>
        </el-radio-group>
      </p>
      <p class="comflter-p">
        <span class="comflter-p-span">班级:</span>
        <el-radio-group v-model="classRadio" @change="getStuBySearch()">
          <el-radio class="radio"  v-bind:label=null>全部</el-radio>
          <el-radio v-if="gradeList.length > 0"  v-for="(item,index) in gradeList" :key = 'item.classId' class="radio"  v-bind:label=item.classId  >{{item.className}}</el-radio>
        </el-radio-group>
      </p>
    </div>
    <hr>
    <div style="margin: 15px 0;width: 40%">
      <el-input placeholder="请输入内容" v-model="input5" >
        <el-select v-model="select" slot="prepend" placeholder="请选择" style="width: 110px;">
          <el-option label="用户名" value="userName"></el-option>
          <el-option label="账号" value="userAccount"></el-option>
          <el-option label="班级名称" value="className"></el-option>
          <el-option label="学校名称" value="schoolName"></el-option>
          <el-option label="手机号" value="userPhone"></el-option>
        </el-select>
        <el-button slot="append" icon="search" @click="getStuBySearch()"></el-button>
      </el-input>
      <el-button v-if="($route.path == '/preAdminStuMange')" size="small" type="danger"  icon="delete" style="margin-top: 15px" :disabled="multipleSelection.length < 1"
        @click="queryDelete()">批量删除
      </el-button>
    </div>
    <el-table :data="tableData" border  style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" v-if="($route.path == '/preAdminStuMange')">
      </el-table-column>
      <el-table-column type="index" label="序号" width="105">
      </el-table-column>
      <el-table-column prop="userName" label="姓名" width="125">
      </el-table-column>
      <el-table-column prop="userAccount" label="学籍号">
      </el-table-column>
      <el-table-column prop="gradeName" label="年级" width="125">
      </el-table-column>
      <el-table-column prop="schoolName" label="所在学校" >
      </el-table-column>
      <el-table-column prop="className" label="所在班级" width="105">
      </el-table-column>
      <el-table-column prop="createDate" label="注册时间" >
      </el-table-column>
      <el-table-column prop="userLoginDate" label="最后登录时间" >
      </el-table-column>
      <!--<el-table-column prop="userPhone" label="手机号" >-->
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
  export default {
      name:'addSchool',
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
        gradeList:[],
        grondRadio: null,
        classRadio: null,
        paperListData:[],
        input5: '',
        select: 'userName',
        tableData: [],
        currentPage: 1,
        currentRootPageSize: 10,
        currentPageSize: 10,
        dataTotal: 0,
        userSchoolId: JSON.parse(window.localStorage.getItem("Userinfo")).userSchoolId,
        multipleSelection: [] //check选择框数据
      }
    },
    mounted: function () {
      this.getStuByGroudCode()
    },
    methods: {
      /*年级查询获取学生列表*/
      getStuByGroudCode: function (p,s) {
        this.tableData = []
        this.currentPage = p||1
        var parms = {
          "pageNum": p||this.currentPage,
          "pageSize": s||this.currentPageSize,
          "gradeIden":this.grondRadio,
          "schoolId": JSON.parse(window.localStorage.getItem("Userinfo")).userSchoolId
        }
        this.postSearch(parms);
      },
      /*模糊查询获取学生列表*/
      getStuBySearch: function (p,s) {
        this.tableData = [];
        this.currentPage = p||1
        let parms = {
          "pageNum": p||this.currentPage,
          "pageSize": s||this.currentPageSize,
          "gradeIden":this.grondRadio,
          "classId":this.classRadio,
          "schoolId": JSON.parse(window.localStorage.getItem("Userinfo")).userSchoolId,
        }
        switch (this.select){
          case "userName":
            parms.userName = this.input5
            break;
          case "userAccount":
            parms.userAccount = this.input5
            break;
          case "className":
            parms.className = this.input5
            break;
          case "schoolName":
            parms.schoolName = this.input5
            break;
          case "userPhone":
            parms.userPhone = this.input5
            break;
        }
        this.postSearch(parms)
        if(this.userSchoolId)this.getClass();
      },
      /*查询班级*/
      getClass:function () {
        this.$http.post(this.rootUrl + 'groupManager/classManagerList?requestId=' + Math.random(),{
          "schoolId":this.userSchoolId,
          "gradeIden":this.grondRadio,
          "pageNumber":this.currentPage,
          "pageSize":this.currentPageSize
        }).then((res) => {
          if(res.body.httpCode=='200'){
              try{
                this.gradeList = res.body.result.list[0].classBeanList;
              }catch(e) {
              }
//            let resultArr=[];
//            console.log(datas);
//            for (let a = 0; a < datas.classBeanList.length;a++) {
//              resultArr.push(a)
//            }
//            this.gradeList = resultArr;
          }
        })
      },
      /*查询学生列表*/
      postSearch: function (parm) {
        this.$http.post(this.rootUrl + 'studentManager/getStudentInfoBySchoolAndGrade?requestId=123',parm
        ).then((res) => {
          this.tableData=res.body.result.list;  //学生列表
          this.dataTotal=res.body.result.total;  //学生总数
          let rootThis = this;
          this.tableData.forEach(function(e){
            e.createDate = rootThis.fTime(e.createDate)
            e.userLoginDate = rootThis.fTime(e.userLoginDate)
          })
        }, (res) => {
          console.log(res);
        });
      },
      /*分页插件的点击事件*/
      handleSizeChange(val) {
        this.currentPageSize = val
        if(this.searchFlag == 1){
          this.getStuByGroudCode(null,val)
        }else{
          this.getStuBySearch(null,val)
        }
      },
      handleCurrentChange(val) {
        this.currentPage = val
        if(this.searchFlag == 1){
          this.getStuByGroudCode(val,null)
        }else{
          this.getStuBySearch(val,null)
        }
      },
      //控制全选按钮
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      //批量删除
      queryDelete(){
        console.log(this.multipleSelection);
        let parm = this.multipleSelection.map(function (e) {
          return {'userId':e.userId}
        })
        this.$confirm('此操作将永久删除该组学生, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.post(this.rootUrl + 'authorize/deleteStudentGroupInfoBatch?requestId=123',parm
          ).then((res) => {
            if(res.body.code == 'Success' && res.body.httpCode == '200'){
              this.$message('操作成功');
              this.getStuByGroudCode()
            }
          }, (res) => {
            console.log(res);
          });
        }).catch(() => {
//          this.$message({
//            type: 'info',
//            message: '已取消删除'
//          });
        })
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
  .comflter-p .demand{
    position: absolute;
    top: -10px;
    right: 0px;
  }
</style>

