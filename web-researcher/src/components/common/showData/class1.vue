<template>
  <div class="rp-div">
    <div class="getab-body-item" style="background: #fff;padding-bottom: 40px;">
      <div class="tab-title">
        试卷质量分析
      </div>
      <div class="select-wrap-4">
        选择试卷 :
        <el-select v-model="value" placeholder="请选择" @change="unitQualityofQuestionsReport">
          <el-option
            v-for="item in options"
            :key="item.code"
            :label="item.diagnosisPaperName"
            :value="item.code">
          </el-option>
        </el-select>
      </div>
      <ge-tabel class="tab-body"
                :tableData="tableData"
                :titleDataList="titleDataList"
                type="1">

      </ge-tabel>

    </div>
  </div>
</template>

<script>
  import geTabel from "../../geTeble.vue"

  export default {
    data() {
      return {
        titleDataList: [{text: '题号', keyword: 'questionSn',},
          {text: '难度系数', keyword: 'difficulty'},
          {text: '区分度', keyword: 'distinction'}]
        ,
        tableData: [],
        options: [],
        value: ''
      }
    },
    mounted() {
      this.$store.state.loading = true;
      this.$ajax.getPaperByUnit()
        .then(({result, httpCode}) => {
          this.$store.state.loading = false;
          if (this.localData.get('reportType') == 1) {
            if (httpCode == 200 && Array.isArray(result.list) && result.list.length) {
              this.$set(this, 'options', result.list);
              this.$nextTick(() => this.value = result.list[0].code);
            } else {
              this.$message('试卷列表为空');
            }
          }else{
            if (httpCode == 200 && Array.isArray(result) && result.length) {
              this.$set(this, 'options', result);
              this.$nextTick(() => this.value = result[0].code);
            } else {
              this.$message('试卷列表为空');
            }
          }
        })
    },

    methods: {
      unitQualityofQuestionsReport() {
        this.$ajax.unitQualityofQuestionsReport({paperCode: this.value})
          .then(({httpCode, result}) => {
            if (httpCode === '200') {
              result.sort((a, b) => a.questionSn - b.questionSn).forEach(i => {
                i.difficulty = +i.difficulty.toFixed(4);
                i.distinction = +i.distinction.toFixed(4);
              })
              this.$set(this, 'tableData', result)
            } else {
              console.log('请求错误,偷偷地找后端沟通吧!');
            }
          })
      }
    },
    components: {geTabel}
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  .rp-div {
    justify-content: center;
    .select-wrap-4 {
      text-align: left;
      padding: 30px 50px 0;
    }
    .titlePc {
      font-size: 20px;
      text-align: center;
      border-bottom: 1px solid #e1e5ec;
      padding: 10px 40px;
      .titleLeft {
        /*border-right:1px solid #1fd094;*/
        width: 174px;
        display: inline-block;
        text-align: center;
      }
      .titleRight {
        @extend .titleLeft;
        border: 0px;
      }
    }
    .left {
      display: inline-block;
      width: 45%;
    }
    .right {
      @extend .left;
      margin-left: 5%;
    }
  }

</style>
<style lang="scss">
  .rp-div {
    @import "../../../../static/css/selfTab.scss";
  }

</style>
