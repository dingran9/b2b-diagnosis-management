<template>
  <div>
    <div class="crumbs" style="position: relative">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-menu"></i> app版本管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <hr>
    <div class="appMange">
      <p class="appMange-p">
        <span class="appMange-p-span">APP类型:</span>
        <el-radio-group v-model="radioValue" @change="getAppList()">
        <el-radio  v-for="(item,index) in radioList" :key = 'item.code' class="radio"  v-bind:label=item.code  >{{item.name}}</el-radio>
        </el-radio-group>
      </p>
      <hr>
    </div>
    <el-button type="primary" icon="plus" style="margin-bottom: 15px" @click="$router.push('/addAndroidApp')">更新app</el-button>
    <el-table :data="applist" border  style="width: 100%">
      <el-table-column type="index" label="序号" width="105">
      </el-table-column>
      <el-table-column prop="appName" label="名称" >
      </el-table-column>
      <el-table-column prop="appVersion" label="版本" >
      </el-table-column>
      <el-table-column prop="available" label="是否可用" >
        <template scope="scope">
          <el-tag type='success' v-if="scope.row.available === '1'">可用</el-tag>
          <el-tag type='primary' v-else>不可用</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="necessary" label="是否强制" >
        <template scope="scope">
          <el-tag type='primary' v-if="scope.row.necessary === '1'">强制</el-tag>
          <el-tag type='success' v-else>不强制</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="提交时间" >
      </el-table-column>
      <el-table-column prop="downUrl" label="下载链接" width="400">
      </el-table-column>
      <el-table-column prop="appDescribe" label="描述" >
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
  export default {
    data() {
      return {
        radioList:[
          {code:1,name:'学生'},
          {code:2,name:'教师'},
          {code:3,name:'校长'}
        ],
        radioValue:1,
        applist:[],
        currentPage: 1,
        currentRootPageSize: 10,
        currentPageSize: 10,
        dataTotal: 0
      }
    },
    mounted: function () {
        this.getAppList()
    },
    methods: {
        // 获取app列表
      getAppList(){
        // 获取

        this.$http.post(this.rootUrl + 'diagnosis/app/updateApk?requestId=123', {
          "type": this.radioValue,
          "available": "2"
        }).then((res) => {
          if(res.body.code == 'Success'&&res.body.httpCode == '200'){
            this.applist=res.body.result.list;
            this.dataTotal=res.body.result.total;
          }
        }, (res) => {
          console.log(res);
        });
      },
      // 分页时间
      handleSizeChange(val) {
        this.currentPageSize = val
        this.getAppList()
      },
      handleCurrentChange(val) {
        this.currentPage = val
        this.getAppList()
      },

    },
  }
</script>
<style>
  .appMange {
    margin: 15px 0;
  }
  .appMange-p {
    margin: 15px 0;
    padding-left: 100px;
    position: relative;
  }
  .appMange-p-span{
    position: absolute;
    top: 0;
    left: 0;
  }
</style>
