<template>
  <div>
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
        v-for="(know,index) in datalist"
        class="main-item">
        <div class="main-item-title" :style="{color:type == 0? '':know.color}">
          {{type == 0 ? know[title] : know[title] + ' ' + (know.flag == 0 ? '我做错了' : know.flag == 1 ? '我做对了' : '我未回答')}}
        </div>
        <div class="main-item-body">
                  <span class="num-total"
                        :style="{width:(+know[score] || 1) + '%',backgroundColor:type == 0 ? colors[index%colors.length] : '#1fd094'}"></span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    components: {},
    props: {
      datalist: {
        default() {
          return [];
        }
      }, score: {}, title: {}, type: {default: 0}
    },
    creted() {
    },
    mounted() {
    },
    data() {
      return {
        colors: ["#27ba9bi", "#5ac6ba", "#99d8ea", "#93aed4", "#ff8585", "#c486d7"],
      }
    },
    methods: {},
    computed: {},
    filters: {},
  }
</script>
<style lang="scss" scoped>
  $color1: #3CCDFE;
  @mixin wh($w,$h) {
    width: $w;
    height: $h;
  }

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
        overflow: hidden;
        $h: 30px;
        height: $h;
        width: 100%;
        border-radius: $h/2;
        background: #eaeaea;
        .num-total {
          display: inline-block;
          height: 100%;

          border-radius: $h/2;
          background: #7fcfc6;
          width: 100px;
        }
      }
    }
  }
</style>
<style lang="scss">

</style>
