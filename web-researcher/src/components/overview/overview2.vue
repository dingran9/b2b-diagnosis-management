<template>
  <div style="min-width: 1240px">
    <section class="content-right-title-wrap">
      <h2 class="title">概览</h2>
      <div id="allmap"></div>
    </section>
    <div class="tuli">
      <p class="tt">教学进度:</p>
      <p class="tu"><span style="background: #e51c24;"></span>未完成</p>
      <p class="tu"><span style="background: #5fd09c;"></span>按时完成</p>
      <p class="tu"><span style="background: #369dea;"></span>部分完成</p>
      <p class="tu"><img src="../../../static/img/shangshang.png" alt="">历史成绩对比(上升)</p>
      <p class="tu"><img src="../../../static/img/xiaxia.png" alt="">历史成绩对比(下降)</p>
    </div>
    <el-dialog
      custom-class="dialogWidth"
      title=""
      :visible.sync="dialogVisible">
      <div class="container" id="container" v-show="container == 2"></div>
      <div class="container" id="container2" v-show="container == 3"></div>
      <!--<el-button @click="dialogVisible = false">进度</el-button>-->
      <el-button @click="container = 2">学生成绩变化</el-button>
      <el-button @click="container = 3">教师教学水平</el-button>
      <!--<span slot="footer" class="dialog-footer">-->
      <!--<el-button @click="dialogVisible = false">取 消</el-button>-->
      <!--<el-button type="primary" @click="dialogVisible = false">确 定</el-button>-->
      <!--</span>-->
    </el-dialog>

  </div>
</template>
<script>
  import img111 from '../../../static/img/xiaoqizi.png'
  import shangshang from '../../../static/img/shangshang.png'
  import xiaxia from '../../../static/img/xiaxia.png'
  export default {
    components: {},
    data(){
      return {
        chengji: [
          {
            school: "北京市广渠门中学",
            xAxis: ['2017.9.25  第一次月考', '2017.10.23第二次月考', '2017.11.13期中考试'],
            series: [{
              name: '成绩变化曲线',
              data: [221.5, 216.7, 223.4]
            }],
          },
          {
            school: "北京市第一六五中学",
            xAxis: ['2017.9.25  第一次月考', '2017.10.23第二次月考', '2017.11.13期中考试'],
            series: [{
              name: '成绩变化曲线',
              data: [213.8, 218.7, 213.5]
            }],
          },
          {
            school: "北京市第五十四中学",
            xAxis: ['2017.9.25  第一次月考', '2017.10.23第二次月考', '2017.11.13期中考试'],
            series: [{
              name: '成绩变化曲线',
              data: [216.4, 222.7, 220.3]
            }],
          },
          {
            school: "北京市东直门中学",
            xAxis: ['2017.9.25  第一次月考', '2017.10.23第二次月考', '2017.11.13期中考试'],
            series: [{
              name: '成绩变化曲线',
              data: [256.1, 264.4, 257.2]
            }],
          },
          {
            school: "北京第二十五中学",
            xAxis: ['2017.9.25  第一次月考', '2017.10.23第二次月考', '2017.11.13期中考试'],
            series: [{
              name: '成绩变化曲线',
              data: [248.4, 256.5, 246.3]
            }],
          },
          {
            school: "北京汇文中学",
            xAxis: ['2017.9.25  第一次月考', '2017.10.23第二次月考', '2017.11.13期中考试'],
            series: [{
              name: '成绩变化曲线',
              data: [252.6, 261.1, 263.2]
            }],
          },
          {
            school: "北京市东城区西中街小学",
            xAxis: ['2017.9.25  第一次月考', '2017.10.23第二次月考', '2017.11.13期中考试'],
            series: [{
              name: '成绩变化曲线',
              data: [231.8, 236.6, 241.2]
            }],
          },
          {
            school: "北京市东城区景泰小学",
            xAxis: ['2017.9.25  第一次月考', '2017.10.23第二次月考', '2017.11.13期中考试'],
            series: [{
              name: '成绩变化曲线',
              data: [239.5, 241.1, 245.9]
            }],
          },
          {
            school: "北京市东城区东四九条小学",
            xAxis: ['2017.9.25  第一次月考', '2017.10.23第二次月考', '2017.11.13期中考试'],
            series: [{
              name: '成绩变化曲线',
              data: [236.6, 241.4, 237.2]
            }],
          },
          {
            school: "北京市第二十二中学",
            xAxis: ['2017.9.25  第一次月考', '2017.10.23第二次月考', '2017.11.13期中考试'],
            series: [{
              name: '成绩变化曲线',
              data: [251.6, 252.5, 242.9]
            }],
          }],
        biaozhunfen: [
          {
            school: "北京市广渠门中学",
            xAxis: ['2017.9.25  第一次月考', '2017.10.23第二次月考', '2017.11.13期中考试'],
            series: [{
              name: '标准分',
              data: [-0.0389, 0.0717, -0.0912]
            }],
          },
          {
            school: "北京市第一六五中学",
            xAxis: ['2017.9.25  第一次月考', '2017.10.23第二次月考', '2017.11.13期中考试'],
            series: [{
              name: '标准分',
              data: [-0.16, 0.11, 0.20]
            }],
          },
          {
            school: "北京市第五十四中学 ",
            xAxis: ['2017.9.25  第一次月考', '2017.10.23第二次月考', '2017.11.13期中考试'],
            series: [{
              name: '标准分',
              data: [0.1192, 0.2627, 0.1685]
            }],
          },
          {
            school: "北京市东直门中学",
            xAxis: ['2017.9.25  第一次月考', '2017.10.23第二次月考', '2017.11.13期中考试'],
            series: [{
              name: '标准分',
              data: [0.0416, 0.0549, -0.0502]
            }],
          },
          {
            school: "北京第二十五中学",
            xAxis: ['2017.9.25  第一次月考', '2017.10.23第二次月考', '2017.11.13期中考试'],
            series: [{
              name: '标准分',
              data: [0.2746, 0.3056, 0.1726]
            }],
          },
          {
            school: "北京汇文中学",
            xAxis: ['2017.9.25  第一次月考', '2017.10.23第二次月考', '2017.11.13期中考试'],
            series: [{
              name: '标准分',
              data: [-0.4875, -0.5654, -0.1285]
            }],
          },
          {
            school: "北京市东城区西中街小学",
            xAxis: ['2017.9.25  第一次月考', '2017.10.23第二次月考', '2017.11.13期中考试'],
            series: [{
              name: '标准分',
              data: [0.0659, 0.0075, 0.1336]
            }],
          },
          {
            school: "北京市东城区景泰小学",
            xAxis: ['2017.9.25  第一次月考', '2017.10.23第二次月考', '2017.11.13期中考试'],
            series: [{
              name: '标准分',
              data: [-0.3206, -0.032, -0.2395]
            }],
          },
          {
            school: "北京市东城区东四九条小学",
            xAxis: ['2017.9.25  第一次月考', '2017.10.23第二次月考', '2017.11.13期中考试'],
            series: [{
              name: '标准分',
              data: [0.1696, 0.0164, 0.078]
            }],
          },
          {
            school: "北京市第二十二中学",
            xAxis: ['2017.9.25  第一次月考', '2017.10.23第二次月考', '2017.11.13期中考试'],
            series: [{
              name: '标准分',
              data: [-0.0281, -0.2359, -0.0211]
            }],
          }],
        container: 3,
        dialogVisible: false
      }
    },
    mounted(){
//      this.chengjibianhua()
      let rootThis = this
      let schooList = [
        {"jing": 116.44, "wei": 39.9, "name": '北京市广渠门中学', "color": "#e51c24", "position": 0,"num":0,"flag":true},
        {"jing": 116.41, "wei": 39.941, "name": '北京市第二十二中学', "color": "#5fd09c", "position": -8,"num":1,"flag":false},
        {"jing": 116.43, "wei": 39.96, "name": '北京市第五十四中学', "color": "#5fd09c", "position": -8,"num":2,"flag":false},
        {"jing": 116.43, "wei": 39.95, "name": '北京市东直门中学', "color": "#5fd09c", "position": -8,"num":3,"flag":false},
        {"jing": 116.41, "wei": 39.92, "name": '北京第二十五中学', "color": "#5fd09c", "position": -8,"num":4,"flag":false},
        {"jing": 116.42, "wei": 39.88, "name": '北京汇文中学', "color": "#5fd09c", "position": -8,"num":5,"flag":true},
        {"jing": 116.441, "wei": 39.94, "name": '北京市东城区西中街小学 ', "color": "#369dea", "position": -18,"num":6,"flag":true},
        {"jing": 116.41, "wei": 39.87, "name": '北京市东城区景泰小学', "color": "#5fd09c", "position": -8,"num":7,"flag":true},
        {"jing": 116.42, "wei": 39.93, "name": '北京市东城区东四九条小学', "color": "#369dea", "position": -18,"num":8,"flag":false},
        {"jing": 116.417, "wei": 39.9357, "name": '北京市第一六五中学 ', "color": "#5fd09c", "position": -8,"num":9,"flag":false},
      ]
      var map = new BMap.Map("allmap");
      map.centerAndZoom(new BMap.Point(116.42, 39.93), 13);
      // 复杂的自定义覆盖物
      function ComplexCustomOverlay(point, text, mouseoverText, color, position, num, flag) {
        this._point = point;
        this._text = text;
        this._overText = mouseoverText;
        this._color = color;
        this._position = position;
        this._num = num;
        this._flag = flag;
      }

      ComplexCustomOverlay.prototype = new BMap.Overlay();
      ComplexCustomOverlay.prototype.initialize = function (map) {
        this._map = map;
        var div = this._div = document.createElement("div");
        div.style.position = "absolute";
        div.style.zIndex = BMap.Overlay.getZIndex(this._point.lat);
        div.style.backgroundColor = this._color;
        div.style.color = "white";
        div.style.height = "24px";
        div.style.padding = "2px";
        div.style.lineHeight = "18px";
        div.style.whiteSpace = "nowrap";
        div.style.MozUserSelect = "none";
        div.style.fontSize = "12px"
        var span = this._span = document.createElement("span");
        div.appendChild(span);
        var imgimg = document.createElement("img")
        imgimg.src = this._flag?shangshang:xiaxia
        imgimg.style.position = 'absolute'
        imgimg.style.top = "1px";
        imgimg.style.left = "-26px";
        imgimg.style.width = "20px";
        span.style.position = 'relative'
        span.appendChild(imgimg)
        span.appendChild(document.createTextNode(this._text));
        var arrow = this._arrow = document.createElement("div");
        arrow.style.background = "url(http://oybhh2y2e.bkt.clouddn.com/biz/img/201711201439584548222.png) no-repeat";
        arrow.style.backgroundPosition = 0 + "px " + this._position + "px"
        arrow.style.position = "absolute";
        arrow.style.width = "11px";
        arrow.style.height = "10px";
        arrow.style.top = "22px";
        arrow.style.left = "10px";
        arrow.style.overflow = "hidden";
        div.appendChild(arrow);
        let toText = this._text
        let toNum = this._num
        div.onclick = function (e) {
          attribute(toText,toNum)
        }
        map.getPanes().labelPane.appendChild(div);
        return div;
      }
      ComplexCustomOverlay.prototype.draw = function () {
        var map = this._map;
        var pixel = map.pointToOverlayPixel(this._point);
        this._div.style.left = pixel.x - parseInt(this._arrow.style.left) + "px";
        this._div.style.top = pixel.y - 30 + "px";
      }
      var txt = "银湖海岸城", mouseoverTxt = txt + " " + parseInt(Math.random() * 1000, 10) + "套";
      for (let i = 0; i < schooList.length; i++) {
        var myCompOverlay = new ComplexCustomOverlay(new BMap.Point(schooList[i].jing, schooList[i].wei), schooList[i].name, mouseoverTxt, schooList[i].color, schooList[i].position, schooList[i].num, schooList[i].flag);
        map.addOverlay(myCompOverlay);
      }
      map.disableDoubleClickZoom()
      var styleJson = [
        {
          "featureType": "land",
          "elementType": "geometry.fill",
          "stylers": {}
        },
        {
          "featureType": "all",
          "elementType": "labels",
          "stylers": {
            "visibility": "off"
          }
        }
      ]
      map.setMapStyle({styleJson: styleJson});
      function getBoundary() {
        var bdary = new BMap.Boundary();
        bdary.get("东城区", function (rs) {       //获取行政区域
//          map.clearOverlays();        //清除地图覆盖物
          var count = rs.boundaries.length; //行政区域的点有多少个
          if (count === 0) {
            alert('未能获取当前输入行政区域');
            return;
          }
          var pointArray = [];
          for (var i = 0; i < count; i++) {
            var ply = new BMap.Polygon(rs.boundaries[i], {
              strokeWeight: 6,
              strokeColor: "#ff0000",
              fillColor: "null",   //是否需要填充色
              fillOpacity: 0.1 //填充色的透明度，0~1之间
            }); //建立多边形覆盖物
            map.addOverlay(ply);  //添加覆盖物
            pointArray = pointArray.concat(ply.getPath());
          }
          map.setViewport(pointArray);    //调整视野
//          addlabel();
        });
      }

      getBoundary();
      function attribute(schoolName,num) {
        rootThis.dialogVisible = true
//        rootThis.chengjibianhua(schoolName)
//        rootThis.jiaoshibianhua(schoolName)
        rootThis.$nextTick(() => {
          rootThis.chengjibianhua(schoolName,num)
        });
        rootThis.$nextTick(() => {
          rootThis.jiaoshibianhua(schoolName,num)
        });
      }
    },
    methods: {
      change(){

      },
      //成绩变化
      chengjibianhua(name,num){
        console.log(num);
        let data = this.chengji[num]
        Highcharts.chart('container', {
          title: {
            text: '2017 ~ 2018 年' + name + '成绩情况'
          },
          credits: {
            enabled: false //不显示LOGO
          },
          xAxis: {
            categories: data.xAxis,
          },
          yAxis: {
            title: {
              text: '成绩总分'
            }
          },
          legend: {
            verticalAlign: 'bottom'
          },
//          plotOptions: {
//            series: {
//              label: {
//                connectorAllowed: false
//              },
//              pointStart: 2010
//            }
//          },
          plotOptions: {
            line: {
              dataLabels: {
                enabled: true          // 开启数据标签
              },
              enableMouseTracking: false // 关闭鼠标跟踪，对应的提示框、点击事件会失效
            }
          },
          series: data.series,
          responsive: {
            rules: [{
              condition: {
                maxWidth: 500
              },
              chartOptions: {
                legend: {
                  layout: 'horizontal',
                  align: 'center',
                  verticalAlign: 'bottom'
                }
              }
            }]
          }
        });
      },
      jiaoshibianhua(name,num){
        let data = this.biaozhunfen[num]

        Highcharts.chart('container2', {
          title: {
            text: '2017 ~ 2018年' + name + '教师教学水平'
          },
          credits: {
            enabled: false //不显示LOGO
          },
          xAxis: {
            categories: data.xAxis,
          },
          yAxis: {
            title: {
              text: '教师教学水平标准分'
            }
          },
          legend: {
            verticalAlign: 'bottom'
          },
//          plotOptions: {
//            series: {
//              label: {
//                connectorAllowed: false
//              },
//              pointStart: 2010
//            }
//          },
          plotOptions: {
            line: {
              dataLabels: {
                enabled: true          // 开启数据标签
              },
              enableMouseTracking: false // 关闭鼠标跟踪，对应的提示框、点击事件会失效
            }
          },
          series: data.series,
          responsive: {
            rules: [{
              condition: {
                maxWidth: 500
              },
              chartOptions: {
                legend: {
                  layout: 'horizontal',
                  align: 'center',
                  verticalAlign: 'bottom'
                }
              }
            }]
          }
        });
      },
    },
    computed: {},
    filters: {}

  }
</script>
<style>
  .dialogWidth {
    min-width: 760px;
  }
</style>
<style lang="scss" scoped>
  @import '../../../static/css/contentRight';

  #allmap {
    width: calc(100% - 300px);
    min-width: 900px;
    height: 800px;
    float: left;
    margin-top: 20px;
  }

  .container {
    width: 700px;
    height: 400px;
    margin: 0 auto;
  }

  .tuli {
    width: 300px;
    height: 800px;
    float: left;
    background: white;
    .tt {
      padding: 0 20px;
      text-align: left;
      line-height: 60px;
    }
    .tu {
      padding: 0 20px;
      text-align: left;
      line-height: 60px;
      font-size: 17px;
      img {
        vertical-align: middle;
        margin-right: 12px;
      }
      span {
        display: inline-block;
        width: 60px;
        height: 35px;
        border-radius: 3px;
        vertical-align: middle;
        margin-right: 15px;
      }
    }
  }

  .BMap_cpyCtrl, .anchorBL, .highcharts-credits {
    display: none !important;
  }

  .gailan {
    width: 900px;
    height: 1000px;
    margin: 0 auto;
    background: url("../../../static/img/pengjiang.png") no-repeat;
    background-size: contain;
  }
  .content-right-title-wrap { //我的班级
    min-width: 1200px;
    .body {
      overflow: hidden;
      vertical-align: middle;
      padding: 0 40px 10px;
      .classListTitle {
        float: left;
        width: 120px;
        text-align: center;
        display: inline-block;
        color: #5e5e5e;
        font-size: 18px;
        line-height: 38px;
        height: 38px;
        margin-right: -60px;
        margin-top: 20px;
        /*background:red;*/
      }
      .classListItem {
        float: left;
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
        margin-top: 20px;
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
</style>
