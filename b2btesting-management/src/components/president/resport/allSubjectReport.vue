<template>
  <div>
    <div class="tab-wrap">


      <router-link class="tab-item" :to="item.link" v-for="item in tabData"  :key="item.link">
        {{item.name}}
      </router-link>
    </div>
    <router-view></router-view>
  </div>
</template>
<script>
  export default{
    data(){
      return {
        msg: 'hello vue',
        tabData:[{
          name:'全年级总分成绩分布情况',
          link:'allGradeScoreTable'
        },{
          name:'各班学生成绩分布情况概览',
          link:'allStudentScoreTable'
        },{
          name:'各学科成绩优秀率与及格率统计结果',
          link:'allTeacherScoreTable'
        }]
      }
    },
    components: {},
    mounted(){

    },
    methods: {},
    watch: {},
    props: [],
    computed: {}
  }
</script>
<style>
  .tab-item {
    padding: 0 16px;
    height: 42px;
    box-sizing: border-box;
    line-height: 42px;
    display: inline-block;
    list-style: none;
    font-size: 14px;
    color: #8391a5;
    position: relative;
  }
  .tab-item.router-link-active{
    color: #20a0ff;
    border-bottom: 2px solid #20a0ff;
  }
  .tab-wrap{
    margin:0 0 20px 0;
  }

</style>
