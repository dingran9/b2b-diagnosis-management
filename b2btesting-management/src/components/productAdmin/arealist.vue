<template>
  <div>
    <div class="crumbs" style="position: relative">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-menu"></i> 区域管理</el-breadcrumb-item>
        <el-breadcrumb-item>区域管理</el-breadcrumb-item>
      </el-breadcrumb>
      <router-link :to="{path:'/areaAdd'}">
        <el-button type="primary" style="position: absolute;right:0;top: -10px;">添加区域用户</el-button>
      </router-link>
    </div>
    <hr>
    <el-form  label-width="100px" style="margin-top: 15px;width: 700px">
      <el-form-item label="用户类型:">
        <el-radio-group v-model="userType" @change="getList()">
          <el-radio :label="7" :value="7">局长</el-radio>
          <el-radio :label="8" :value="8">教研员</el-radio>
          <el-radio :label="9" :value="9">区域管理员</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" border  style="width: 100%;margin-top: 20px" >
      <el-table-column type="index" label="序号" width="105">
      </el-table-column>
      <el-table-column prop="roleName" label="地区名称" width="400">
        <template scope="scope">
          <span>{{ scope.row.userGroupAreaProvinceName}}-{{ scope.row.userGroupAreaCityName}}-{{ scope.row.userGroupAreaDistrictName}}</span>
          </template>
      </el-table-column>
      <el-table-column prop="userName" label="姓名" >
      </el-table-column>
      <el-table-column prop="userAccount" label="账号" >
      </el-table-column>
      <el-table-column prop="userSubject" label="科目" v-if="userType == 8">
        <template scope="scope">
        <span>{{ scope.row.userSubject|subjectFilter }}</span>
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
      name:'addUser',
    data() {
      return {
        userType: 8,
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
      getList(){
        this.$http.post(this.rootUrl + 'authUserAuthority/list?requestId=123',{
          "userType": this.userType,
          "pageNum": this.currentPage,
          "pageSize": this.currentPageSize,
          }).then((res) => {
          if(res.body.code == 'Success'&&res.body.httpCode == '200'){
            this.tableData=res.body.result.row;
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
