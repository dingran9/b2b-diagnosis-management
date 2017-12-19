<template>
  <div class="rp-div class4">
    <p class="titlePc">标准分平均分</p>
    <!-- table -->
    <div  v-if="classAndTime" class="table-wrap">
      <div class="class-wrap">
        <span class="time"></span>
        <span
          v-for="(time,index) in classAndTime[0]"
          class="time">
            {{'第' + (index + 1) + '次测试'}}
          </span>
      </div>
      <div
        v-for="(class1,classIndex) in classAndTime"
        class="class-wrap">
        <span class="time">{{class1[0].className}}</span>
        <span
          v-for="time in class1"
          class="time">
            <span :style="{color:time.avgStandardScore<0?'red':''}">
              {{time.avgStandardScore !== undefined ? time.avgStandardScore : '--'}}
            </span>

        </span>
      </div>
    </div>
    <!--柱形图-->
    <div  v-if="classAndTime" id="average-chart" >
      <!--pc端图示以及按钮组-->
      <div class="pcChartTitle">
        <div class="item-wrap">
          <template>
            <el-checkbox-group
              v-model="classChooseed"
              :min="1"
              @change="checkboxFn(classChooseed)"
            >
              <div
                v-for="(item,index) in classes"
                class="item"
              >
                <el-checkbox  :label="index" :key="item.classCode">
                  <i :style="{background:getColor(index)}"></i>{{item.className}}
                </el-checkbox>
              </div>
            </el-checkbox-group>
          </template>
        </div>
      </div>
      <!--移动端图示以及筛选按钮-->
      <div class="chart-title">
        <!--移动端图示-->
        <!--        <div class="item-wrap">
                  <div
                    v-for="(item,index) in classes"
                    class="item">
                    <i :style="{background:getColor(index)}"></i>{{item.className}}
                  </div>
                </div>-->
        <!--移动端筛选按钮-->
        <!--        <div class="screen-wrap">
                  <div @click="isShowPop = true">
                    <img src="/static/img/screen_icon.png"/>
                    筛选
                  </div>
                </div>-->
      </div>
      <!--刻度-->
      <div class="num-wrap">
          <span
            :style="{position:'absolute',bottom:100 / 6 * index + '%'}"
            v-for="(num,index) in numArray">
              {{num}}
          </span>
      </div>
      <div class="chart-body">

        <div class="chart-main">
          <!--刻度线n条-->
          <div class="line-wrap">
            <div class="line" v-for="i in 5" :style="{top:100/6 * i+'%'}"></div>
          </div>
          <!--柱形图数据-->
          <div
            v-for="(time,index) in series"
            class="chart-item">
            <h2 class="chartH2" :style="{width:((result.classModels.length*20+50)>74?(result.classModels.length*20+50):74)+'px'}">第{{index + 1}}次测试</h2>
            <div style="height: 50%;" class="scoreContent">
              <el-tooltip class="item" effect="light" :content="classes[index2].className+', '+score+'分'" :placement="score>0?'top':'bottom'" v-for="(score,index2) in time">
                <div
                  v-show="isShowScore(index2)"
                  @click="showOrNot(index2,classChooseed)"
                  :class="{'reverse':score> 0, ling:score === 0}"
                  :style="{
                  height:computedWidth(score) +'%',
                background:getColor(index2)}"
                  class="average-score">
                  <!--@click="showOrNot(index2,classChooseed)"-->
                 <!-- @click="showLable(time,index,score,index2)"-->
                </div>
              </el-tooltip>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="nodata">
      暂无数据
    </div>
    <!--移动端班级选择-->
    <!--    <div @click="isShowPop = false" class="pop-view " :class="isShowPop ? 'act' : ''">
          <div class="pop-main" @click.stop>
            <div class="pop-title">
              <span @click="isShowPop = false">取消</span>
              <span class="sure" @click="isShowPop = false">确定</span>
            </div>
            <div class="pop-bottom">
              <div
                v-for="(item,index) in classes"
                :class="{act:item.act}"
                @click="classSelect(index)"
                class="item-wrap">
                <div
                  :style="{borderColor:item.act ?  getColor(index):'#d6d6d6'}"
                  class="item">
                  {{item.className}}
                </div>
              </div>
            </div>
          </div>
        </div>-->
  </div>
</template>
<script>
  function filterData({classModels, classStandardModels, examModels}) {
    return classModels.reduce((classes, class1) => {
      classes.push(
        examModels.reduce((times, time) => {
          times.push(
            classStandardModels.find(item => item.classCode == class1.classCode && item.releaseExamCode == time.examCode) || class1
          );
          return times;
        }, [])
      );
      return classes;
    }, [])
  }

  function getCriticalValue(max) {
    let tempNum = 0;
    max *= 10;
    while (max > (tempNum += 3)) ;
    return tempNum / 10;
  }

  export default {
    components: {},
    props: {},
    beforeCreate() {
    },
    created() {
    },
    mounted() {
      $(window).resize(()=>{
        if(this.$route.path.indexOf("class4"!=-1)){
          this.controlWidth();
        }
      });

      this.$ajax.getStandardChangeScore(this.localData.get("reportData"))
        .then(({httpCode, result}) => {
          if (httpCode === '200') {
            if (result) {
              if( result.classModels){
                for (var i = 0; i < result.classModels.length; i++) {
                  result.classModels[i].act = true;
                }
              }
              this.result = result;
              this.classAndTime = filterData(result);

            }
          } else {
            this.$message('获取平均分数据失败');
          }
        }).then(()=>{//pc端添加
        this.classes.forEach((item,index)=>{
//            this.classChooseed.push(item.classCode);
          this.classChooseed.push(index);//checkbox存classCode不如存序号
        })
        this.controlWidth();
        new IScroll('.chart-body', {
          mouseWheel: true,
          scrollbars: true,
          scrollX:true,
          bounce:false,
        });
      });
    },
    data() {
      return {
        tabTitle: ["标准分平均分", "柱状图"],
        tabIndex: 0,
        classAndTime: '',
        result: [],
        isShowPop: false,
        classChooseed: [],
        classForChoose: ['上海', '北京','1'],//不用此字段,改用filterData生成的classes
        messageBol:true,//处理勾选剩余2个选项的时候,也弹出提示的bug.
      }
    },
    methods: {
      controlWidth(){
        let chartbodyWidth=document.getElementsByClassName("chart-body")[0].offsetWidth;
        let chartMain=document.getElementsByClassName("chart-main")[0];
        let width=this.result.classModels.length*22*this.result.examModels.length+this.result.examModels.length*50;
        width=width>chartbodyWidth?width:chartbodyWidth-4;
        chartMain.style.width=width+'px';
      },
      /*显示label*/
      showLable(time,index,score,index2){
        //time,当前测试各个班级分数,index第几次测试,需要加1,当前分数,当前班级
        console.log(arguments)
      },
      /*柱形条点击事件*/
      showOrNot(index,arr){
        console.log(arguments)
        return;
        let position=this.classChooseed.indexOf(index);
//        console.log(position);
        if(position!=-1&&this.classChooseed.length>1){
          this.classChooseed.splice(position,1);
        }
        this.checkboxFn(this.classChooseed);
      },
      /*pc端多选按钮组事件*/
      checkboxFn(){
//        console.log(arguments[0].length)
        console.log(444444444)
        if(arguments[0].length==1&&this.messageBol){
          this.$message('至少保留一个班级');
        }
        this.messageBol=true;
        //重置
        this.result.classModels.forEach((item,index)=>{
          item.act=false
        })
        //对应显示
        for(let i=0;i<arguments[0].length;i++){
          this.result.classModels[arguments[0][i]].act=true;
        }
        let h2s=document.getElementsByClassName("chartH2");
        if(arguments[0].length>1){
          for(let i=0;i<h2s.length;i++){
            h2s[i].style.width=arguments[0].length*20+50+'px';
          }
        }
      },
      /*移动端选择班级事件*/
      /*      classSelect(index) {
       let classes = this.result.classModels;
       if (!classes[index].act) {
       this.$set(classes[index], 'act', !classes[index].act);
       return;
       }
       let flag = classes.reduce((time, item) => {
       if (item.act) time++;
       return time;
       }, 0);
       if (flag == 1) {
       this.$toast('最少保留一个班级!');
       } else {
       this.$set(classes[index], 'act', !classes[index].act);

       }

       },*/
      getColor(index) {
        let colors = ['#93bcf2', '#b8e4be', '#fbc05e', '#f5aaaa', '#fbe083', '#d9a1eb', '#fc898f', '#949dd4', '#bdaddb', '#88dbf3'],
          length = colors.length - 1;
        return colors[index % length];
      },
      computedWidth(num) {
        if (num === undefined) {
          return 0;
        } else if (num) {
          num = Math.abs(num);
          return num / this.getCriticalNum * 100;
        } else {
          return 2;
        }
      },
      isShowScore(index){
        return this.result.classModels[index].act;
      }
    },
    watch: {
      classChooseed:function(new1,old1){
        if(new1.length==1&&old1.length==1){

        }
        console.log(new1.length,old1.length)
        this.messageBol=false;
      }
    },
    computed: {
      classes() {
        return this.result.classModels ? this.result.classModels : [];
      },
      getCriticalNum() {
        if (!this.result.classStandardModels) {
          return 0.3;
        } else {
          return getCriticalValue(
            this.result.classStandardModels.reduce((max, item) => {
              let temp = Math.abs(item.avgStandardScore);
              return max > temp ? max : temp;
            }, 0)
          )
        }
      },
      numArray() {
        let length = 7,
          duanNum = (length - 1) / 2,
          arr = [],
          tempNum = (this.getCriticalNum) * 10,
          stepNum = tempNum / duanNum;
        for (let i = 0; i < length; i++) {
          arr.push((i * stepNum - tempNum) / 10)
        }
        return arr;
      },
      series() {
        if (this.classAndTime) {
          return this.classAndTime[0].reduce((times, time, index) => {
            times.push(
              this.classAndTime.reduce((scores, item) => {
                scores.push(item[index].avgStandardScore);
                return scores;
              }, [])
            )
            return times;
          }, [])
        } else {
          return []
        }

      }
    },
    filters: {},

  }
</script>
<style lang="scss">
  // rem
  @function rem($arguments) {
    @return $arguments/46.875*1rem;
  }

  @mixin text-over {
    overflow: hidden; /*自动隐藏文字*/
    text-overflow: ellipsis; /*文字隐藏后添加省略号*/
    white-space: nowrap; /*强制不换行*/
  }

  .el-tooltip__popper{
    /*background: red!important;*/
  }
  /*  .pop-view {
      z-index: 11;
      width: 100%;
      height: 100%;
      position: fixed;
      bottom: 0;
      left: 100%;
      transition: .5s all;
      &.act {
        left: 0;
        background: rgba(0, 0, 0, .4);
      }
      .pop-main {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 40%;
        background: #fff;
        $t: rem(88);
        .pop-title {
          background-color: rgba(238, 238, 238, 1);

          line-height: $t;
          height: $t;
          padding: 0 rem(33);
          color: #666666;
          font-size: rem(30);
          .sure {
            color: #20d094;
            float: right;
          }
        }
        .pop-bottom {
          position: absolute;
          top: $t;
          right: 0;
          left: 0;
          bottom: 0;
          overflow: scroll;
          padding: rem(30) rem(30) rem(30) 0;
          &:after {
            clear: both;
            content: '';
            display: block;
          }
          .item-wrap {
            width: 33.3%;
            float: left;
            padding: {
              left: rem(35);
              bottom: rem(30);
            }
            .item {
              padding: 0 4px;
              height: rem(60);
              line-height: rem(60);
              transition: .3s all;
              @include text-over;
              text-align: center;
              font-size: rem(30);
              color: #808080;
              border: solid 2px rgba(214, 214, 214, 1);

            }
            &.act .item {
              border: solid 2px rgba(32, 208, 148, 1);
              color: #4d4d4d;
            }
          }

        }
      }
    }*/

  .rp-div.class4 {
    background: #fff;
    padding-bottom:40px;
    .nodata{
      height:100px;
      line-height:100px;
      font-size:20px;
      background:#fff;
      margin-top: 20px;
      margin-left:18px;
    }
    .titlePc{
      font-size:20px;
      text-align: left;
      border-bottom:1px solid #e1e5ec;
      padding:10px 40px;
    }
    .table-wrap {
      color: #A59797;
      width: 80%;
      max-height:600px;
      margin:0 auto;
      overflow: auto;
      margin-top:25px;
      .class-wrap {
        text-align: center;
        color: #A59797;
        min-width: 4rem;
        font-size: .6rem;
        display: flex;
        border-bottom: 1px solid #fff;
        .time {
          font-size:16px;
          width: 257px;
          height:36px;
          line-height:36px;
          background: #e1edf1;
          color: #505050;
          display: table-cell;
          flex: 1;
          border-right: 1px solid #fff;
          vertical-align: middle;
          span {
            vertical-align: middle;
          }
          &.red{
            color:red;
          }
          &:last-child {
            border-right: 0;
          }
        }
        &:first-child .time {
          background: #8bb6c4;
          color:#ffffff;
        }
      }
    }
    #average-chart {
      /*overflow: auto;*////
      width:80%;
      height:500px;///
      margin:0 auto;
      margin-top:50px;
      margin-bottom:100px;///
      position:relative;
      /*background:red;///*/
      .pcChartTitle{
        * {
          color: #999999;
          font-size:16px;
        }
        display: flex;
        .item-wrap {
          flex: 1;
          &:after {
            content: '';
            display: block;
            clear: both;
          }
          .item {
            @include text-over;
            font-size: 16px;
            float: left;
            width: 14%;
            min-width: 100px;
            padding: 0 0 rem(30) 0;
            i {
              display: inline-block;
              vertical-align: middle;
              $temp: 50;
              width: rem($temp);
              height: rem($temp);
              border-radius: 50%;
              background: red;
              margin: 0 rem(10);
            }
            .el-checkbox__label{
              display: inline-block;
              font-size:16px;
              /*color:red;*/
            }
          }

        }

      }
      /*移动端图示以及筛选按钮*/
      /*      .chart-title {
              * {
                color: #999999;
              }
              display: flex;
              .item-wrap {
                flex: 1;
                &:after {
                  content: '';
                  display: block;
                  clear: both;
                }
                .item {
                  @include text-over;
                  font-size: 16px;
                  float: left;
                  width: 25%;
                  padding: 0 0 rem(30) 0;
                  i {
                    display: inline-block;
                    vertical-align: middle;
                    $temp: 20;
                    width: rem($temp);
                    height: rem($temp);
                    border-radius: 50%;
                    background: red;
                    margin: 0 rem(10);
                  }
                }
              }
              !*      .screen-wrap {
                      min-height: 1rem;
                      width: rem(115);
                      border-left: 1px solid #e2e2e2;
                      font-size: rem(24);
                      img {
                        padding: {
                          left: rem(19)
                        }
                        width: rem(22);
                        vertical-align: middle;
                      }
                    }*!
            }*/
      .num-wrap {
        display: inline-block;
        width:20px;
        /*background:red;*/
        position: absolute;
        height:481px;
        margin-bottom:10px;
        z-index: 2;
        top:49px;
        left:0;
        span {
          transform: translate(-50%);
          color: #808080;
          font-size:16px;
          /*line-height: rem(19);*/
          &:first-child {
           /* transform: translate(0);*/
          }
          &:last-child {
            /*transform: translate(-100%);*/
          }
        }
      }
      .chart-body {
        text-align:left;
        border: solid 2px #bfdee7;
        /*max-height:600px;*////
        margin-left:30px;
        height:100%;///
        width:97%;///
        /*background:orange;///*/
        /*overflow-x:auto;*/
        overflow:hidden;///
        /*padding: rem(40) rem(43) 30px;*/
        position: relative;
        .chart-main {
          display: inline-block;
          position: relative;
          /*border: solid 2px #bfdee7;*/
          /*min-height: 100px;*////
          width:100%;//js控制
          min-width:100px;
          height:100%;
          /*background:yellow;*/
          /*overflow: auto;///*/
          text-align:left;
          .line-wrap {
            position:absolute;
            left:0;
            top:0;
            width:100%;
            height:100%;
            .line {
              position: absolute;
              /*top: 0;*/
              width: 100%;
              height: 1px;
              background: #ededed;
              &:nth-of-type(3){
                background:#8391a5;
              }
            }
          }
          .chart-item {
            &:after{
              position: absolute;
              top:238px;
              right:0px;
              content:"";
              display: block;
              width:2px;
              height:10px;
              background:#8391a5;
            }
            box-sizing: border-box;
            padding-left:25px;
            padding-right:25px;
/*            margin-left:1px;
            margin-right:1px;
            border-left:1px solid red;
            border-right:1px solid #e0e5f1;*/
            height:100%;///
            width:auto;///
            display: inline-block;
            position: relative;
            vertical-align: top;
            /*background:rebeccapurple;*/
            /*margin-right:100px;//临时*/
            z-index: 2;
            text-align: left;
/*            padding: {
              top: rem(38);
            }*/
            .scoreContent{
              display: inline-block;
              /*background:green;*/
              position:relative;
              margin-top:248px;
              /*width:222px;*/
            }
            &:last-child{
              padding-bottom:20px;
            }
            h2 {
              position:absolute;
              bottom:0;
              width:100px;//js控制
              text-align: center;
              font-size: 14px;
              color: #666666;
              line-height: 30px;
              font-weight: normal;
              /*background:red;*/
              height:30px;
              left: 0px;
            }
            .average-score {
              /*position: relative;*/
              vertical-align: top;
              display: inline-block;
              z-index: 1;
              width: 20px;
              border-radius: 20px;
              background: red;
              &.reverse {
                transform: translate(0,-100%);
              }
              &.ling {
                transform: translate(0,-40%);
              }
            }
          }
        }
      }

    }
  }
</style>

