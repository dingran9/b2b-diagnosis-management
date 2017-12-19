<template>
  <el-form :inline="true" :model="formInline" class="demo-form-inline">
    <div v-for="item in [1,2,3,4,5,6,7,8,9]">
      <el-button type="primary">{{item}}年级</el-button>
      <el-form-item label="数学:">
        <el-select  placeholder="人教版" v-model="name">
          <el-option label="人教版" value="shanghai"></el-option>
          <el-option label="苏教版" value="beijing"></el-option>
          <el-option label="北师大版" value="tainjing"></el-option>
          <el-option label="新课标版" value=" df"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="语文:">
        <el-select  placeholder="人教版">
          <el-option label="人教版" value="shanghai"></el-option>
          <el-option label="苏教版" value="beijing"></el-option>
          <el-option label="北师大版" value="drf"></el-option>
          <el-option label="新课标版" value="sdf"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="英语:">
        <el-select  placeholder="人教版">
          <el-option label="人教版" value="shanghai"></el-option>
          <el-option label="苏教版" value="beijing"></el-option>
          <el-option label="北师大版" value="beijing"></el-option>
          <el-option label="新课标版" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <div v-if="item >= 7">
        <el-form-item style="margin-left:70px;" label="化学:">
          <el-select  placeholder="人教版" v-model="name">
            <el-option label="人教版" value="shanghai"></el-option>
            <el-option label="苏教版" value="beijing"></el-option>
            <el-option label="北师大版" value="tainjing"></el-option>
            <el-option label="新课标版" value=" df"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="物理:">
          <el-select  placeholder="人教版">
            <el-option label="人教版" value="shanghai"></el-option>
            <el-option label="苏教版" value="beijing"></el-option>
            <el-option label="北师大版" value="drf"></el-option>
            <el-option label="新课标版" value="sdf"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="生物:">
          <el-select  placeholder="人教版">
            <el-option label="人教版" value="shanghai"></el-option>
            <el-option label="苏教版" value="beijing"></el-option>
            <el-option label="北师大版" value="beijing"></el-option>
            <el-option label="新课标版" value="beijing"></el-option>
          </el-select>
        </el-form-item>
      </div>

    </div>
    <div class="text-center">
      <el-form-item >
        <el-button type="primary" @click="onSubmit">确定</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </div>

  </el-form>

</template>
<script>
  export default {
    data() {
      return {
        formInline: {
          user: '',
          region: ''
        },
        name:'beijing'
      }
    },
    methods: {
      onSubmit() {
        console.log('submit!');
      }
    }
  }
</script>
<style>
  .text-center{
    text-align: center;
  }
</style>
