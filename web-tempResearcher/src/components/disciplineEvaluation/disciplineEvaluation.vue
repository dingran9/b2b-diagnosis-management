<template>
  <div class="syncCoach choose-wrap">
    <!--同步辅导，选择学科下拉列表el-select-->
    <section class="header">
      <div class="title">
        全区考
      </div>
    </section>
    <div class="filterSearch">
      <el-form ref="form" :model="form" :inline="true" style="text-align: left;margin-left: 40px;">
        <el-form-item label="学年">
          <el-select v-model="form.year" placeholder="请选择学年">
            <el-option :label="y.year" :value="y.id" v-for="y in yearOptions" :key="y.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="学科" v-if="this.user.userType == 7">
          <el-select v-model="form.subject" placeholder="请选择学科">
            <el-option :label="item.subject" :value="item.id" v-for="item in subjectOptions" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="年级">
          <el-select v-model="form.grond" placeholder="请选择年级">
            <template v-if="user.userType == 7 || userStage.includes('1')">
              <el-option label="一年级" value="11"></el-option>
              <el-option label="二年级" value="12"></el-option>
              <el-option label="三年级" value="13"></el-option>
              <el-option label="四年级" value="14"></el-option>
              <el-option label="五年级" value="15"></el-option>
              <el-option label="六年级" value="16"></el-option>
            </template>
            <template v-if="user.userType == 7 || userStage.includes('2')">
              <el-option label="初一" value="21"></el-option>
              <el-option label="初二" value="22"></el-option>
              <el-option label="初三" value="23"></el-option>
            </template>
            <template v-if="user.userType == 7 || userStage.includes('3')">
              <el-option label="高一" value="31"></el-option>
              <el-option label="高二" value="32"></el-option>
              <el-option label="高三" value="33"></el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="学期">
          <el-select v-model="form.xueqi" placeholder="请选择学期">
            <el-option label="上册" value="1"></el-option>
            <el-option label="下册" value="2"></el-option>
          </el-select>
        </el-form-item>
        <span class="search" @click="searchList()">查询</span>
      </el-form>
      <div style="padding:0 40px;" v-if="false">
        <el-table :data="tableData" border>
          <el-table-column type="index" label="序号" width="105">
          </el-table-column>
          <el-table-column prop="unitName" label="单元名称" width="400">
          </el-table-column>
          <el-table-column prop="startDate" label="开始时间">
          </el-table-column>
          <el-table-column prop="endDate" label="结束时间">
          </el-table-column>
        </el-table>

      </div>

    </div>
    <div class="" style="margin:10px;text-align:left;">
      <div class="ge-card-1" v-for="(cellData,index) in options">
        <div class="ge-header">
          {{dateParse(cellData.startTime)}}
        </div>
        <div class="ge-body">
          {{cellData.diagnosisName}}
        </div>
        <div class="ge-btn" @click="watchReport(cellData,index)" :class="cellData.isSnapshot ? '' : 'disable'">测评报告
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import card from "./reportItemFofMaster.vue"

  export default {
    components: {card},
    data() {
      return {
        userStage: this.$user().get().userStage.split(','),
        options: [],
        subjectOptions:[
          {id:1,subject:"语文"},
          {id:2,subject:"数学"},
          {id:3,subject:"英语"},
          {id:4,subject:"物理"},
          {id:5,subject:"化学"},
          {id:6,subject:"生物"},
          {id:7,subject:"历史"},
          {id:8,subject:"地理"},
          {id:9,subject:"政治"},
        ],
        yearOptions:[
          {id:2016,year:"2015~2016学年"},
          {id:2017,year:"2016~2017学年"},
          {id:2018,year:"2017~2018学年"},
          {id:2019,year:"2018~2019学年"},
          {id:2020,year:"2019~2012学年"},
          {id:2021,year:"2020~2021学年"},
        ],
        form: {
          year: '',
          grond: '',
          subject: '',
          version: '',
          xueqi: '',
          unit: ''
        },
        user: null
      }
    },
    mounted() {
      this.user = this.$user().get();
    },
    methods: {
      searchList() {
        let {form} = this;
        if (!form.year) {
          this.$message('请选择学年');
          return;
        }
        if(this.user.userType == 7 && !form.subject){
          this.$message('请选择学科');
          return;
        }
        if (!form.grond) {
          this.$message('请选择年级');
          return;
        }
        if (!form.xueqi) {
          this.$message('请选择学期');
          return;
        }
        this.localData.set('unit', form);
        this.getTestList();
      },
      getTestList() {
        let {form} = this;
        console.log(form);
        let param = {
          gradeCode: form.grond,
          examYear: form.year + '' + form.xueqi
        }
        if(this.user.userType == 7) param.subjectCode = form.subject;
        this.$ajax.areaExamList(param)
          .then(({result, httpCode}) => {
            this.$set(this, 'options', []);
            if (httpCode == 200 && Array.isArray(result.list) && result.list.length) {
              this.$set(this, 'options', result.list);
            } else {
              this.$message('测评报告列表为空');
            }
          })
      },
      watchReport(cellData, index) {
        if (!cellData.isSnapshot) return;
        this.localData.set('allArea', Object.assign(cellData, this.form));

        this.localData.set('reportType', '2');
        if(this.user.userType == 7){
          this.localData.set('reportSubject', this.form.subject)
        };
        setTimeout(() => {
          //跳转延时  防止local读写太慢 引起的bug
          this.$router.push({
            path: '/showData/reportDetailsTotal/classZhiliang',
          })
        }, 100);

      }
    }
  }
</script>
<style lang="scss" scoped>
  @import '../../../static/css/contentRight';

  .choose-wrap {
    .header {
      margin:10px  20px;
      margin-bottom: 0px;
      $padding-top: 10px;
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
        .create {
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
    .filterSearch {
      margin:0 20px;
      margin-bottom: 0px;
      background: white;
      padding-top: 14px;
      .search {
        float: right;
        display: inline-block;
        margin-right: 30px;
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

  .add-form-input {
    width: 340px;
    margin: 0 auto;
    margin-bottom: 22px;
  }

  .el-input__inner:focus, .el-input__inner:hover {
    border-color: #50ced9 !important;
  }

  .el-select-dropdown__item.selected.hover, .el-select-dropdown__item.selected {
    background-color: #50ced9;
  }

  .el-table::after {
    width: 0px;
  }

  .el-table {
    border: 0px;
  }

  .el-table tr, .el-table th, .el-table__header-wrapper thead div {
    background-color: #CFE8F5;
    color: #48576A
  }

  .el-button--primary, .el-button--primary:focus, .el-button--primary:hover {
    color: #fff;
    background-color: #50ced9;
    border-color: #50ced9;
  }
</style>
<style lang="scss" scoped>
  .ge-card-1 {
    text-align: center;
    width: 360px;
    height: 210px;
    background: #fff;
    $pad: 40px;
    display: inline-block;
    margin: {
      bottom: 50px;
      right: 30px;
    }
    box-shadow: 0px 0px 20px 0px rgba(39, 113, 170, 0.23);
    > .ge-header {
      padding: 0 $pad;
      $h: 60px;
      line-height: $h;
      height: $h;
      border: {
        bottom: 1px solid rgba(225, 229, 236, 1);
      }
    }
    > .ge-body {

      color: #505050;
      line-height: 32px;
      padding: 30px $pad;
      overflow: hidden; /*自动隐藏文字*/
      text-overflow: ellipsis; /*文字隐藏后添加省略号*/
      white-space: nowrap; /*强制不换行*/
      -ms-text-overflow: ellipsis;
    }
    > .ge-btn {
      &.disable {
        background: #e1e5ec;
        box-shadow: 0.4px 6px 10px 0px #e1e5ec;
      }
      cursor: pointer;
      $h: 40px;
      width: 141px;
      height: $h;
      line-height: $h;
      display: block;
      margin: auto;
      color: #ffffff;
      font-size: 18px;
      background-image: linear-gradient(-87deg,
        rgba(123, 203, 229, 1) 0%,
        rgba(80, 206, 217, 1) 100%),
      linear-gradient(
          rgba(80, 206, 217, 1),
          rgba(80, 206, 217, 1));
      background-blend-mode: normal,
      normal;
      box-shadow: 0.4px 6px 10px 0px rgba(39, 144, 170, 0.4);
      border-radius: 20px 20px 20px 20px;
    }
  }
</style>

<style lang="scss">
  @import '../../../static/css/contentRight';

  .disciplineEvaluation {
    .header {
      margin: 20px;
      margin-bottom: 0px;
      .title {
        overflow: hidden;
        margin-top: 20px;
        /*margin-left:18px;*/
        box-sizing: border-box;
        padding: 10px 40px;
        background: white;
        border-bottom: 1px solid #e1e5ec;
        span {
          color: #000000;
          font-size: 18px;
          float: left;
          display: inline-block;
          height: 40px;
          line-height: 40px;
        }
        button {
          float: right;
          width: 143px;
          height: 40px;
          border-radius: 20px;
          font-size: 18px;
          color: #fff;
          background: #1fd094;
          outline: none;
          cursor: pointer;
        }
      }
    }
    .reportContent {
      overflow: hidden;
      /*    .report{
            border:4px solid #ffffff;
            &:hover{
              border:4px solid #00d1b2;
            }
            &.active{
              border:4px solid #1fd094;
            }
          }*/
    }

    .SmalltestPaperList {
      .choose {
        margin-left: 18px;
        box-sizing: border-box;
        padding: 10px 40px;
        /*background:white;*/
        text-align: left;
        p {
          display: inline-block;
        }
        .select {
          input {
            background: #e4e8f1;
            /*background:#f0f4fb;*/
            border: 0px;
          }
        }
      }
      .content {
        overflow: hidden;
        background: #ecf2f7;
        /*background: #ffffff;*/
        padding: 40px;
        .everyone {
          width: 130px;
          /*height:60px;*/
          background: #ffffff;
          float: left;
          margin-left: 40px;
          /*margin-top:20px;*/
          margin-bottom: 40px;
          cursor: pointer;
          .head {
            color: #fff;
            background: #1fd094;
            height: 30px;
            line-height: 30px;
          }
          .canvas {
            height: 80px;
            width: 80px;
            margin-top: 10px;
          }
          .foot {
            /*background:blue;*/
            height: 30px;
            line-height: 30px;
          }
        }
      }
      .el-dialog { //单独设定，不考虑与content的层级关系
        width: 50%;
        height: 50%; //相对于浏览器的比例，因为其遮罩是浏览器的100%
        background: #ffffff;
        .nodata {
          background: #ecf2f7;
        }
        .el-dialog__header {
          background: #d3f2e5;
          padding: 0;
          height: 60px;
          line-height: 60px;
          position: relative;
          button {
            position: absolute;
            right: 24px;
            top: 22px;
            cursor: pointer;
          }
        }
        .el-dialog__body {
          padding: 0px;
          height: 90%;
          background: #ecf2f7;
          /*background: #ffffff;*/
          overflow: auto;

        }
        .el-dialog__footer {
          height: 0px;
          text-align: center;
          padding-top: 20px;
          button:nth-last-child(1) {
            margin-left: 50px;
          }
        }
      }
    }
    .nodata {
      height: 100px;
      line-height: 100px;
      font-size: 20px;
      background: #fff;
      margin: 20px;
    }
    .el-pagination {
      margin-top: 30px;
      * {
        display: inline-block;
        vertical-align: middle;
      }
      .el-pager li {
        font-size: 20px;
        min-width: 40px;
        height: 40px;
        line-height: 40px;
      }
      .el-pager li.active {
        background: #1fd094;
      }
      .btn-next, .btn-prev {
        height: 40px;
      }
      .el-select .el-input {
        width: 142px;
      }
      .el-select .el-input input {
        height: 40px;
        font-size: 20px;
      }
      .el-select {
        vertical-align: top;
      }
      button, span {
        height: 40px;
        line-height: 40px;
        font-size: 20px;
      }
      .el-pagination__editor {
        height: 40px;
        min-width: 40px;
        font-size: 20px;
        vertical-align: top;
      }
    }
  }

</style>
