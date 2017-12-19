<template>
  <div class="rp-div">
    <div class="hg-div" v-if="isEmptyObject(result)!=true&&result!=null">
      <span>0</span>
      <span style="float: right;">20</span>
      <ul>
        <li class="hg-ul-dot"></li>
        <li class="hg-ul-lang"><span>4</span></li>
        <li class="hg-ul-lang" style="left: 40%"><span>8</span></li>
        <li class="hg-ul-lang" style="left: 60%"><span>12</span></li>
        <li class="hg-ul-lang" style="left: 80%"><span>16</span></li>
        <li class="mast-c" v-for="(item, index, indexs) in result">
          <p class="hg-classname"><span style="z-index: 999">{{index}}</span></p>
          <p class="hg-num">
            <span class="hg-num-s" v-bind:style="{ width: item/20*100 + '%',background: color[indexs%6]}"></span>
          </p>
        </li>
      </ul>
    </div>
    <div v-else class="nodata">
      暂无数据
    </div>
  </div>
</template>

<script>
  //  import config from '../../config/config'
  export default {
    data() {
      return {
        result: {},
        color: [
          '#69A4FD',
          '#FFDD67',
          '#FF7979',
          '#7EDCFF',
          '#73E794',
          '#C082D4'
        ]
      }
    },
    mounted: function () {
      this.getSourceDate()
    },
    methods: {
      getSourceDate: function () {

        let url = this.getrequestInterface('teacherReport/getClassWrongKnowledge')

        this.$http.get(url)
          .then(res => {

            if (res.body.message == "Success") {

              if (this.isEmptyObject(res.body.result)) {

                console.log('结束');

                return;

              }

              this.result = res.body.result

            }

          }, res => {

            console.log(res)

          });

      }
    }
  }
</script>

<style lang="scss" scoped>
  .rp-div {
    /*margin-top: 0.4rem;*/
    background: #fff;
    text-align: left;
    display: block;
    .titlePc {
      font-size: 20px;
      text-align: left;
      border-bottom: 1px solid #e1e5ec;
      padding: 10px 40px;
    }
    .nodata {
      height: 100px;
      line-height: 100px;
      font-size: 20px;
      background: #fff;
      margin-top: 20px;
      margin-left: 18px;
      text-align: center;
    }
  }

  /*下面是从h5复制的，有空来调*/
  /*  .rp-div {
      margin-top: 0.4rem;
      padding:0.5rem;
      background: #fff;
    }*/
  .rp-table table {
    min-width: 100%;
    background: #F8F8F8;
    border-radius: 10px;
    font-size: 0.6rem;
    color: #828282;
    margin-bottom: 2rem;
    border-right: 1px solid #F8F8F8;
  }

  .rp-table table tr:first-child {
    background: #FFEFEF
  }

  .rp-table td {
    min-width: 5rem;
    text-align: center;
    line-height: 1.6rem;
    border-bottom: 1px solid #fff;
    border-right: 1px solid #fff;
  }

  .rp-table tr td:last-child {
    border-right: 0;
  }

  .hg-div {
    margin-top: 0.3rem;
    color: #666666;
    font-size: 0.6rem;
  }

  .hg-div ul {
    border: 1px solid #FFA1A1;
    padding-top: 0.3rem;
    padding-bottom: 0.3rem;
    position: relative;
    span {
      margin-top: -8px;
    }
  }

  .hg-ul-dot {
    position: absolute;
    display: block;
    top: 0;
    left: 0;
    margin-left: -0.1rem;
    margin-top: -0.1rem;
    width: 0.2rem;
    height: 0.2rem;
    background: #FF9E9E;
    border-radius: 0.1rem;
  }

  .hg-ul-lang {
    position: absolute;
    display: block;
    top: 0;
    left: 20%;
    width: 1px;
    height: 100%;
    background: #FFE8E8;
  }

  .hg-ul-lang span {
    position: absolute;
    top: -0.8rem;
    left: -0.5rem;
  }

  .hg-div {

    margin-top: 0.3rem;
    color: #666666;
    font-size: 16px;
  }

  .hg-div .hg-classname {
    margin-top: 0.3rem;
    margin-bottom: 0.3rem;
    padding-left: 0.5rem;
    z-index: 999 !important;
  }

  .hg-div .hg-num {
    height: 30px;
    border-radius: 0.6rem;
    overflow: hidden;
    color: #fff;
    background: #EAEAEA;
  }

  .hg-num .hg-num-s {
    display: inline-block;
    background: #6DA7FE;
    height: 50px;
    border-radius: 0.6rem;
  }

  .mast-c {
    position: relative;
    z-index: 999;
  }
</style>
