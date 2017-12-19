<template>
  <div class="reportDetailsTotal"  >

    <section class="header">
      <div class="title">
        <span>{{localData.get('reportType') == 1 ? '单元检测' : '全区考'}}>{{data.titleList[flag.titleSelect].title}}</span>
        <button @click="goBack">返回</button>
      </div>
      <div class="choose">

      </div>
    </section>
    <section class="content_">
      <div class="body">
        <!--班级列表-->
        <div v-for='(item,index) in data.titleList'
             class="classListItem"
             :class="{active:flag.titleSelect==index}"
             @click="titleClass(item,index)"
        >
          <p class="circle" :class="{active:flag.titleSelect==index}"></p>{{item.title}}
        </div>
      </div>
      <div class="reportCont">
        <div class="pad"  v-loading="$store.state.loading"  element-loading-text="拼命加载中">
          <router-view></router-view>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
  export default {
    props: [],
    components: {},
    data() {
      return {

        loading: true,
        data: {
          titleList: (() => {
            //局长
            if (this.$user().get().userType == 7)
              return [
                {title: "试卷质量分析", link: 'Zhiliang'},
                {title: "学生参考情况", link: 2},
                {title: "教学记录", link: 'AreaTeacherPro'},
                {title: "教学成果", link: 'jiaoxue'},
                {title: "知识点掌握情况", link: 6},
                {title: "能力结构分析", link: 7},
                {title: "标准分平均分变化", link: 8}
              ]
            if (this.localData.get('reportType') == 1)
            //单元
              return [
                {title: "教学成绩分析", link: 'jiaoxuejindu'},
                {title: "学生参考情况", link: 'xueshengcankao'},
                {title: "学生成绩分布", link: 'xueshengchengji'},
                {title: "教师教学分析", link: 'jiaoshipaiming'},
              ];
            //全区
            return [
              {title: "试卷质量分析", link: 'Zhiliang'},
              {title: "学生参考情况", link: 2},
              {title: "学生成绩分布", link: 3},
              {title: "测试记录", link: 'AreaTeacherPro'},
              {title: "教学成果", link: 'jiaoxue'},
              {title: "知识点掌握情况", link: 6},
              {title: "能力结构分析", link: 7},
              {title: "标准分平均分变化", link: 8}
            ]
          })(),
        },
        flag: {
          titleSelect: 0,
        },
        query: this.$route.query,
      }
    },
    mounted() {

      let str = this.$route.path;
      str = str.split('/');
      str = str[str.length - 1].replace('class', '');
      console.log(str);
      this.flag.titleSelect = this.data.titleList.findIndex(item => item.link == str);
    },
    methods: {
      goBack() {
        if (this.localData.get('reportType') == 1)
          this.$router.push({path: '/syncCoach/syncCoach'})
        else
          this.$router.push({path: '/disciplineEvaluation/disciplineEvaluation'})
      },
      titleClass(title, index) {
        this.flag.titleSelect = index;
        this.$router.push({path: "class" + title.link})
      }
    },
    computed: {},
    filters: {},
  }
</script>
<style lang="scss" scoped>
  /*@import '../../../../static/css/contentRight';*/
  .reportDetailsTotal {
    .header {
      margin-right: 20px;
      .title {
        overflow: hidden;
        margin-top: 20px;
        margin-left: 18px;
        box-sizing: border-box;
        padding: 10px 40px;
        background: white;
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
          background-color: rgba(80, 206, 217, 1);
          outline: none;
          cursor: pointer;
        }
      }
    }
    .content_ {
      margin-top: 10px;
      margin-left: 18px;
      text-align: center;
      position: relative;
      .body {
        vertical-align: top;
        padding-right: 0px;
        background: white;
        text-align: left;
        margin-right: 20px;
        &:after{
          content: '';
          clear: both;
          display: table;
        }
        .classListItem {
          width: 180px;
          font-size: 18px;
          float: left;
          line-height: 50px;
          vertical-align: middle;
          cursor: pointer;
          transition: all .3s;
          background-color: #fff;
          color: #000;
          .circle {
            width: 10px;
            height: 10px;
            background: #fff;
            border-radius: 50%;
            display: inline-block;
            margin-left: 10px;
            margin-right: 10px;
            &.active {
              background-color: rgba(50, 197, 210, 1);
            }
          }
          &:hover {

          }
          &.active {
            background-color: rgba(211, 234, 242, 1);
            color: #32c5d2;
          }
        }
      }
      .reportCont {
        margin-top: 10px;
        width: 100%;
        padding-right: 20px;
        .pad {
          width: 100%;
          display: inline-block;
          overflow: hidden;
          min-height: 860px;
        }

      }
    }
  }


</style>
