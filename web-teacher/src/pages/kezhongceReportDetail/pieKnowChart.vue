<template>
  <div style="margin:auto;width: 1000px;" ref="chart" class="hchart"></div>
</template>
<script>
  let colors = ['#ff7878', '#ffb955', '#ffdf00', '#7d97ba', '#88c6d8', '#4dbebf', '#2fc2a5', '#86df4c', '#50d88f', '#44b773'];
  export default {
    components: {},
    props: {
      datalist: {
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
        let {data, categories} = this.getData();
        let series = [{
          borderRadius: 13,
          pointWidth: 30,
          name: ' ',
          data
        }];
        this.chart = Highcharts.chart(this.$refs.chart, {
            title: {
              text: ''
            },
            credits: {
              enabled: false
            },
            plotOptions: {
              pie: {
                cursor: 'pointer',
                dataLabels: {
                  enabled: true,
                  format: '<b>{point.name}</b>: {point.percentage:.2f} %',
                },
                showInLegend: true,
                point: {
                  events: {
                    legendItemClick(e) {
                      return false; // 直接 return false 即可禁用图例点击事件
                    }
                  }
                },
              },
            },
            tooltip: {
             enabled:false
            },
            series: [{
              type: 'pie',
              name: '占比',
              data
            }],
            legend: {
              enabled:false
            },
            chart: {
              marginRight: 120
            },
          }
        );
      },
      getData() {
        let data = this.datalist.map(item => {
          return {
            name: item.knowledgeName,
            y: item.knowledgeRatio,
          };
        });
        return {data}
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
