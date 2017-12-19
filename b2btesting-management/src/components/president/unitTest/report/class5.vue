<template>
  <div class="rp-div">
    <p class="titlePc">班级学科成绩</p>
    <div class="rp-table" v-if="isEmptyObject(result)!=true&&result!=null">
      <table>
        <tr v-for="(item,index) in result.top"  v-if="index >= 0&&index <= 6" :style="{background:index%2?'#e1edf1':'#eff4f6'}">
          <td v-for="s in item" >{{s}}</td>
        </tr>
        <tr v-for="(item,index) in result.top" v-if="index == 6" >
          <td style="background:#8bb6c4" v-for="(s,index) in item" ><span v-if="index==0" style="color: #ffffff">分数区间人数</span><span v-if="index==0"></span></td>
        </tr>
        <tr v-for="(item,index) in result.top" v-if="index > 6" :style="{background:index%2?'#e1edf1':'#eff4f6'}">
          <td v-for="s in item" >{{s}}</td>
        </tr>
        <tr v-for="(item,index) in result.avgScoreTimes" :style="{background:index%2?'#e1edf1':'#eff4f6'}">
          <td v-for="(s,index) in item" v-if="index == 0">前{{s | sFilter}}名均分</td>
          <td v-for="(s,index) in item" v-if="index > 0">{{s.substr(0,5)}}</td>
        </tr>
      </table>
    </div>
    <div v-else class="nodata">
      暂无数据
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        result: {},
        junfen: []
      }
    },
    mounted: function () {
      this.getSourceDate()
    },
    methods: {
      getSourceDate: function () {

        let url = this.getrequestInterface("teacherReport/getClassResultsTableForDaqiao")

        this.$http.get(url)
          .then(res => {

            if (res.body.message == "Success") {

              if(this.isEmptyObject(res.body.result)){
                return;
              }
              this.result=res.body.result
              this.junfen = getJunFen(res.body.result)
              //          this.junfen = getJunFen(this.result)

            }

          }, res => {

            console.log(res)

          });

        //获取每个班级的均分差
        function getJunFen(obj) {
          let x = 0;
          for (let i = 1;i<obj['top'][6].length;i++ ){
            x+= parseFloat(obj['top'][6][i])
          }
          let junfen = ['均分差']
          for (let j = 1;j<obj['top'][6].length;j++ ){
            junfen.push((obj['top'][6][j]-x/(obj['top'][6].length-1)).toFixed(2))
          }
          return junfen
        }
      }
    },
    filters: {
      sFilter(val) {
        if (val.substr(0, 3) === '0--') {
          return val.substr(3);
        }
        return val;
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  .rp-div{
    /*margin-top: 0.4rem;*/
    background:#fff;
    .titlePc{
      font-size:20px;
      text-align: left;
      border-bottom:1px solid #e1e5ec;
      padding:10px 40px;
    }
    .nodata{
      height:100px;
      line-height:100px;
      font-size:20px;
      background:#fff;
      margin-top: 20px;
      margin-left:18px;
    }
  }
  /*下面是从h5复制的，有空来调*/
  .rp-table {
    width: 674px;
    /*height:713px;*/
    overflow: auto;
    margin: 60px auto;
    padding-bottom:60px;
    /*padding: 0 2rem;*/
    /*padding-top: 0.5rem;*/
  }
  .rp-table table{
    min-width: 100%;
    border-radius: 10px;
    font-size: 0.6rem;
    color: #828282;
    margin-bottom: 2rem;
  }

  .rp-table table tr:nth-of-type(even){
  }
  .rp-table td{
    /*height:54px;*//*UI图的54太难看，不适合小屏电脑*/
    min-width: 5rem;
    text-align: center;
    line-height: 1.6rem;
    /*background:#e1edf1;*/
    height:34px;
    font-size:16px;
  }
  .rp-table table tr:first-child td{
    background:#8bb6c4;
    color:#ffffff;
  }

  .rp-table table tr:first-child td:first-child{
    border-top-left-radius:.3rem;
  }
  .rp-table table tr:first-child td:last-child{
    border-top-right-radius:.3rem;
  }
  .rp-table tr td:last-child {
    border-right: 0;
  }
</style>
