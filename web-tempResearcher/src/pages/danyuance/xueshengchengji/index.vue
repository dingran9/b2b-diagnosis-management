<template>
    <div style="background-color: #fff;padding: 30px 20px;">
       <school-chart :chart-data="fake.school" title="学校学生成绩分布"></school-chart>

       <chart :chart-data="fake.chuqin" title="区域学生成绩分布"></chart>
    </div>
</template>
<script>
  import fake from './fakeData'
  import SchoolChart from './chartFourSchool.vue'
  import  Chart from './chart.vue'
    export default {
        components: {Chart,SchoolChart},
        props: {},
      created() {
        this.fake = fake[this.localData.get('tempUnit').name]
      },
        mounted() {
        },
        data() {
            return {
              fake
            }
        },
        methods: {},
        computed: {},
        filters: {},
    }
</script>
<style lang="scss" scoped>

</style>
<style lang="scss">

</style>
