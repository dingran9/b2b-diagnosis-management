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
          {{item.groupName}}
        </div>
      </div>
    </section>
    <section class="content-right-body-wrap clear-fix">
      <div v-if="data.studentList==null||isEmptyObject(data.studentList)==true" class="noData">
        暂无数据
      </div>
      <div v-else>
        <div
          v-for="(item,index) in data.studentList"
          class="students"
          :class="{active:flag.studentSlect==index}"
        >
          <img :src="(!item.userImage)?img222:item.userImage"
               @click="seletedStudent(index,item)"
               :class="{active:flag.studentSlect==index}"
          >
          <p>{{item.userName}}</p>
        </div>
      </div>
    </section>
    <!--{{flag.alterShow}}-->
    <!--{{data.studentSelectData}}-->
    <alerter v-if="flag.alterShow" :toZi="data.studentSelectData" @watchZi="handleStudent"></alerter>
  </div>
</template>
<script>
  // import reportItem from '../../../common/reportItem.vue';
  import alerter from './kickOut.vue';
  import img111 from '../../../static/img/student.png'
  export default {
    components: {
      // reportItem,
      alerter
    },
    data(){
      return {
        data: {
          classList: [],
          studentList:[],
          studentSelectData:null,
          studentSlected:0,//所选中的学生，默认值为0
        },
        flag: {
          classSelect: 0,
          studentSlect:0,
          alterShow:false,
        },
        img222: img111
      }
    },
    mounted(){
      window.localStorage.page="myClass";
      this.getClass();
    },
    methods: {
      /*获取班级*/
      getClass(){//其内调用获取学生
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
            } else if(httpCode != "600002") {
              this.$message('获取班级列表失败,请刷新页面重试');
            }
          })
      },
      seletedClass(index){
        this.flag.classSelect=index;
        this.getStudents(this.data.classList[index]);
      },
      /*获取学生*/
      getStudents(item){
        let sendData={
          groupId:item.groupId
        }
        this.$ajax.getStudentListByClassId(sendData)
          .then(({httpCode, result}) => {
            if (httpCode == 200) {
              this.data.studentList = result;
            } else if(httpCode != "600002") {
              this.$message('获取班级列表失败,请刷新页面重试');
            }
          })
      },
      seletedStudent(index,item){
        this.flag.studentSlect=index;
        this.flag.alterShow=true;
        this.data.studentSelectData=item;
      },
      handleStudent(bol){//仅仅需要看子组件传来的是false还是true
          this.flag.alterShow=false;
          if(bol){
              this.$ajax.kickOutStudent({
                userId :this.data.studentSelectData.userId,
                userType :1,
              })
              this.getClass();//删除学生后重新获取班级和学生信息，当然只获取该班级的学生信息就够了。
          }
      },
    },
    computed: {},
    filters: {}

  }
</script>
<style lang="scss" scoped>
  @import '../../../static/css/contentRight';
  .content-right-title-wrap{//我的班级
    .body{
      overflow:hidden;
      vertical-align: middle;
      padding: 0 40px 10px;
      .classListTitle{
        float:left;
        width: 120px;
        text-align:center;
        display: inline-block;
        color: #5e5e5e;
        font-size: 18px;
        line-height:38px;
        height:38px;
        margin-right:-60px;
        margin-top:20px;
        /*background:red;*/
      }
      .classListItem{
        float:left;
        width: 140px;
        font-size: 18px;
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
        margin-top:20px;
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
  .content-right-body-wrap{//学生列表
    background:white;
    overflow:hidden;
    .noData{
      /*color:red;*/
      height:100px;
      line-height:100px;
      font-size:20px;

    }
    .students{
      float:left;
      margin-left:50px;
      margin-top:20px;
      margin-bottom:15px;
      &:hover{
        color:#d3f2e5;
      }
      &.active{
        color:#1fd094;
      }
      img{
        width:106px;
        height:106px;
        border-radius:50%;
        border:4px solid #ffffff;//等待换色。
        &:hover{
          border:4px solid #d3f2e5;
        }
        &.active{
          border:4px solid #1fd094;
        }
      }
      p{
        width:106px;
        text-align:center;
        margin-top:10px;
      }
    }

  }

</style>
