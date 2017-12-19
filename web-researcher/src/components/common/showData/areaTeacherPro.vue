<template>
  <div class="rp-div">
    <div class="getab-body-item">
      <div class="tab-title">
        教学进度
      </div>
      <div style="padding:40px;background: #fff">
        <el-table
          class="sdDSFD"
          :data="tableData"
          stripe
          style="width: 100%">
          <el-table-column
            prop="date"
            label="区域"
            width="240px"
            >
            <template scope="scope">
              {{$user().get().userGroupAreaDistrictName}}
            </template>
          </el-table-column>
          <template v-if="Array.isArray(tableData[0])">
            <template v-for="ceshi in tableData[0]">
              <el-table-column
                prop="name"
                width="240px"
                :label="'第' +ceshi.sn + '次测试' "
                >
                <template scope="scope">
                  {{ceshi.startTime ? dateParse(ceshi.startTime) : ' -- '}}
                </template>
              </el-table-column>
            </template>
          </template>


        </el-table>
      </div>
    </div>
  </div>
</template>

<script>

  export default {
    data() {
      return {
        tableData: []
      }
    },
    mounted() {
      this.$store.state.loading = true;
      this.$ajax.stageTeachingProgressByArea()
        .then(({httpCode, result}) => {
          this.$store.state.loading = false;
          if (httpCode == 200) {
            this.tableData = [result || []];
          } else {
            console.log('请求失败');
          }
        })
    },
    methods: {},
    components: {}
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  .rp-div {
    justify-content: center;
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
      /*background:red;*/
    }
    .right {
      @extend .left;
      /*background:green;*/
      margin-left: 5%;
    }
  }

</style>
<style lang="scss">
  .rp-div {
    @import "../../../../static/css/selfTab.scss";
  }

  @import "../../../../static/css/commonVariable.scss";
  .sdDSFD {
    @import "../../../../static/css/modificationTable";
  }
</style>
