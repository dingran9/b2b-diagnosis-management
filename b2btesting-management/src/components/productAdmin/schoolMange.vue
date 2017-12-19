<template>
  <div>
    <div class="crumbs" style="position: relative">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-menu"></i> 学校管理</el-breadcrumb-item>
        <el-breadcrumb-item>学校列表</el-breadcrumb-item>
      </el-breadcrumb>
      <router-link :to="{path:'/addSchool'}">
        <el-button type="primary" style="position: absolute;right:0;top: -10px;">添加学校</el-button>
      </router-link>
    </div>
    <div style="border-bottom:1px solid #ccc;margin:20px 0;"></div>
    <div style="margin: 15px 0;width: 40%">
      <el-input
        placeholder="学校名称模糊查询"
        icon="search"
        v-model="searchTxt"
        :on-icon-click="getSchoolBySearch">
      </el-input>
      <!--<el-input placeholder="请输入内容" v-model="searchTxt">
        <el-select v-model="select" slot="prepend" placeholder="请选择" style="width: 110px;">
          <el-option label="学校名称" value="groupName"></el-option>
          &lt;!&ndash;<el-option label="学段" value="groupPeriod"></el-option>&ndash;&gt;
        </el-select>
        <el-button slot="append" icon="search" @click="getSchoolBySearch()"></el-button>
      </el-input>-->
      <!--{{searchTxt}}-->
    </div>
    <el-table :data="schoolData.list?schoolData.list:[]" border :key="">
      <el-table-column type="index" label="序号" width="100">
      </el-table-column>
      <el-table-column prop="groupName" label="学校名称" >
      </el-table-column>
      <el-table-column prop="schoolmaster" label="管理员账号" >
        <template scope="scope">
          <span v-if="scope.row.schoolmaster">{{scope.row.schoolmaster.userAccount}}</span>
          <span v-else="">--</span>
        </template>
      </el-table-column>
      <el-table-column prop="groupAddress" label="地址" >
        <template scope="scope">
            <span>{{scope.row.groupAreaProvinceName}}{{scope.row.groupAreaCityName}}
              {{scope.row.groupAreaDistrictName}}{{scope.row.groupAddress}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="groupPeriod" label="使用学段" >
        <template scope="scope">
            <span v-for="group in scope.row.groupPeriod"><el-tag type="primary" style="margin-right:4px;">{{group}}</el-tag></span>
        </template>
      </el-table-column>
      <!--<el-table-column prop="groupMaterial" label="教材版本" >
        <template scope="scope">
          <router-link :to="{path:'/textbookVersion'}"><el-button size="small">管理版本</el-button></router-link>
        </template>
      </el-table-column>-->
      <el-table-column prop="groupCreateDate" label="创建时间" sortable :formatter="formatter">
      </el-table-column>
      <el-table-column label="操作">
        <template scope="scope">
          <router-link :to="{path:'/textbookVersion',query:{groupId:scope.row.groupId}}"><el-button size="small">编辑</el-button></router-link>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="schoolData.total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        schoolData:[] ,//初始化学校列表
        currentPage:1,//当前页
        pageSize:10,//每页显示多少条
        total:0,//总数据条数

        searchTxt:'',//搜索文本
        select:'',//选择搜索字段
      }
    },
    mounted(){
      this.$nextTick(function(){
        this.schoolManagerList();
      })
    },
    methods: {
      //学校列表
      schoolManagerList(){
        let param = {
          "pageNum": this.currentPage,
          "pageSize": this.pageSize,
        }
        this.getSchoolList(param);
      },
      getSchoolBySearch(){
        let param = {
          "pageNum": this.currentPage,
          "pageSize": this.pageSize,
        }
        if(this.searchTxt){
          param.groupName = this.searchTxt
        }
        /*switch (this.select){
          case "groupName":
            param.groupName = this.searchTxt
            break;
          case "groupPeriod":
            param.groupPeriod = this.searchTxt
            break;
        }*/
        this.getSchoolList(param);
      },
      getSchoolList(param){
        this.$http.post(this.rootUrl + 'groupManager/schoolManagerList?requestId=' + Math.random(),param).then((res) => {
          this.schoolData= res.body.result;
          if(this.schoolData == null){
            this.schoolData = {}
            this.schoolData.list = []
            this.schoolData.total = 0
          }
        });
      },

      handleSizeChange(val) {
        this.pageSize = val;
        this.schoolManagerList();
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        this.schoolManagerList();
      },

      formatter(row, column) {
        return this.fTime(row.groupCreateDate)
      },
      filterTag(value, row) {
        return row.tag === value;
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
  }
  .comflter-p-span{

  }
</style>
