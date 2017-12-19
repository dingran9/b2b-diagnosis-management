<template>
  <div style="float: left;margin-top:-17px;width: 250px;height: 250px;" ref="chart" class="hchart"></div>
</template>
<script>
  let colors = ['#ff7878', '#ffb955', '#ffdf00', '#7d97ba', '#88c6d8', '#4dbebf', '#2fc2a5', '#86df4c', '#50d88f', '#44b773'];
  export default {
    components: {},
    props: {
      chartData: {
        default() {
          return []
        },
      },

    },
    creted() {
    },
    mounted() {
      this.init();
    },
    data() {
      return {chart: null}
    },
    methods: {
      init() {
        let {data} = this.getData();

        this.chart = Highcharts.chart(this.$refs.chart, {
          chart: {
            marginLeft: 0,
            marginTop: 0,
          },
          credits: {
            enabled: false
          },
          title: {
            floating: true,
            text: ''
          },
          tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
          },
          plotOptions: {
            pie: {
              cursor: 'pointer',
              dataLabels: {
                enabled: false,

                format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                style: {
                  color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                }
              },
            }
          },
          series: [{
            type: 'pie',
            innerSize: '90%',
            name: '占比',
            data
          }]
        });
      },
      getData() {
        let data = this.chartData.map(item => {
          return {
            name: item.text,
            y: item.value,
            color: item.color
          }
        });
        return {data};
      }

    },
    computed: {},
    watch: {
      chartData: {
        deep: true,
        handler(val) {
          let _temp = this.getData();
          this.chart.update({
            series: [{
              data: _temp.data,
            }],
            xAxis: {
              categories: _temp.categories
            }
          });
        }
      }
    },
    filters: {}
    ,
  }
</script>
<style lang="scss" scoped>

</style>
<style lang="scss">
  .hchart {
    > div {
      margin: auto;
    }
  }
</style>
