<template>
  <div>
    <div class="tab-wrap">
      <div class="report-header">
        阶段检测>单科报告
      </div>
      <div class="report-body">
        <router-link class="tab-item" :to="item.link" v-for="item in tabData" :key="item.link">
          {{item.name}}
        </router-link>
      </div>

    </div>
    <router-view></router-view>
  </div>
</template>
<script>
  export default{
    data(){
      return {
        msg: 'hello vue',
        tabData: [{
          name: '学生成绩情况',
          link: {
            path: 'studentScoreReport',
            query: this.$route.query
          }
        }, {
          name: '教师教学成绩',
          link: {
            path: 'teacherScoreReport',
            query: this.$route.query
          }
        }, {
          name: '各班原始分数',
          link: {
            path: 'classPriginalScore',
            query: this.$route.query
          }
        }, {
          name: '各班标准分数',
          link: {
            path: 'classStandardScore',
            query: this.$route.query
          }
        }]
      }
    },
    components: {},
    mounted(){
      Highcharts.setOptions({
        lang: {
          noData: '暂无数据'
        },
        credits: {
          enabled: false
        },
      });
    },
    methods: {},
    watch: {},
    props: [],
    computed: {}
  }
</script>
<style>
  .wrapper>.content{
    background: #f0f4fb;
    min-width:1200px;
  }
  .tab-item {
    cursor: pointer;
    padding: 0 20px;
    text-align: center;
    min-width:80px;
    height: 37px;
    margin-right:40px;
    box-sizing: border-box;
    line-height: 37px;
    display: inline-block;
    list-style: none;
    font-size: 14px;
    color: #666;
   font-weight: 600;
    position: relative;
    border-radius:21px;
  }
  .report-item{
    margin-bottom: 20px;
  }
  .report-header{
    height: 60px;
    line-height: 60px;
    padding-left: 40px;
    font-size: 18px;
    background-color: #fff;
    border-bottom: 1px solid #eee;
  }
  .report-header-sub{
    color: #a4b4cb;
  }
  .report-body{
    padding:40px;
    background-color: #fff;
  }
  .tab-item.router-link-active {
    color: #fff;
    background: #7fbed0;
  }

  .tab-wrap {
    margin: 0 0 20px 0;
  }

</style>
