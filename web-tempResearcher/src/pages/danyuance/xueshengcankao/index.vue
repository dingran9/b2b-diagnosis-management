<template>
    <div style="background-color: #fff;padding: 30px 20px;">
       <chart :chart-data="fake.chuqin" title="出勤率"></chart>
       <time-chart :chart-data="fake.pingjunzuoda" title="平均作答时间(分钟)"></time-chart>
       <chart :chart-data="fake.zuodalv" title="平均作答率"></chart>
    </div>
</template>
<script>
  import fake from './fakeData'
  import  Chart from './chart.vue'
  import  TimeChart from './timeChart.vue'
    export default {
        components: {Chart,TimeChart},
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
