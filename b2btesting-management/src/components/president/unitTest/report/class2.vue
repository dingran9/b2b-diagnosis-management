<template>
  <div class="rp-div" style="overflow: auto">
    <p class="titlePc">各知识点错误率</p>
    <section class="table_section" v-if="isEmptyObject(result)!=true&&result!=null">
      <table class="table_body" cellpadding="1" cellspacing="1">
        <tr v-for="(item, index) in result">
          <td>
            <span>{{item[0]}}</span>
          </td>
          <td
            v-for="(td,index) in item"
            v-if="index>0"
          >
            {{td}}
          </td>
        </tr>
      </table>
    </section>
    <section v-else class="nodata">暂无数据</section>
  </div>
</template>

<script>
  //  import config from '../../config/config'
  export default {
    data() {
      return {
        result: [],
      }
    },
    mounted: function () {
      this.getSourceDate()
    },
    methods: {
      getSourceDate: function () {

        let url = this.getrequestInterface("teacherReport/getClassWrongKnowledgeGroupByClass")

        this.$http.get(url)
          .then(res => {

            if (res.body.message == "Success") {

              if(this.isEmptyObject(res.body.result)){
                return;
              }
              this.result=res.body.result

            }

          }, res => {

            console.log(res)

          });

      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  .rp-div {
    /*margin-top: 0.4rem;*/
    background: #fff;
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
    }
  }

  /*  .rp-div {
      margin-top: 0.4rem;
      padding: 0 0.5rem;
      padding-top: 0.5rem;
      background: #fff;
    }*/
  .table_body {
    /*background:#fff;*/
    padding-bottom: .4rem;
  }

  .table_body td {
    padding: .2rem;
    text-align: center;
    color: #A59797;
    min-width: 4rem;
    font-size: .6rem;
  }

  .table_body td span {
    /*color:#A59797;*/
  }

  .table_body td:first-child {
    width: 40%;
  }

  .table_body tr:nth-of-type(1) td {
    /*background:#ffe7e7;*/
    line-height: 1.6rem;
  }

  .table_body tr:nth-of-type(1) td:nth-of-type(1) {
    /*background:#ffe7e7;*/
    border-top-left-radius: .2rem;
  }

  .table_body tr:nth-of-type(1) td:last-child {
    /*background:#ffe7e7;*/
    border-top-right-radius: .2rem;
  }

  .table_section {
    font-size: .6rem;
    text-align: center;
    table {
      margin: 30px auto;
      tr:nth-child(odd) td {
        background: #eff4f6;
        height: 30px;
        min-width: 220px;
        color: #828282;
        font-size: 16px;
      }
      tr:nth-child(even) td {
        background: #e1edf1;
        height: 30px;
        min-width: 220px;
        color: #828282;
        font-size: 16px;
      }
      tr:nth-of-type(1) {
        td {
          background: #8bb6c4;
          color: white;
        }
      }
    }
  }

  .table_section_title span {
    color: #ec8080;
    width: 3rem;
    text-align: center;
    display: inline-block;
  }

  .table_section_title {
    background: #ffe7e7;
    line-height: 1.6rem;

  }

  .table_section_body {
    padding-left: .4rem;
    line-height: 1.6rem;
    color: #A59797;
  }

  .table_section_body span {
    border-top: 1px solid #e1e1e1;
    border-bottom: 2px solid #fff;
    width: 2.9rem;
    text-align: center;
    display: inline-block;
  }

  .table_section_body .know:nth-of-type(1) {
    /*  border:1px solid #e1e1e1;
      display:block;
      width:100%;
      text-align: left;
      padding:0 .6rem;*/
    display: none;
  }

  .table_section_body:nth-of-type(odd) {
    background: #eef2f6;
  }

  .table_section_body:nth-of-type(even) {
    background: #f5f5f5;
  }
</style>
