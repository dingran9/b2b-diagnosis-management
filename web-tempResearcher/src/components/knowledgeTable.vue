<template>
  <div class="report-knowledge-main">
    <span style="position: absolute;left: 100%; width: 200px;top: 25px;">知识模块掌握率</span>
    <div class="header">
      <div
        v-for="i in 6"
        :class="{first:i==1,last:i==6}"
        class="percent-num-item">
        {{100 / 5 * (i - 1)}}%
      </div>
    </div>
    <div class="main">
      <div class="line"
           :style="{left:i*20 + '%'}"
           v-for="i in 4"></div>
      <div class="dian"></div>
      <div
        v-for="(know,index) in chartData"
        class="main-item">
        <div class="main-item-title">
          {{know.knowledgeModuleName}}
        </div>
        <div class="main-item-body">
                  <span class="num-total"
                        :style="{width:know.score + '%',backgroundColor:colors[index%colors.length]}"></span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  let colors = ["#27ba9bi", "#5ac6ba", "#99d8ea", "#93aed4", "#ff8585", "#c486d7"];
  export default {
    components: {

    },
    props: {
      chartData:{
        default:[]
      }
    },
    creted() {
    },
    mounted() {
    },
    data() {
      return {colors}
    },
    methods: {},
    computed: {},
    filters: {},
  }
</script>
<style lang="scss" scoped>

  $color1: #3ccdfe;
  @mixin wh($w,$h) {
    width: $w;
    height: $h;
  }

  @mixin margin-center {
    margin: {
      left: auto;
      right: auto;
    }
  }

  .report-knowledge-main {
    position: relative;
    max-width: 650px;
    @include margin-center;
    .header {
      position: relative;
      height: 40px;
      line-height: 40px;
      .ling {
        display: inline-block;
        position: absolute;
        top: 0;
        left: 0;
      }
      .hundred {
        display: inline-block;
        position: absolute;
        top: 0;
        right: 0;
      }
      .percent-num-item {
        width: 20%;
        display: inline-block;
        float: left;
        &.first {
          width: 10%;
          text-align: left;
        }
        &.last {
          width: 10%;
          text-align: right;
        }
      }
    }
    .main {
      $color2: #7fcfc6;
      padding: 40px 0;
      position: relative;
      border: {
        top: 3px solid $color2;
        left: 3px solid $color2;
        right: 1px solid $color2;
        bottom: 1px solid $color2;
      }
      .left-wrap {
        position: absolute;
        left: 110%;
        width: 200px;
        text-align: left;
        font-size: 16px;
        color: #808080;
        .left-item {
          line-height: 40px;
          .yuan {
            $w: 20px;
            width: $w;
            height: $w;
            background: #ccc;
            margin-right: 20px;
            vertical-align: middle;
            display: inline-block;
            border-radius: $w/2;
            overflow: hidden;
          }
        }
      }
      .line {
        position: absolute;
        height: 100%;
        top: 0;
        width: 1px;
        background: $color1;
        opacity: 0.2;
      }
      .dian {
        position: absolute;
        $w: 15px;
        left: -$w/2;
        top: -$w/2;
        @include wh($w, $w);
        overflow: hidden;
        border-radius: $w/2;
        background: $color2;
      }
      .main-item {
        position: relative;
        text-align: left;
        &-title {
          line-height: 40px;
          color: #666;
          font-size: 16px;
          padding: 0 10px;
        }
        &-body {
          $h: 30px;
          height: $h;
          width: 100%;
          border-radius: $h/2;
          background: #eaeaea;
          .num-total {
            transition: .5s all;
            display: inline-block;
            height: 100%;

            border-radius: $h/2;
            background: #7fcfc6;
            width: 100px;
          }
        }
      }
    }
  }
</style>
<style lang="scss">

</style>
