<template>
  <div>
    <div class="content-right-title-wrap">
      <h2 class="title">个人中心>个人设置
        <span class="ge-pull-right" style="font-size: 14px;color:red;">
          必须完善全部信息才能继续操作!
        </span>
      </h2>
    </div>
    <div class="content-right-body-wrap clear-fix">
      <el-steps :space="500" :active="temp" :align-center="true" :center="true">
        <el-step title="步骤 1:设置姓名" icon="edit"></el-step>
        <el-step title="步骤 2:设置学校" icon="upload"></el-step>
        <el-step title="步骤 3:设置班级" icon="setting"></el-step>
      </el-steps>
      <div class="set" v-if="temp == 1">
        <div class="title">
          设置姓名
        </div>
        <div class="body">
          <div class="item">
            <div class="caption">
              <img src="../../../../../static/img/icon/icon_people.png" height="24" width="21"/>
              学生名称
            </div>
            <label class="input-wrap ge-por">
              <input style="width: 100%;"
                     v-model="people.userName"
                     placeholder="请输入您的姓名">
            </label>
          </div>

        </div>
        <div class="foot">
          <div @click="setNameNext" class="submit-btn">
            下一步
          </div>
        </div>
      </div>
      <div class="set" v-if="temp == 2">
        <div class="title">
          设置学校
          <span class="up-temp" @click="temp = 1">上一步</span>
        </div>
        <div class="body">
          <div class="item">
            <div class="caption">
              <img src="../../../../../static/img/icon/icon_school.png" height="24" width="21"/>
              学校名称
            </div>
            <label class="input-wrap ge-por">
              <input style="width: 100%;"
                     @input="getSchool"
                     v-model="people.schoolName"
                     placeholder="请输入学校名称">
              <div
                v-if="data.schoolList.length"
                class="school-wrap">
                <div class="school-item"
                     @click="selectSchool(school)"
                     v-for="school in data.schoolList">
                  {{school.groupName}}
                </div>
              </div>
            </label>
          </div>

        </div>
        <div class="foot">
          <div @click="schoolNext" class="submit-btn">
            下一步
          </div>
        </div>
      </div>
      <div class="set" v-if="temp == 3">
        <div class="title">
          设置班级
          <span class="up-temp" @click="temp = 2">上一步</span>
        </div>
        <div class="body">
          <div class="item">
            <div class=" ge-W50 ge-text-center">
              <span>选择年级:</span>
              <el-select v-model="group"
                         @change="changeGroup"
                         clearable
                         placeholder="请选择年级">
                <el-option
                  v-for="item in data.groudList"
                  :key="item.groupIden"
                  :label="item.groupName"
                  :value="item">
                </el-option>
              </el-select>
            </div>
            <!-- 高二高三显示 -->
            <div class=" ge-W50 ge-text-center" v-show="group.groupIden == 33 || group.groupIden == 32 ">
              <span>选择文理:</span>
              <el-select v-model="people.artType"
                         clearable
                         @change="sellectArt"
                         placeholder="选择文理分科">
                <el-option
                  :key="0"
                  label="文科"
                  :value="0">
                </el-option>
                <el-option
                  :key="1"
                  label="理科"
                  :value="1">
                </el-option>
              </el-select>
            </div>
            <div class=" ge-W50 ge-text-center"
                 v-show="((group.groupIden == 33 || group.groupIden == 32) && people.artType !== '')
                     || !(group.groupIden == 33 || group.groupIden == 32)">
              <span>选择班级:</span>
              <el-select v-model="classes"
                         clearable
                         value-key="groupId"
                         @change="sellectClass"
                         placeholder="请选择班级">
                <el-option
                  v-for="item in data.classList"
                  :key="item.groupId"
                  :label="item.groupName"
                  :value="item">
                </el-option>
              </el-select>
            </div>
          </div>

        </div>
        <div class="foot">
          <div @click="commit" class="submit-btn">
            完成
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
<script>

  export default {
    components: {},
    data(){
      return {
        temp: 1,
        group: {},
        classes: {},
        data: {
          schoolList: [],
          groundList: [],
          classList: []
        },
        people: {
          schoolName: '',
          schoolId: '',
          userName: '',
          timer: false,
          gradeName: '',
          gradeId: '',
          gradeIden: '',
          className: '',
          classId: '',
          artType: '',
          userId: this.$user().get().userId

        },
      }
    },
    mounted(){
      this.user = this.$user().get();
      let user = this.user;
    },
    methods: {
      getSchool(){
        this.people.schoolId = '';
        if (this.people.schoolName) {
          clearTimeout(this.timer);
          this.timer = setTimeout(() => {
            this.$ajax.getSchool({"groupName": this.people.schoolName, "groupType": 1})
              .then(({httpCode, result}) => {
                if (httpCode == 200) {
                  this.data.schoolList = result || [];
                } else {
                }
              })
          }, 500);
        } else {
          this.data.schoolList = [];
        }

      },
      selectSchool(school){
        this.people.schoolName = school.groupName;
        this.people.schoolId = school.groupId;
        this.data.schoolList = [];
      },
      schoolNext(){
        if (this.people.schoolId) {
          this.$ajax.getGradeList({groupId: this.people.schoolId})
            .then(({httpCode, result}) => {
              if (httpCode == 200) {
                this.$set(this.data, 'groudList', result || [])
              } else {
                this.$message('获取年级列表失败!');
              }
            })
          this.temp = 3;
        } else {
          this.$message('请输入学校名!');
        }
      },
      setNameNext(){
        if (this.people.userName) {
          this.temp = 2;
        } else {
          this.$message('请输入您的姓名!');
        }
      },
      changeGroup(){
        this.classes = {};
        let people = this.people, group = this.group;
        people.gradeId = group.groupId;
        people.gradeIden = group.groupIden;
        people.gradeName = group.groupName;
        people.artType = '';
        if (people.gradeIden == 32 || people.gradeIden == 33) {
          this.grontArt = '';
          return;
        }
        this.$ajax.getClassList({groupId: people.gradeId})
          .then(({httpCode, result}) => {
            if (httpCode == 200) {
              this.$set(this.data, 'classList', result || []);
            } else {

            }
          })
      },
      sellectArt(){
        if (this.people.artType === '')return;
        this.$ajax.getClassList({groupId: this.people.gradeId, groupArt: this.people.artType})
          .then(({httpCode, result}) => {
            if (httpCode == 200) {
              this.$set(this.data, 'classList', result || []);
            } else {

            }
          })
      },
      sellectClass(){
        let people = this.people, classes = this.classes;
        people.className = classes.groupName;
        people.classId = classes.groupId;

      },
      commit(){
        let people = this.people;
        console.log(people)
        if (people.gradeName && people.className) {
          let temp = Object.assign({}, this.people);
          temp.artType = temp.artType === '' ? 2 : temp.artType;
          this.$ajax.setUserInfo(temp)
            .then(({httpCode, result}) => {
              if (httpCode == 200) {
                this.$message('个人信息设置成功!');
                let user = this.user;
                Object.assign(user, this.people)
                this.$user().set(user);
                this.$router.push({
                  path: '/main/tutoring',
                })
              } else {
                this.$message('个人信息设置失败,请重试!');
              }
            })
        } else {
          this.$message('请完善信息后提交!')
        }
      }
    }
    ,
    computed: {},
    watch: {
      temp(val){
        this.classes = {};
        this.group = {};
        this.people.gradeName = '';
      }
    }
    ,
    filters: {}

  }
</script>
<style lang="scss" scoped>
  @import '../../../../../static/css/contentRight.scss', "../../../../../static/css/gemixin.scss";

  .set {
    max-width: 1000px;
    min-width: 700px;
    background: #fff;
    margin: 100px auto;
    min-height: 200px;
    .title {
      position: relative;
      $h: 60px;
      height: $h;
      line-height: $h;
      color: #4c6175;
      font-size: 20px;
      font-weight: 600;
      border-bottom: 1px solid #e1e5ec;
    }
    .body {
      padding: 45px;
      text-align: left;
      font-size: 18px;
      .item {
        $h: 40px;
        height: $h;
        line-height: $h;
        clear: both;
        &:after {
          content: '';
          display: table;
          clear: both;
        }
        margin-bottom: 20px;
        .caption {
          width: 23%;
          display: inline-block;
          float: left;
          color: #4c6175;
          img {
            margin-right: 20px;
          }
        }
        .input-wrap {
          width: 77%;
          display: inline-block;
          float: left;
          background: #f0f4fb;
          input {
            background-color: transparent;
            display: inline-block;
            padding-left: 20px;
            font-size: 18px;
          }
          .school-wrap {
            position: absolute;
            left: 0;
            top: 42px;
            background: #fff;
            width: 100%;

            border: 1px solid #eee;
            max-height: 150px;
            overflow-y: scroll;
            .school-item {
              padding: 0 17px;
              cursor: pointer;
              &:hover {
                background-color: #f0f4fb;

              }
            }
          }
        }
      }

    }
    .foot {
      padding: 100px 0 30px 0;
      .submit-btn {
        @include ge-btn(400px, 50px);
      }
    }
  }

  .up-temp {
    padding-right: 20px;
    font-size: 20px;
    position: absolute;
    right: 0;
    cursor: pointer;
    &:hover {
      color: $color1;
    }

  }
</style>
<style>
  .el-step__head.is-finish {
    color: #3cc0fe;
    border-color: #3cc0fe;
  }

  .el-step__title.is-finish {
    font-weight: 700;
    color: #3cc0fe;
  }
</style>
