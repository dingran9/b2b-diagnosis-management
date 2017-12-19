<!-- 布局 --> 
<template>
  <!--根部视图-->
  <div>

    <div class="report-item">
      <div class="report-header">
        单元检测
      </div>
      <div class="report-body">
        <p style="margin-left: 0" class="p_style">选择学年:&nbsp; </p>
        <template>
          <el-select v-model="submitS.learnYear" placeholder="请选择" @change="learnYearSeleted">
            <el-option
              v-for="item in learnYearS"
              :key="item.value"
              :label="item.content"
              :value="item.value">
            </el-option>
          </el-select>
        </template>

        <p class="p_style">选择年级:&nbsp; </p>
        <template>
          <el-select v-model="submitS.grade" placeholder="请选择" @change="gradeSeleted">
            <el-option
              v-for="item in gradeS"
              :key="item.groupId"
              :label="item.groupName"
              :value="item">
            </el-option>
          </el-select>
        </template>

        <p class="p_style">选择学科:&nbsp; </p>
        <template>
          <el-select v-model="submitS.subject" placeholder="请选择" @change="disciplineSeleted">
            <el-option
              v-for="item in subjectS"
              :key="item.subjectId"
              :label="item.subjectName"
              :value="item">
            </el-option>
          </el-select>
        </template>

        <p class="p_style">选择老师:&nbsp; </p>
        <template>
          <el-select v-model="submitS.teacher" placeholder="请选择" @change="teacherSeleted">
            <el-option
              v-for="item in teacherS"
              :key="item.userId"
              :label="item.userName"
              :value="item">
            </el-option>
          </el-select>
        </template>

      </div>

    </div>

  </div>
   

</template>

  <!-- vue -->
<script>

  import {getUser} from '../../../config/utils'

  export default {
    data() {

      return {
        learnYearS: [],
        gradeS: [],
        subjectS: [],
        teacherS: [],
        submitS: {
          learnYear: '',
          grade: '',
          subject: '',
          teacher: ''
        },

      }

    },

    mounted() {

      this.getAcademicYear()

      this.getGradeListS()

    },

    methods: {
      /// 构造学年数据
      getAcademicYear() {
        var year = 2014
        for (var i = 0; i < 16; i++) {
          year++
          this.learnYearS.push({"content": year + "上半年", "value": year + '1'})
          this.learnYearS.push({"content": year + "下半年", "value": year + '2'})
        }
  /*      this.learnYearS =  [
          {value:2016,content:"2015~2016学年"},
          {value:2017,content:"2016~2017学年"},
          {value:2018,content:"2017~2018学年"},
          {value:2019,content:"2018~2019学年"},
          {value:2020,content:"2019~2012学年"},
          {value:2021,content:"2020~2021学年"},
        ]*/
      },

      /// 获取所有年级
      getGradeListS() {

        let params = {"groupId": getUser().userSchoolId}
        var url = this.rootUrl + 'groupManager/getGradeList?requestId=123';
        this.$http.post(url, params)
          .then(res => {
            if (res.body.message == "Success") {
              this.gradeS = res.body.result
              this.gradeS.sort((a, b) => {
                return a.groupId - b.groupId
              })
            }
          }, res => {
            console.log(res)
          });
      },

      /// 获取学科
      getSubjectByGradeId() {

        let params = {
          "groupIden": this.submitS.grade.groupIden,
          "groupParentId": this.submitS.grade.groupParentId
        }
        var url = this.rootUrl + 'groupManager/getSubjectByGradeId?requestId=123';
        this.$http.post(url, params)
          .then(res => {
            if (res.body.message == "Success") {
              this.subjectS = res.body.result
            }
          }, res => {
            console.log(res)
          })
      },

      /// 获取教师
      getTeacherManagerList() {

        var params = {
          "pageNum": 1,
          "pageSize": 10000,
          "userSchoolId": getUser().userSchoolId,
          "userGradeIden": this.submitS.grade.groupIden,
          "userSubjectIden": this.submitS.subject.subjectIden
        }

        var url = this.rootUrl + 'userManager/getTeacherManagerList?requestId=123';

        this.$http.post(url, params)
          .then(res => {

            if (res.body.message == "Success") {

              this.teacherS = res.body.result.list

            }

          }, res => {

            console.log(res)

          });

      },

      /// 学年数据改变
      learnYearSeleted() {

        this.requestParameters()

      },

      /// 年级数据改变
      gradeSeleted() {
        this.submitS.teacher = ''
        this.submitS.subject = ''
        this.teacherS = []
        this.subjectS = []
        this.getSubjectByGradeId()
        this.requestParameters()
      },

      /// 学科数据改变
      disciplineSeleted() {
        this.submitS.teacher = ''
        this.teacherS = []
        this.getTeacherManagerList()
        this.requestParameters()
      },

      /// 教师数据改变
      teacherSeleted() {
        this.requestParameters()
      },

      /// 向父视图传参数
      requestParameters() {

        this.$emit('requestParameters',this.submitS.learnYear,this.submitS.grade,this.submitS.subject,this.submitS.teacher)

      }

    }

  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
  @import "~static/css/diagnosticReport.scss";

  .p_style {
    margin-left: 30px;
    display: inline-block;
  }

  .el-input__inner {
    width: 150px;
  }

</style>

