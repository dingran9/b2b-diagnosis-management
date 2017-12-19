<template>
  <div>
    <div class="crumbs" style="position: relative">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-menu"></i> 权限管理</el-breadcrumb-item>
        <!--<el-breadcrumb-item>组织全科试卷</el-breadcrumb-item>-->
      </el-breadcrumb>
    </div>
    <hr>
    <el-form :model="form" label-width="100px" style="margin-top: 15px;width: 500px">
      <el-form-item label="部门名称" >
        <el-input v-model="form.name" auto-complete="off" class="addU-i"></el-input>
      </el-form-item>
      <el-form-item label="选择权限">
        <ul id="tree" class="ztree"></ul>
      </el-form-item>
      <el-form-item>
        <el-button :disabled="(!form.name) " type="primary" @click="onSubmitEdit" style="float: right">立即新增</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    name:'addDepartment',
    data() {
      return {
        getAllAuthResources:[],
        form: {
          name: '',
          type: [],
        },
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
      //获取所有的权限
      this.$http.post(this.rootUrl + 'authorize/getAuthResources?requestId=123',{}
      ).then((res) => {
        if(res.body.code == 'Success'&&res.body.httpCode == '200'){
          this.getAllAuthResources=res.body.result;
//          this.getAllAuthResources = this.getAllAuthResources.map(function (x) {
//            return {"resourceId":x.resourceId, "resourceName":x.resourceName}
//          })
          let rootThis = this
          $(document).ready(function(){
            rootThis.treeObj = $.fn.zTree.init($("#tree"), rootThis.ztreeSetting, rootThis.getAllAuthResources);
          });
        }
      }, (res) => {
        console.log(res);
      });
    },
    methods: {
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
        if(resourceList.length<1){
          this.$message('请选择权限');
          return
        }
        this.$http.post(this.rootUrl + 'authorize/addRoleResource?requestId=123',{
            "authRoleBean":{
              "roleName":this.form.name
            },
            "authResourceBeans":resourceList
          }
        ).then((res) => {
          if(res.body.code == 'Success'&&res.body.httpCode == '200'){
            this.$message('新增成功');
            this.$router.push('/departmentList')
          }
        }, (res) => {
          console.log(res);
        });
      }
    },
  }
</script>
<style>
  @import "../../../../static/lib/ztree/css/zTreeStyle/zTreeStyle.css";
</style>
<style>
  .addU-i{
    width: 300px;
  }
</style>
