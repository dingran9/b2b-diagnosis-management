<template>
  <div class="syncCoach choose-wrap">
    <section class="header">
      <div class="title">
        单元检测
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
          <el-select v-model="form.grond" placeholder="请选择年级" @change="getVersion()">
            <template v-if="userStage.includes('1')">
              <el-option label="一年级" value="11"></el-option>
              <el-option label="二年级" value="12"></el-option>
              <el-option label="三年级" value="13"></el-option>
              <el-option label="四年级" value="14"></el-option>
              <el-option label="五年级" value="15"></el-option>
              <el-option label="六年级" value="16"></el-option>
            </template>
            <template v-if="userStage.includes('2')">
              <el-option label="初一" value="21"></el-option>
              <el-option label="初二" value="22"></el-option>
              <el-option label="初三" value="23"></el-option>
            </template>
            <template v-if="userStage.includes('3')">
              <el-option label="高一" value="31"></el-option>
              <el-option label="高二" value="32"></el-option>
              <el-option label="高三" value="33"></el-option>
            </template>

          </el-select>
        </el-form-item>
        <el-form-item label="教材版本">
          <el-select v-model="form.version" placeholder="请选择教材版本" @change="huoqushangxiace">
            <el-option v-for="item in bookVerison" :label="item.book_type" :value="item.ctb_code"
                       :key="item.ctb_code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上下册">
          <el-select v-model="form.xueqi" placeholder="请选择学期" @change="getUnit">
            <el-option :label="ce.name" :key="ce.code" :value="ce.code" v-for="ce in shagnxiace"></el-option>
          </el-select>
        </el-form-item>
        <span class="search" @click="searchBtnClick()">查询</span>
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
    <div class="" style="margin:10px 20px;text-align:left;">
      <div class="ge-card-1" v-for="(cellData,index) in unitList">
        <div class="ge-header" style="text-align:left;">
          序号:{{index + 1}}
        </div>
        <div class="ge-body">
          {{cellData.name}}
        </div>
        <div class="ge-btn" :class="cellData.hasReport || cellData.name == '期中' ? '' : 'disable'"
             @click="searchList(cellData,index)">测评报告
        </div>
      </div>
    </div>
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
        userStage: this.$user().get().userStage.split(','),
        bookVerison: [],
        shagnxiace: [],
        unitList: [],
        form: {
          year: '',
          grond: '',
          version: '',
          xueqi: '',
          unit: ''
        },
      }
    },
    mounted() {
      this.user = this.$user().get();
      console.log(this.user);
    },
    methods: {
      getXueQi(xueqi) {
        let {form} = this;
        let _xueqiTemp = this.shagnxiace.find(i => i.code == xueqi);

        function getXueQiWithMonth(month) {
          console.log(month);
          return (month >= 1 && month < 8) ? 2 : 1;
        }

        return _xueqiTemp.name.includes('上') ?
          1 : _xueqiTemp.name.includes('下') ?
            2 : getXueQiWithMonth(new Date(_xueqiTemp.serverTime).getMonth());
      },
      searchList(cellData) {
        if (!cellData.hasReport) return;
        let {form} = this;
        form.unit = cellData.code;
        if (!form.year) {
          this.$message('请选择学年');
          return;
        }
        if (!form.grond) {
          this.$message('请选择年级');
          return;
        }
        if (!form.version) {
          this.$message('请选择教材版本');
          return;
        }
        if (!form.xueqi) {
          this.$message('请选择学期');
          return;
        }

        form.xueqiType = this.getXueQi(form.xueqi);
        let unitModels = this.unitList.slice(0, this.unitList.findIndex(i => i.code == form.unit) + 1).map((item, index) => ({
          "unitCode": item.code,
          "unitName": item.name,
          "sort": index
        }));
        form.unitModels = unitModels;
        this.localData.set('unit', form);
        this.localData.set('reportType', '1');
        //演示添加的东西  以后没用
        this.localData.set('tempUnit',cellData);
        setTimeout(() => {
          //跳转延时  防止local读写太慢 引起的bug
          this.$router.push({
            path: '/showData/reportDetailsTotal/classjiaoxuejindu',
          })
        }, 100);
      },
      searchBtnClick() {
        let {form} = this;
        if (!form.year) {
          this.$message('请选择学年');
          return;
        }
        if (!form.grond) {
          this.$message('请选择年级');
          return;
        }
        if (!form.version) {
          this.$message('请选择教材版本');
          return;
        }
        if (!form.xueqi) {
          this.$message('请选择学期');
          return;
        }
        ;
        console.log('查询');
        ;
        this.getUnit(1);
      },
      getVersion() {
        this.changeWithState('grade');
        let {form} = this;
        let sendData = {
          "gradeCode": form.grond,
          "subjectCode": this.user.userSubject || 2,
        }
        this.$ajax.getBookTypeVersion(sendData)
          .then(({httpCode, result}) => {
            if (httpCode == 200) {
              this.bookVerison = result;
              if (!result.length) this.$message('教材版本列表为空,请选择其他年级');
            } else {
              this.$message('获取教材版本,请刷新页面重试');
            }
          })
      },
      huoqushangxiace(val) {
        console.log(val);
        if (!val) return;
        this.changeWithState('version');
        let {form} = this;
        let sendData = {
          "gradeCode": form.grond,
          "subjectCode": this.user.userSubject || 2,
          "booktypeCode": form.version,
          "productsIds": "581c1b44f70541fc88f8658041477c6c",//固定值
          "code": "0"//固定为0
        }
        this.$ajax.getbookTypeVersionAndUnit(sendData)
          .then(({httpCode, result}) => {
            if (httpCode == 200) {
              this.shagnxiace = result;
              if (!result.length) this.$message('上下册列表为空,请选择其他教材版本');

            } else if (httpCode != "600002") {
              this.$message('获取上下册失败,请刷新页面重试');
            }
          })
      },
      changeWithState(state) {
        let {form} = this;
        switch (state) {
          case 'grade':
            form.version = '';
            this.shagnxiace = [];
          case 'version':
            form.xueqi = '';
            this.unitList = [];
          case 'shangxiace':
            form.unit = "";
        }
      },
      getUnit(val) {
        if (!val) return;
        this.changeWithState('shangxiace');
        let {form} = this;
        if (!form.year) {
          return;
        }
        let sendData = {
          "districtId": this.user.userGroupAreaDistrictId,
          "examYear": form.year + '' + this.getXueQi(form.xueqi),
          "gradeCode": form.grond,
          "subjectCode": this.user.userSubject || 2,
          "booktypeCode": form.version,
          "productsIds": "581c1b44f70541fc88f8658041477c6c",
          "code": form.xueqi
        }

        this.$ajax.getUnitListWithStatus(sendData)
          .then(({httpCode, result}) => {
            if (httpCode == 200) {
              result = result || [];
              if( form.grond == 22){
                result.map(item =>{
                  if(item.name == 'Unit 2' || item.name == '期中测试'){
                    item.hasReport = true;
                  }
                })
              }
              this.$set(this, 'unitList', result);
              if (!result.length) this.$message('单元列表为空,请选择其他学期');
            } else {
              this.$message('获取单元信息失败,请刷新页面重试');
            }
          })
      },
    }
  }
</script>
<style lang="scss" scoped>
  @import '../../../static/css/contentRight';

  .choose-wrap {
    .header {
      margin:10px 20px;
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
      margin:0px 20px;
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
      bottom: 10px;
      right: 10px;
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
