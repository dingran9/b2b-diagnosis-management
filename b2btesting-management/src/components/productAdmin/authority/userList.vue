<template>
  <div>
    <div class="crumbs" style="position: relative">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-menu"></i> 用户列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <hr>
    <el-table :data="tableData" border  style="width: 100%;margin-top: 20px">
      <el-table-column type="index" label="序号" width="105">
      </el-table-column>
      <el-table-column prop="userName" label="用户名称" width="150">
      </el-table-column>
      <el-table-column prop="userAccount" label="用户账号" width="150">
      </el-table-column>
      <el-table-column prop="roleBeanList" label="用户权限" width="350">
        <template scope="scope">
        <!--<span >{{ scope.row }}</span>-->
        <span v-for="item in scope.row.roleBeanList">{{ item.roleName }}&nbsp;&nbsp;  </span>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="用户状态" width="150">
        <template scope="scope">
          <el-tag v-if="scope.row.status == 0"  type="success" close-transition>可用</el-tag>
          <el-tag v-if="scope.row.status == 1"  type="primary" close-transition>不可用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template scope="scope">
          <el-button size="small"
                     @click="handleEditUser(scope.$index, scope.row)"><span v-if="scope.row.status == 0">禁用</span><span v-if="scope.row.status == 1">可用</span></el-button>
          <el-button size="small" type="primary"
                     @click="handleDeleteUser(scope.$index, scope.row)">重置密码</el-button>
          <el-button size="small" type="primary"
                     @click="handleEdit(scope.$index, scope.row)">编辑权限</el-button>
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
    <el-dialog title="管理用户" v-model="dialogEditUser">
      <hr>
      <div style="margin-top: 10px">
        <el-form :model="form" label-width="100px" style="margin-top: 15px;width: 500px">
          <el-form-item label="选择权限">
            <el-checkbox-group v-model="form.type">
              <el-checkbox :label=item.roleName :key="item.roleId" name="type" v-for="item in getAllAuthResources"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEditUser = false">取 消</el-button>
        <el-button type="primary" @click="onSubmitEdit">确 定</el-button>
      </div>
    </el-dialog>
    <ul id="tree" class="ztree"></ul>
  </div>
</template>
<script>
//  import "../../../../static/js/jquery.min";
//  import "../../../../static/lib/ztree/js/jquery.ztree.core.min";
  export default {
    data() {
      return {
        getAllAuthResources:[],
        tableData:[],
        dialogManaUser:false,
        dialogManaUserb: '', //管理用户模态框数据
        dialogManaUserq: '',
        dialogManaUserRoleId: '', //管理用户模态框数据
        dialogManaUserRoleName: '',
        tableData1:[],
        dialogEditUser:false,
        form: {
          userId:'',
          userName: '',
          type: [],
        },
        currentPage: 1,
        currentRootPageSize: 10,
        currentPageSize: 10,
        dataTotal: 0,
      }
    },
    mounted: function () {
      this.postSearch();
      this.getAllAuth();
    },
    methods: {
      getAllAuth: function () {
        //获取所有的权限
        this.$http.post(this.rootUrl + 'authorize/getAuthRoles?requestId=123',{}
        ).then((res) => {
          if(res.body.code == 'Success'&&res.body.httpCode == '200'){
            this.getAllAuthResources=res.body.result;
//            this.getAllAuthResources = this.getAllAuthResources.map(function (x) {
//              return {"resourceId":x.roleId, "resourceName":x.roleName}
//            })
          }
        }, (res) => {
          console.log(res);
        });
      },
      //获取用户列表
      postSearch: function () {
        this.$http.post(this.rootUrl + 'authorize/getUserManagerPage?requestId=123', {
            "userType": 5,
            "pageSize": this.currentPageSize,
            "pageNum": this.currentPage,
          }
        ).then((res) => {
          this.tableData=res.body.result.list;
          this.dataTotal=res.body.result.total;
        }, (res) => {
          console.log(res);
        });
      },
      //禁用,启用
      handleEditUser(index, row){
        this.$http.post(this.rootUrl + 'authorize/updateUserManagerStatus?requestId=123',{"userId":row.userId,"userName":row.userName,"status":row.status == 1?0:1}
        ).then((res) => {
            if(res.body.code == 'Success'&&res.body.httpCode == '200'){
              this.$message('修改成功');
              this.postSearch();
            }
        }, (res) => {
          console.log(res);
        });
      },
      //重置密码
      handleDeleteUser(index, row){
        this.$http.post(this.rootUrl + 'authorize/resetUserPwd?requestId=123',{"userId":row.userId,"userName":row.userName,"userPassword":"e10adc3949ba59abbe56e057f20f883e"}
        ).then((res) => {
          if(res.body.code == 'Success'&&res.body.httpCode == '200'){
            this.$message('重置成功');
          }
        }, (res) => {
          console.log(res);
        });
      },
      //打开编辑模态框
      handleEdit(index, row){
        console.log(row);
        this.form.userId = row.userId
        this.form.userName = row.userName
        this.form.type = row.roleBeanList.map(function (x) {
          return x.roleName
        })
        this.dialogEditUser=true
      },
      //修改权限
      onSubmitEdit(){
        let thatThis = this
        let resourceList = [];
        this.form.type.forEach(function (x) {
          thatThis.getAllAuthResources.forEach(function (f) {
            if(f.roleName == x){
              resourceList.push({
                "roleId":f.roleId,
                "roleName":f.roleName
              })
            }
          })
        })
        this.$http.post(this.rootUrl + 'authorize/updateAuthUserRole?requestId=123',{
          "userId":this.form.userId,
          "userName":this.form.userName,
          "authRoleBeans":resourceList
          }
        ).then((res) => {
          if(res.body.code == 'Success'&&res.body.httpCode == '200'){
            this.$message('修改成功');
            this.dialogEditUser=false
            this.postSearch();
          }
        }, (res) => {
          console.log(res);
        });
      },

      //分页
      handleSizeChange(val) {
        this.currentPageSize = val
        this.postSearch()
      },
      handleCurrentChange(val) {
        this.currentPage = val
        this.postSearch()
      },
    },
  }
</script>
<style>
  .a-p-f-ul li{
    width: 900px;
    color: #48576a;
    font-size: 18px;
    line-height: 50px;
    border-top: 1px solid #bfcbd9;
    border-left: 1px solid #bfcbd9;
    border-right: 1px solid #bfcbd9;
  }
  .a-p-f-ul li:last-child{
    border-bottom: 1px solid #bfcbd9
  }
  .comflter-p .demand{
    position: absolute;
    top: -10px;
    right: 0px;
  }
</style>
