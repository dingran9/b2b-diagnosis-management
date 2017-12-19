<template>
  <div>
    <div class="crumbs" style="position: relative">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-menu"></i> 区域管理</el-breadcrumb-item>
        <el-breadcrumb-item>区域联考</el-breadcrumb-item>
      </el-breadcrumb>
      <router-link :to="{path:'/areaPaperAdd'}">
        <el-button type="primary" style="position: absolute;right:0;top: -10px;">添加区域联考</el-button>
      </router-link>
    </div>
    <hr>
    <el-table :data="tableData" border  style="width: 100%;margin-top: 20px" >
      <el-table-column type="index" label="序号" width="105">
      </el-table-column>
      <el-table-column type="teacherName" label="创建人" width="120">
        <template scope="scope">
          <span>{{ scope.row.teacherName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="diagnosisName" label="试卷名称" width="400">
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" >
        <template scope="scope">
          <span>{{ scope.row.createTime | time}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="startTime" label="开始时间" >
        <template scope="scope">
          <span>{{ scope.row.startTime | time}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="endTime" label="结束时间">
        <template scope="scope">
          <span>{{ scope.row.endTime | time}}</span>
        </template>
      </el-table-column>
      <!--<el-table-column prop="peopleCount" label="姓名" >-->
      <!--<template scope="scope">-->
      <!--<span>{{ scope.row.peopleCount }}人</span>-->
      <!--</template>-->
      <!--</el-table-column>-->
      <!--<el-table-column label="操作">-->
      <!--<template scope="scope">-->
      <!--<el-button size="small"-->
      <!--@click="handleMana(scope.$index, scope.row)">管理用户</el-button>-->
      <!--<el-button size="small" type="primary"-->
      <!--@click="handleEdit(scope.$index, scope.row)">编辑权限</el-button>-->
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
  import md5 from 'MD5'
  export default {
    data() {
      return {
        userType: 7,
        tableData:[
          {
            roleName:'北京市-北京市-西城区',
            Name:'西门庆'
          }
        ],
        currentPage: 1,
        currentRootPageSize: 10,
        currentPageSize: 10,
        dataTotal: 0,
      }
    },
    mounted: function () {
      this.getList()
    },
    methods: {
      getList(){  //区域联考列表
        this.$http.post(this.rootUrl + 'teacher/diagnosis/areaExamList?requestId=123213',{
          "groupAreaDistrictId": JSON.parse(localStorage.getItem('Userinfo')).groupAreaDistrictId,
          "pageNum": this.currentPage,
          "pageSize": this.currentPageSize,
          "examScope": 4
        }).then((res) => {
          if(res.body.code == 'Success'&&res.body.httpCode == '200'){
            this.tableData=res.body.result.list;
            this.dataTotal=res.body.result.total;
          }
        }, (res) => {
          console.log(res);
        });
      },
      handleSizeChange(val) {
        this.currentPageSize = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.currentPage = val
        this.getList()
      }
    },
  }
</script>
<style>
  .addU-i{
    width: 300px;
  }
</style>
