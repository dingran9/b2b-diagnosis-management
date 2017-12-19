<template>
  <div style="padding:30px 20px;background:#fff;">

    <router-link :to="{path:'/addQuyuliankao'}" >
      <el-button type="primary" class="ge-pull-right">添加区域联考</el-button>
    </router-link>

    <el-table :data="tableData" border style="width: 100%;margin-top: 20px">
      <el-table-column type="index" label="序号" width="105">
      </el-table-column>
      <el-table-column type="teacherName" label="创建人" width="120">
        <template scope="scope">
          <span>{{ scope.row.teacherName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="diagnosisName" label="试卷名称" width="400">
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间">
        <template scope="scope">
          <span>{{ scope.row.createTime | time}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="startTime" label="开始时间">
        <template scope="scope">
          <span>{{ scope.row.startTime | time}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="endTime" label="结束时间">
        <template scope="scope">
          <span>{{ scope.row.endTime | time}}</span>
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
        layout="total, prev, pager, next, jumper"
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
        tableData: [],
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
      getList() {  //区域联考列表
        this.$ajax.areaExamList({
//          "groupAreaDistrictId": JSON.parse(localStorage.getItem('Userinfo')).groupAreaDistrictId,
          "pageNum": this.currentPage,
          "pageSize": this.currentPageSize,
          "examScope": 4,
          examYear:null
        }).then(({code,httpCode,result}) => {
          if (code == 'Success' && httpCode == '200') {
            this.tableData = result.list;
            this.dataTotal = result.total;
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
  .addU-i {
    width: 300px;
  }
</style>
