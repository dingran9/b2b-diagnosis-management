<template>
  <div class="syncCoach choose-wrap">
    <!--同步辅导，选择学科下拉列表el-select-->
    <section class="header">
      <div class="title">
        创建单元进度
        <span class="create" @click="dialogVisible = true">创建进度</span>
      </div>
    </section>
    <div class="filterSearch">
      <el-form ref="form" :model="form" :inline="true" style="text-align: left;margin-left: 40px;">
        <el-form-item label="学年">
          <el-select v-model="form.year" placeholder="请选择学年">
            <el-option :label="y.year" :value="y.id" v-for="y in yearOptions" :key="y.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="年级">
          <el-select v-model="form.grond" placeholder="请选择年级" @change="getVersion(form)">
            <div v-if="userStage.includes('1')">
              <el-option label="一年级" value="11"></el-option>
              <el-option label="二年级" value="12"></el-option>
              <el-option label="三年级" value="13"></el-option>
              <el-option label="四年级" value="14"></el-option>
              <el-option label="五年级" value="15"></el-option>
              <el-option label="六年级" value="16"></el-option>
            </div>
            <div v-if="userStage.includes('2')">
              <el-option label="初一" value="21"></el-option>
              <el-option label="初二" value="22"></el-option>
              <el-option label="初三" value="23"></el-option>
            </div>
            <div v-if="userStage.includes('3')">
              <el-option label="高一" value="31"></el-option>
              <el-option label="高二" value="32"></el-option>
              <el-option label="高三" value="33"></el-option>
            </div>
          </el-select>
        </el-form-item>
        <el-form-item label="教材版本">
          <el-select v-model="form.version" placeholder="请选择教材版本" @change="huoqushangxiace(form)">
            <el-option v-for="item in bookVerison" :label="item.book_type" :value="item.ctb_code"
                       :key="item.ctb_code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="学期">
          <el-select v-model="form.xueqi" placeholder="请选择学期">
            <el-option label="上册" value="1"></el-option>
            <el-option label="下册" value="2"></el-option>
          </el-select>
        </el-form-item>
        <span class="search" @click="searchList(form,form.year+form.xueqi)">查询</span>
      </el-form>
      <el-table :data="tableData" border style="margin-left: 40px;max-width: 1145px">
        <el-table-column prop="unitName" label="单元名称" width="400">
        </el-table-column>
        <el-table-column prop="startDate" label="开始时间">
          <template scope="scope">
            <span v-if="scope.row.startDate">{{scope.row.startDate|times}}</span>
            <span v-else>待设置</span>
          </template>
        </el-table-column>
        <el-table-column prop="endDate" label="结束时间">
          <template scope="scope">
            <span v-if="scope.row.endDate">{{scope.row.endDate|times}}</span>
            <span v-else>待设置</span>
          </template>
        </el-table-column>
        <el-table-column type="index" label="修改时间" width="105">
          <template scope="scope">
            <el-button size="small"
                       @click="handleEdit(scope.$index, scope.row)">编辑
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      title="创建单元进度"
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      size="tiny">
      <el-form label-position="right" ref="form" :model="form1" label-width="80px" style="text-align: left;margin-left: 40px;" v-show="!next">
        <el-form-item label="学年" class="add-form-input">
          <el-select v-model="form.year" placeholder="请选择学年">
            <el-option :label="y.year" :value="y.id" v-for="y in yearOptions" :key="y.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="年级" class="add-form-input">
          <el-select v-model="form1.grond" placeholder="请选择年级" @change="getVersion(form1)">
            <div v-if="userStage.includes('1')">
              <el-option label="一年级" value="11"></el-option>
              <el-option label="二年级" value="12"></el-option>
              <el-option label="三年级" value="13"></el-option>
              <el-option label="四年级" value="14"></el-option>
              <el-option label="五年级" value="15"></el-option>
              <el-option label="六年级" value="16"></el-option>
            </div>
            <div v-if="userStage.includes('2')">
              <el-option label="初一" value="21"></el-option>
              <el-option label="初二" value="22"></el-option>
              <el-option label="初三" value="23"></el-option>
            </div>
            <div v-if="userStage.includes('3')">
              <el-option label="高一" value="31"></el-option>
              <el-option label="高二" value="32"></el-option>
              <el-option label="高三" value="33"></el-option>
            </div>
          </el-select>
        </el-form-item>
        <el-form-item label="教材版本" class="add-form-input">
          <el-select v-model="form1.version" placeholder="请选择教材版本" @change="huoqushangxiace(form1)">
            <el-option v-for="item in bookVerison" :label="item.book_type" :value="item.ctb_code" :key="item.ctb_code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="学期" class="add-form-input">
          <el-select v-model="form1.xueqi" placeholder="请选择学期" @change="getUnit(form1)">
            <el-option v-for="(item, index) in shagnxiace" :label="item.name" :value="item.code+index" :key="item.code"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <ul v-show="next">
        <li v-for="item in unitList" style="margin-bottom: 10px"><span style="display:inline-block;width: 150px;vertical-align: middle;">{{item.unitName}}</span>
          <el-date-picker
          v-model="item.time"
          type="daterange"
          range-separator="至"
          :picker-options="pickerOptions"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker></li>
      </ul>
      <span slot="footer" class="dialog-footer">
            <el-button type="primary" v-show="!next" @click="checkNext()">下一步</el-button>
    <el-button type="primary" @click="creatUnit()" v-show="next">确定</el-button>
  </span>
    </el-dialog>
    <el-dialog
      title="修改日期"
      :visible.sync="dialogChangeDate"
      size="tiny">
      <el-date-picker
        v-model="time"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        :picker-options="pickerOptions"
        end-placeholder="结束日期">
      </el-date-picker>
      <el-button type="primary" @click="upUnitDate()">修改</el-button>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        yearOptions:[
          {id:2016,year:"2015~2016学年"},
          {id:2017,year:"2016~2017学年"},
          {id:2018,year:"2017~2018学年"},
          {id:2019,year:"2018~2019学年"},
          {id:2020,year:"2019~2012学年"},
          {id:2021,year:"2020~2021学年"},
        ],
        pickerOptions: {   //小于当前时间
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7;
          }
        },
        dialogVisible: false,   //创建单元模态框
        dialogChangeDate: false,   //更改单元进度模态框
        next: false,   //下一步的标识
        userStage: this.$user().get().userStage.split(','),  //学段
        bookVerison: [],   //版本信息
        shagnxiace: [],    //  上下册& 学期
        unitList: [],      //单元list
        form: {
          year: '',
          grond: '',
          version: '',
          xueqi: ''
        },   //查询form信息
        form1: {
          year: '',
          grond: '',
          version: '',
          xueqi: ''
        },   //创建form信息
        tableData:[],       //已经创建的单元列表
        time: ''
      }
    },
    mounted() {
    },
    methods: {
      //查询list
      searchList(form,semester){ //xueqi是semester,学年+学期
        if(!form.grond||!semester||!form.version){
          return this.$message('请选择筛选条件');
        }
        this.$ajax.getScheduleList({
          "pageNum":1,
          "pageSize":100,
          "semester":semester,
          "gradeCode":form.grond,
          "subjectCode":this.$user().get().userSubject,
          "bookVersion":form.version,
          "districtId":this.$user().get().userGroupAreaDistrictId
//          "operatorCode":this.$user().get().userId
        })
          .then(({httpCode, result}) => {
            if (httpCode == 200) {
              this.tableData = result.list;
            } else {
              this.$message('获取试卷列表失败,请刷新页面重试');
            }
          })
      },
      //获取教材版本
      getVersion(form){
        form.version = ''
        form.xueqi = ''
        if(!form.grond)return;
        let sendData = {
          "gradeCode":form.grond,
          "subjectCode":this.$user().get().userSubject,
        }
        this.$ajax.getBookTypeVersion(sendData)
          .then(({httpCode, result}) => {
            if (httpCode == 200) {
              this.bookVerison = result;
            } else {
              this.$message('获取试卷列表失败,请刷新页面重试');
            }
          })
      },
      //获取上下册
      huoqushangxiace(form){
        form.xueqi = ''
        if(!form.version)return;
        let sendData ={
          "gradeCode":form.grond,
          "subjectCode":this.$user().get().userSubject,
          "booktypeCode":form.version,
          "productsIds":"581c1b44f70541fc88f8658041477c6c",
          "code":"0"//固定为0
        }
        this.$ajax.getbookTypeVersionAndUnit(sendData)
          .then(({httpCode, result}) => {
            if (httpCode == 200) {
              this.shagnxiace = result;
            } else if(httpCode!="600002"){
              this.$message('获取学科列表失败,请刷新页面重试');
            }
          })
      },
      //获取资源库单元
      getUnit(form){
        if(!form.xueqi)return;
        let sendData = {
          "gradeCode":form.grond,
          "subjectCode":this.$user().get().userSubject,
          "booktypeCode":form.version,
          "productsIds":"581c1b44f70541fc88f8658041477c6c",
          "code":form.xueqi.substr(0,form.xueqi.length-1)
        }
        this.$ajax.getbookTypeVersionAndUnit(sendData)
          .then(({httpCode, result}) => {
            if (httpCode == 200) {
              let arr = []
              result.forEach((e)=>{
                arr.push({time: '',
                unitName:e.name,
                unitCode:e.code
                })
              })
              this.unitList = arr;
            } else {
              this.$message('获取试卷列表失败,请刷新页面重试');
            }
          })
      },
      //创建单元
      creatUnit(){
        let semester = this.form1.year+''+(parseInt(this.form1.xueqi.substr(this.form1.xueqi.length-1,1))+1)
        this.unitList.forEach((e,index)=>{
          e.startDate = this.getParamTime(e.time[0])
          e.endDate = this.getParamTime(e.time[1])
          e.semester = semester
          e.operatorCode = this.$user().get().userId
          e.districtId = this.$user().get().userGroupAreaDistrictId
          e.gradeCode = this.form1.grond
          e.subjectCode = this.$user().get().userSubject,
          e.bookVersion = this.form1.version
          e.sort = index+1
        })
        this.saveAndUpdateDate(this.unitList,this.form1,semester)
      },
      //更新单元时间
      upUnitDate(){
        this.unitList[0].startDate = this.getParamTime(this.time[0])
        this.unitList[0].endDate = this.getParamTime(this.time[1])
        this.saveAndUpdateDate(this.unitList,this.form,this.form.year+this.form.xueqi)
      },
      //调动接口
      saveAndUpdateDate(list,form,xueqi){
        this.$ajax.saveAndUpdateUnitSchedule({
          "diagnosisUnitSchedules": list
        })
          .then(({httpCode, result}) => {
            if (httpCode == 200) {
              this.dialogVisible = false;
              this.dialogChangeDate = false
              this.next = false
              this.searchList(form,xueqi)
            } else {
              this.$message('获取试卷列表失败,请刷新页面重试');
            }
          })
      },
      //点击编辑单元按钮
      handleEdit(index,row){
        this.dialogChangeDate = true
        this.unitList = []
        this.unitList.push(row)
      },
      //点击下一步, 检测改年级下该单元进度是否已经创建
      checkNext(){
        if(!this.form1.xueqi){
          return this.$message('请选择学期');
        }
        this.$ajax.getScheduleList({
          "pageNum":1,
          "pageSize":100,
          "semester":this.form1.year+''+(parseInt(this.form1.xueqi.substr(this.form1.xueqi.length-1,1))+1),
          "gradeCode":this.form1.grond,
          "subjectCode":this.$user().get().userSubject,
          "bookVersion":this.form1.version,
          "districtId":this.$user().get().userGroupAreaDistrictId,
//          "operatorCode":this.$user().get().userId
        })
          .then(({httpCode, result}) => {
            if (httpCode == 200) {
              if(result.list.length > 1){
                this.$message('该学期进度已经创建,请在列表修改');
                this.tableData = result.list;
                this.dialogVisible = false;
                this.form = {
                  year: '',
                  grond: '',
                  version: '',
                  xueqi: ''
                }
                this.form1 = {
                  year: '',
                  grond: '',
                  version: '',
                  xueqi: ''
                }
              }else {
                this.next = true
              }
            } else {
              this.$message('获取试卷列表失败,请刷新页面重试');
            }
          })
      },
      //模态框关闭的回调
      handleClose(){
        this.dialogVisible = false,
        this.next = false
        this.form1 = {
          year: '',
          grond: '',
          version: '',
          xueqi: ''
        }
      },
      //处理时间字符串参数
      getParamTime(time){
        if(!time)return null;
        return this.dataParse(Date.parse(new Date(time))).substr(0,10)
      }
    },
    filters: {
      times(value){
        let time = new Date(parseInt(value));

        function minTen(num) {
          return num > 9 ? num : '0' + num;
        }
        return time.getFullYear() + "-" + minTen(time.getMonth() + 1) + "-" + minTen(time.getDate()) + " ";
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import '../../../static/css/contentRight';

  .choose-wrap {
    .header {
      margin: 20px;
      margin-bottom: 0px;
      $padding-top:10px;
      background: white;
      .title {
        height: 50px;
        text-align: left;
        padding: 10px 40px;
        font-family: ﻿MicrosoftYaHei-Bold;
        font-weight: bold;
        font-size: 18px;
        color: #4c6175;
        border-bottom: 1px solid #e1e5ec;
        .create{
          float: right;
          color: white;
          background-color: #50ced9;
          width: 110px;
          height: 35px;
          line-height: 35px;
          text-align: center;
          border-radius: 20px;
          margin-top: -3px;
          cursor: pointer;
        }
      }
    }
    .filterSearch{
      margin: 20px;
      margin-bottom: 0px;
      background: white;
      padding-top: 14px;
      .search{
        display: inline-block;
        color: white;
        background-color: #50ced9;
        width: 110px;
        height: 35px;
        line-height: 35px;
        text-align: center;
        border-radius: 20px;
        cursor: pointer;
      }
    }
  }
  .add-form-input{
    width: 340px;
    margin: 0 auto;
    margin-bottom: 22px;
  }
  .el-input__inner:focus,.el-input__inner:hover {
    border-color: #50ced9!important;
    color: #50ced9!important;
  }
  .el-select-dropdown__item.selected.hover,.el-select-dropdown__item.selected {
    background-color: #50ced9;
  }
  .el-table::after{
    width: 0px;
  }
  .el-table{
    border: 0px;
  }
  .el-table tr,.el-table th,.el-table__header-wrapper thead div {
    background-color: #CFE8F5;
    color: #48576A
  }
  .el-button--primary,.el-button--primary:focus, .el-button--primary:hover {
    color: #fff;
    background-color: #50ced9;
    border-color: #50ced9;
  }
  .el-table th {
    text-align: center;
  }
  .el-button:focus, .el-button:hover {
    border-color: #50ced9!important;
  }
</style>

