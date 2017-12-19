<template>
  <div>
    <section class="content-right-title-wrap">
      <h2 class="title">概览</h2>
      <div id="allmap" style="width: 100%;height: 800px"></div>
      <!--<div class="gailan">-->
      <!--</div>-->
    </section>
    <el-dialog
      title="去看啥"
      :visible.sync="dialogVisible"
      width="30%">
      <el-button @click="dialogVisible = false">进度</el-button>
      <el-button @click="dialogVisible = false">效果</el-button>
      <el-button @click="dialogVisible = false">教师</el-button>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    components: {},
    data(){
      return {
        dialogVisible: false
      }
    },
    mounted(){
      let rootThis = this
      //初始化地图对象，加载地图
      var district, map = new AMap.Map("allmap", {
        resizeEnable: true,
        center: [116.40, 39.91],//地图中心点
        zoom: 10 //地图显示的缩放级别
      });
      map.setFeatures(["bg","road"]);
      addBeiJing();
      function addBeiJing() {
        //加载行政区划插件
        AMap.service('AMap.DistrictSearch', function() {
          var opts = {
            subdistrict: 1,   //返回下一级行政区
            extensions: 'all',  //返回行政区边界坐标组等具体信息
            level: 'city'  //查询行政级别为 市
          };
          //实例化DistrictSearch
          district = new AMap.DistrictSearch(opts);
          district.setLevel('district');
          //行政区查询
          district.search('朝阳区', function(status, result) {
            var bounds = result.districtList[0].boundaries;
            var polygons = [];
            if (bounds) {
              for (var i = 0, l = bounds.length; i < l; i++) {
                //生成行政区划polygon
                var polygon = new AMap.Polygon({
                  map: map,
                  strokeWeight: 1,
                  path: bounds[i],
                  fillOpacity: 0.7,
                  fillColor: '#CCF3FF',
                  strokeColor: '#CC66CC'
                });
                polygons.push(polygon);
              }
              map.setFitView();//地图自适应
            }
          });
        });
      }
    },
    methods: {},
    computed: {},
    filters: {}

  }
</script>
<style lang="scss" scoped>
  @import '../../../static/css/contentRight';

  .BMap_cpyCtrl {
    display: none!important;
  }

  .anchorBL {
    display: none!important;
  }
  .gailan {
    width: 900px;height: 1000px;
    margin: 0 auto;
    background: url("../../../static/img/pengjiang.png") no-repeat;
    background-size: contain;
  }
  .content-right-title-wrap{//我的班级
    .body{
      overflow:hidden;
      vertical-align: middle;
      padding: 0 40px 10px;
      .classListTitle{
        float:left;
        width: 120px;
        text-align:center;
        display: inline-block;
        color: #5e5e5e;
        font-size: 18px;
        line-height:38px;
        height:38px;
        margin-right:-60px;
        margin-top:20px;
        /*background:red;*/
      }
      .classListItem{
        float:left;
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
        margin-top:20px;
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
