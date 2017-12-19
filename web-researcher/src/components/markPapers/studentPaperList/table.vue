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
      prop="studentName"
      label="学生姓名"
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
      label="状态">
      <template scope="scope">
        {{scope.row.markStatus ? "已判卷" : "未判卷"}}
      </template>
    </el-table-column>
    <el-table-column

      label="操作">
      <template scope="scope">
        <el-button
          v-if="scope.row.markStatus == 0"
          @click="$emit('mark-paper',scope.$index,scope.row)">判卷</el-button>
        <el-button
          v-else
          @click="$emit('watch-paper',scope.$index,scope.row)">查看</el-button>
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
