<template>
  <div>
    <div class="crumbs" style="position: relative">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-menu"></i> 教师管理</el-breadcrumb-item>
        <!--<el-breadcrumb-item>学校列表</el-breadcrumb-item>-->
      </el-breadcrumb>
      <router-link :to="{path:'/addPaper'}">
        <el-button type="primary" style="position: absolute;right:200px;top: -10px;">+新增用户</el-button>
      </router-link><router-link :to="{path:'/addPaper'}">
      <el-button type="primary" style="position: absolute;right:100px;top: -10px;">批量导入</el-button>
    </router-link>

      <router-link :to="{path:'/addPaper'}">
        <el-button type="primary" style="position: absolute;right:0;top: -10px;">添加试卷</el-button>
      </router-link>
    </div>
    <hr>
    <div class="comflter">
      <p class="comflter-p">
        <span class="comflter-p-span">年级:</span>
        <el-radio class="radio" v-model="radio" label="1">一年级</el-radio>
        <el-radio class="radio" v-model="radio" label="2">二年级</el-radio>
        <el-radio class="radio" v-model="radio" label="3">三年级</el-radio>
        <el-radio class="radio" v-model="radio" label="4">四年级</el-radio>
        <el-radio class="radio" v-model="radio" label="5">五年级</el-radio>
        <el-radio class="radio" v-model="radio" label="6">六年级</el-radio>
        <el-radio class="radio" v-model="radio" label="7">七年级</el-radio>
        <el-radio class="radio" v-model="radio" label="2">八年级</el-radio>
        <el-radio class="radio" v-model="radio" label="2">九年级</el-radio>
        <el-radio class="radio" v-model="radio" label="2">高一</el-radio>
        <el-radio class="radio" v-model="radio" label="2">高二</el-radio>
        <el-radio class="radio" v-model="radio" label="2">高三</el-radio>
      </p>
      <p class="comflter-p">
        <span class="comflter-p-span">学科:</span>
        <el-radio class="radio" v-model="radio" label="1">语文</el-radio>
        <el-radio class="radio" v-model="radio" label="2">数学</el-radio>
        <el-radio class="radio" v-model="radio" label="3">英语</el-radio>
        <el-radio class="radio" v-model="radio" label="4">物理</el-radio>
        <el-radio class="radio" v-model="radio" label="5">化学</el-radio>
        <el-radio class="radio" v-model="radio" label="6">生物</el-radio>
        <el-radio class="radio" v-model="radio" label="7">历史</el-radio>
        <el-radio class="radio" v-model="radio" label="2">地理</el-radio>
        <el-radio class="radio" v-model="radio" label="2">政治</el-radio>
      </p>
      <p class="comflter-p">
        <span class="comflter-p-span">教材:</span>
        <el-radio class="radio" v-model="radio" label="1">人教版</el-radio>
        <el-radio class="radio" v-model="radio" label="2">苏教版</el-radio>
        <el-radio class="radio" v-model="radio" label="3">北师大版</el-radio>
        <el-radio class="radio" v-model="radio" label="4">沪教版</el-radio>
      </p>
      <p class="comflter-p">
        <span class="comflter-p-span">单元:</span>
        <el-radio class="radio" v-model="radio" label="1">第一章</el-radio>
        <el-radio class="radio" v-model="radio" label="2">第2章</el-radio>
        <el-radio class="radio" v-model="radio" label="3">第3章</el-radio>
        <el-radio class="radio" v-model="radio" label="4">第4章</el-radio>
      </p>
    </div>
    <hr>
    <div style="margin: 15px 0;width: 40%">
      <el-input placeholder="请输入内容" v-model="input5">
        <el-select v-model="select" slot="prepend" placeholder="请选择" style="width: 110px;">
          <el-option label="餐厅名" value="1"></el-option>
          <el-option label="订单号" value="2"></el-option>
          <el-option label="用户电话" value="3"></el-option>
        </el-select>
        <el-button slot="append" icon="search"></el-button>
      </el-input>
    </div>
    <el-table :data="tableData" border  style="width: 100%">
      <el-table-column type="index" label="序号" >
      </el-table-column>
      <el-table-column prop="name" label="名称" >
      </el-table-column>
      <el-table-column prop="date" label="创建日期" sortable>
      </el-table-column>
      <el-table-column prop="name" label="年级" >
      </el-table-column>
      <el-table-column prop="name" label="学科" >
      </el-table-column>
      <el-table-column prop="name" label="教材版本" >
      </el-table-column>
      <el-table-column prop="name" label="作者" >
      </el-table-column>
      <el-table-column prop="name" label="题目数量" >
      </el-table-column>
      <!--<el-table-column prop="address" label="地址" :formatter="formatter">-->
      <!--</el-table-column>-->
      <!--<el-table-column prop="tag" label="标签" width="120"-->
      <!--:filters="[{ text: '家', value: '家' }, { text: '公司', value: '公司' }]"-->
      <!--:filter-method="filterTag">-->
      <!--<template scope="scope">-->
      <!--<el-tag :type="scope.row.tag === '家' ? 'primary' : 'success'" close-transition>{{scope.row.tag}}-->
      <!--</el-tag>-->
      <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column label="操作">
        <template scope="scope">
          <el-button size="small"
                     @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="small" type="danger"
                     @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        layout="prev, pager, next"
        :total="1000">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        radio: '1',
        radio3: '上海',
        tableData: [
          {
            date: '2017-02-02',
            name: '小天才',
            address: '东莞市长安镇步步高大道18号',
            tag: '家'
          }, {
            date: '2017-02-04',
            name: '小天才',
            address: '东莞市长安镇步步高大道17号',
            tag: '公司'
          }, {
            date: '2017-02-01',
            name: '小天才',
            address: '东莞市长安镇步步高大道19号',
            tag: '家'
          }, {
            date: '2017-02-04',
            name: '小天才',
            address: '东莞市长安镇步步高大道17号',
            tag: '公司'
          }, {
            date: '2017-02-01',
            name: '小天才',
            address: '东莞市长安镇步步高大道19号',
            tag: '家'
          }, {
            date: '2017-02-03',
            name: '小天才',
            address: '东莞市长安镇步步高大道16号',
            tag: '公司'
          }, {
            date: '2017-02-04',
            name: '小天才',
            address: '东莞市长安镇步步高大道17号',
            tag: '公司'
          }, {
            date: '2017-02-01',
            name: '小天才',
            address: '东莞市长安镇步步高大道19号',
            tag: '家'
          }, {
            date: '2017-02-03',
            name: '小天才',
            address: '东莞市长安镇步步高大道16号',
            tag: '公司'
          }]
      }
    },
    methods: {
      formatter(row, column) {
        return row.address;
      },
      filterTag(value, row) {
        return row.tag === value;
      },
      handleEdit(index, row) {
        this.$message('编辑第'+(index+1)+'行');
      },
      handleDelete(index, row) {
        this.$message.error('删除第'+(index+1)+'行');
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
  }
  .comflter-p-span{

  }
</style>
