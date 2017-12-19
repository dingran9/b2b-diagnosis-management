<template>
  <div>
    <div class="crumbs" style="position: relative">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-menu"></i> 权限管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <hr>
    <el-table :data="tableData" border  style="width: 100%;margin-top: 20px">
      <el-table-column type="index" label="序号" width="105">
      </el-table-column>
      <el-table-column prop="roleName" label="部门名称" width="150">
      </el-table-column>
      <el-table-column prop="peopleCount" label="部门人数" width="100">
        <template scope="scope">
          <span>{{ scope.row.peopleCount }}人</span>
        </template>
      </el-table-column>
      <el-table-column prop="resourceList" label="部门权限" width="490">
      </el-table-column>
      <el-table-column label="操作">
        <template scope="scope">
          <el-button size="small"
                     @click="handleMana(scope.$index, scope.row)">管理用户</el-button>
          <el-button size="small" type="primary"
                     @click="handleEdit(scope.$index, scope.row)">编辑权限</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="管理用户" v-model="dialogManaUser">
      <hr>
      <div style="margin-top: 10px">
        <span>部门: {{dialogManaUserb}}</span>&nbsp;&nbsp;&nbsp;&nbsp;<span>权限: {{dialogManaUserq}}</span>
        <el-table :data="tableData1" border  style="width: 100%;margin-top: 20px">
          <el-table-column type="index" label="序号" width="105">
          </el-table-column>
          <el-table-column prop="userAccount" label="用户姓名" width="150">
          </el-table-column>
          <el-table-column  label="操作">
            <template scope="scope">
              <el-button size="small" type="primary"
                         @click="deleteUser(scope.$index, scope.row)">删除用户</el-button>
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
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogManaUser = false">取 消</el-button>
        <el-button type="primary" @click="dialogManaUser = false">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="管理用户" v-model="dialogEditUser">
      <hr>
      <div style="margin-top: 10px">
        <el-form :model="form" label-width="100px" style="margin-top: 15px;width: 500px">
          <el-form-item label="部门名称" >
            <el-input v-model="form.name" auto-complete="off" class="addU-i"></el-input>
          </el-form-item>
          <el-form-item label="选择权限">
            <!--<el-checkbox-group v-model="form.type">-->
            <!--<el-checkbox :label=item.resourceName :key="item.resourceId" name="type" v-for="item in getAllAuthResources"></el-checkbox>-->
            <!--</el-checkbox-group>-->
            <ul id="tree" class="ztree"></ul>
          </el-form-item>
        </el-form>

      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEditUser = false">取 消</el-button>
        <el-button type="primary" @click="onSubmitEdit">确 定</el-button>
      </div>
    </el-dialog>
    <!--<ul id="tree" class="ztree"></ul>-->
  </div>
</template>
<script>
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
          roleId:'',
          name: '',
          type: [],
        },
        currentPage: 1,
        currentRootPageSize: 10,
        currentPageSize: 10,
        dataTotal: 0,
        treeObj:null,
        ztreeSetting:{
          check: {
            enable: true
          },
          data: {
            key: {
              name: "resourceName",
              checked: "selected"
            },
            simpleData: {
              enable: true,
              idKey: "resourceId",
              pIdKey: "resourceParentId",
            }
          }
        }  //ztree配置
      }
    },
    mounted: function () {
      this.postSearch();
      //获取所有的权限
      this.$http.post(this.rootUrl + 'authorize/getAuthResources?requestId=123',{}
      ).then((res) => {
        if(res.body.code == 'Success'&&res.body.httpCode == '200'){
          this.getAllAuthResources=res.body.result;
//          this.getAllAuthResources = this.getAllAuthResources.map(function (x) {
//            return {"resourceId":x.resourceId, "resourceName":x.resourceName}
//          })
        }
      }, (res) => {
        console.log(res);
      });
    },
    methods: {
      postSearch: function () {
        this.$http.post(this.rootUrl + 'authorize/authorityManager?requestId=123',{}
        ).then((res) => {
          this.tableData=res.body.result;
          this.tableData.forEach(function (e) {
            let listArray = ''
            e.resourceList.forEach(function (x) {
              listArray += x.resourceName+','
            })
            e.resourceList = listArray.substr(0,listArray.length - 1)
          })
//          this.dataTotal=res.body.result.total;
        }, (res) => {
          console.log(res);
        });
      },
      handleMana(index, row){
        this.dialogManaUserb = row.roleName
        this.dialogManaUserq = row.resourceList
        this.dialogManaUserRoleId = row.roleId
        this.dialogManaUserRoleName = row.roleName
        this.dialogManaUser = true
        this.getRoleList()
      },
      getRoleList (){
        this.$http.post(this.rootUrl + 'authorize/authUserManager?requestId=123',{"roleId":this.dialogManaUserRoleId,"roleName":this.dialogManaUserRoleName,pageNum: this.currentPage, pageSize: this.currentPageSize,}
        ).then((res) => {
          this.tableData1=res.body.result.list;
          this.dataTotal=res.body.result.total;
        }, (res) => {
          console.log(res);
        });
      },

      //删除用户
      deleteUser(index, row){
        this.$http.post(this.rootUrl + 'authorize/delRoleBindByUserAndRole?requestId=123', {
            "userId": row.userId,
            "roleId":this.dialogManaUserRoleId
          }
        ).then((res) => {
          if(res.body.code == 'Success'&&res.body.httpCode == '200'){
            this.$message('删除成功');
            this.dialogManaUser = false
            this.postSearch()
          }
        }, (res) => {
          console.log(res);
        });
      },
      //打开编辑模态框
      handleEdit(index, row){
        this.form.roleId = row.roleId
        this.form.name = row.roleName
        let arr  = row.resourceList.split(',')
        this.dialogEditUser=true
        let rootThis = this
        let resource = this.getAllAuthResources
        resource.forEach(function (e) {
          if(arr.includes(e.resourceName)){
            e.selected = 1
          }else {
            e.selected = 0
          }
        })
        $(document).ready(function(){
          rootThis.treeObj = $.fn.zTree.init($("#tree"), rootThis.ztreeSetting, resource);
        });
      },
      //修改权限
      onSubmitEdit(){
        let thatThis = this
        let resourceList = [];
        var nodes = this.treeObj.getCheckedNodes(true);
        nodes.forEach(function (x) {
          if(x.selected){
            resourceList.push({
              "resourceId":x.resourceId,
              "resourceName":x.resourceName
            })
          }
        })
        this.$http.post(this.rootUrl + 'authorize/updateAuthRoleResources?requestId=123',{
            "roleId":this.form.roleId,
            "roleName":this.form.name,
            "resourceList":resourceList
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
        this.getRoleList()
      },
      handleCurrentChange(val) {
        this.currentPage = val
        this.getRoleList()
      },
    },
  }
</script>
<style>
  @import "../../../../static/lib/ztree/css/zTreeStyle/zTreeStyle.css";
</style>
<style>
  .a-p-f-ul{
    list-style: none;
  }
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
  .sub-ele {
    float: right;
    margin-top: 7px;
    margin-right: 10px;
  }
  .sub-name{
    margin-left: 20px;
  }
  .sub-p-name{
    margin-left: 10px;
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
