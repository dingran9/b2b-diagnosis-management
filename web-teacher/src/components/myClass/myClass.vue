<template>
  <div>
    <section class="content-right-title-wrap">
      <h2 class="title">我的班级</h2>
      <div class="body">
        <div class="classListTitle">
          班级:
        </div>
        <!--班级列表-->
        <div v-for='(item,index) in data.classList'
             class="classListItem"
             :class="{active:flag.classSelect==index}"
             @click="seletedClass(index)"
        >
          {{user.userGradeName}} {{item.groupName}}
        </div>
      </div>
    </section>
    <section class="content-right-body-wrap clear-fix">
      <div v-if="data.studentList==null||isEmptyObject(data.studentList)==true" class="noData">
        暂无数据
      </div>
      <div v-else>
        <template v-for="(item,index) in data.studentList">
          <el-popover
            :key="index"
            placement="right"
            effect="light"
            :visible-arrow="false">
            <div class="student-controll">
              <div class="student-controll-item" @click="seletedStudent(index,item)">
                踢出班级
              </div>
              <div class="student-controll-item" @click="bindOrChangeDatiqi(index,item)">
                {{item.isBind ? '换绑' : '绑定'}}答题器
              </div>
            </div>
            <div
              slot="reference"
              class="students"
              :class="{active:flag.studentSlect==index}"
            >
              <img :src="(!item.userImage)?img222:item.userImage"
                   :class="{active:flag.studentSlect==index}"
                   class="icon"
              >
              <p>{{item.userName}}</p>
              <div v-show="item.isBind">
                <img src="../../../static/img/icon/phone.png" class="phone" style="vertical-align: middle;"/>
                :{{item.machineCode}}
              </div>

            </div>
          </el-popover>

        </template>

      </div>
    </section>

    <alerter v-if="flag.alterShow" :toZi="data.studentSelectData" @watchZi="handleStudent"></alerter>
    <el-dialog v-model="flag.bindAnswer" size="tiny" :show-close=false>
      <el-input
        style="width: 100%;"
        v-model="bindAnswerCode"
        placeholder="请输入答题器设备码"
      >
      </el-input>
      <el-tooltip placement="right" style="position: absolute;right: 30px;top:58px;" effect="light">
        <div slot="content">
          <img src="../../../static/img/datiqi.png" height="292" width="442"/>
        </div>
        <i class="el-icon-warning" style="font-size: 20px;"></i>
      </el-tooltip>
      <p class="changeP" style="text-align: right; padding-top:20px;">
        <el-button type="primary" class="changeP-b" @click="bindAnswerClick">确 定</el-button>
        <el-button @click="flag.bindAnswer = false" class="changeP-b">取 消</el-button>
      </p>
    </el-dialog>
  </div>
</template>
<script>

  import alerter from './kickOut.vue';
  import img111 from '../../../static/img/student.png'

  export default {
    components: {
      alerter
    },
    data() {
      return {
        bindAnswerCode: '',
        data: {
          classList: [],
          studentList: [],
          studentSelectData: null,
          studentSlected: 0,//所选中的学生，默认值为0
        },
        flag: {
          classSelect: 0,
          studentSlect: -1,
          alterShow: false,
          bindAnswer: false
        },
        img222: img111
      }
    },
    mounted() {
      window.localStorage.page = "myClass";
      this.getClass();
    },
    methods: {
      /*获取班级*/
      getClass() {//其内调用获取学生
        this.user = this.$user().get();
        let user = this.user;
        var sendData = {
          "userId": user.userId,
        };
        this.$ajax.getClassByTeacher(sendData)
          .then(({httpCode, result}) => {
            if (httpCode == 200) {
              this.data.classList = result;
              this.getStudents(this.data.classList[this.flag.classSelect]);
            } else if (httpCode != "600002") {
              this.$message('获取班级列表失败,请刷新页面重试');
            }
          })
      },
      seletedClass(index) {
        this.flag.classSelect = index;
        this.getStudents(this.data.classList[index]);
      },
      /*获取学生*/
      getStudents(item) {
        let sendData = {
          groupId: item.groupId
        }
        this.$ajax.getStudentListByClassId(sendData)
          .then(({httpCode, result}) => {
            if (httpCode == 200) {
              this.data.studentList = result;
            } else if (httpCode != "600002") {
              this.$message('获取班级列表失败,请刷新页面重试');
            }
          })
      },
      seletedStudent(index, item) {
//        this.flag.studentSlect = index;
        this.flag.alterShow = true;
        this.data.studentSelectData = item;
      },
      handleStudent(bol) {//仅仅需要看子组件传来的是false还是true
        this.flag.alterShow = false;
        if (bol) {
          this.$ajax.kickOutStudent({
            userId: this.data.studentSelectData.userId,
            userType: 1,
          })
          this.getClass();//删除学生后重新获取班级和学生信息，当然只获取该班级的学生信息就够了。
        }
      },
      bindOrChangeDatiqi(index, item) {
        console.log(index, item);
        this._student = item;
        this.flag.bindAnswer = true;
        this.bindAnswerCode = this._student.machineCode;
      },
      bindAnswerClick() {
        if (!this.bindAnswerCode) {
          this.$message('请输入答题器设备码!');
          return;
        }
        if (!/^\d+$/.test(this.bindAnswerCode)) {
          this.$message('答题器设备码只能是数字!')
          return;
        }
        console.log(this._student);
        this.$ajax.manageStudentAnswerMachine({
          studentCode: this._student.userId,
          studentName: this._student.userName,
          machineCode: this.bindAnswerCode
        })
          .then(({httpCode, result}) => {
            if (httpCode === '200') {
              this.flag.bindAnswer = false;
              if (!result) {
                this.$message("绑定失败");
                return;
              }
              this._student.machineCode = this.bindAnswerCode;
              this.bindAnswerCode = '';
              this.$message('绑定成功');
              this._student.isBind = true;
            } else if (httpCode === '40007') {
              this.$message('该答题器已绑定其他学生!');
              return;
            } else {
              console.log('请求错误,偷偷地找后端沟通吧!');
            }
          })
      }
    },
    computed: {},
    filters: {}

  }
</script>
<style lang="scss" scoped>
  @import '../../../static/css/contentRight';

  .content-right-title-wrap { //我的班级
    .body {
      overflow: hidden;
      vertical-align: middle;
      padding: 0 40px 10px;
      .classListTitle {
        float: left;
        width: 120px;
        text-align: center;
        display: inline-block;
        color: #5e5e5e;
        font-size: 22px;
        line-height: 38px;
        height: 38px;
        margin-right: -60px;
        margin-top: 20px;
        /*background:red;*/
      }
      .classListItem {
        float: left;
        width: 140px;
        font-size: 20px;
        height: 38px;
        line-height: 38px;
        text-align: center;
        border-radius: 19px;
        display: inline-block;
        vertical-align: middle;
        cursor: pointer;
        transition: all .3s;
        margin-left: 60px;
        background-color: #fff;
        color: #000;
        margin-top: 20px;
        &:hover {
          background-color: #d3f2e5;
          color: #000;
        }
        &.active {
          background-color: #1fd094;
          color: #fff;
        }
      }
    }
  }

  .content-right-body-wrap { //学生列表
    background: white;
    overflow: hidden;
    .noData {
      /*color:red;*/
      height: 100px;
      line-height: 100px;
      font-size: 20px;

    }
    .students {
      position: relative;
      float: left;
      margin-left: 50px;
      margin-top: 20px;
      margin-bottom: 15px;
      height: 180px;
      &:hover {
        color: #d3f2e5;
      }
      &.active {
        color: #1fd094;
      }
      img.icon {
        width: 106px;
        height: 106px;
        border-radius: 50%;
        border: 4px solid #ffffff; //等待换色。
        &:hover {
          border: 4px solid #d3f2e5;
        }
        &.active {
          border: 4px solid #1fd094;
        }
      }
      .phone {
        right: -10px;
        top: 0;
      }
      p {
        text-align: center;
        margin-top: 10px;
        margin-bottom: 2px;
      }
    }

  }

</style>
<style lang="scss">
  //学生悬窗
  .student-controll {
    &-item {
      $h: 40px;
      height: $h;
      line-height: $h;
      text-align: center;
      cursor: pointer;
      & + & {
        border: {
          top: 1px solid rgba(0, 0, 0, .2);
        }
      }
      &:hover {
        background: #1fd094;
        color: #fff;
      }
    }
  }

  .el-tooltip__popper.is-light {
    border: 1px solid #eee;
    padding: 0;
  }

  .bind-answer {
    font-size: 18px;
    cursor: pointer;
  }

  .el-popover {
    padding: 0;
  }
</style>
