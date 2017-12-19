<template>
  <el-table
    :data="tableData"
    border
  >
    <el-table-column
      prop="diagnosisName"
      label="考试名称"
      >
    </el-table-column>
    <el-table-column
      prop="startTime"
      label="开始时间"
      >
      <template scope="scope">
        {{scope.row.startTime | time }}
      </template>
    </el-table-column>
    <el-table-column
      prop="endTime"
      label="结束时间">
      <template scope="scope">
        {{scope.row.endTime | time }}
      </template>
    </el-table-column>
    <el-table-column

      label="操作">
      <template scope="scope">
        <el-button @click="$emit('row-click',scope.$index,scope.row)">判卷</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
  export default {
    data() {
      return {}
    },
    props: {
      tableData: {
        default() {
          return []
        }
      }
    }
  }
</script>
