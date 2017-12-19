<template>
  <div>
    <hr>
    <p class="a-p-f-d-p"><span>学科:{{group|gradeCodeFilter}}{{subjectId|subjectFilter}}</span>&nbsp;&nbsp;&nbsp;    <span>教材版本:</span>
      <el-select v-model="bookVersionRadio" placeholder="请选择教材版本" @change="getbookTypeVersionAndUnit()">
        <el-option
          v-for="item in bookVersionlist"
          :key="item.ctb_code"
          :label="item.book_type"
          :value="item.ctb_code">
        </el-option>
      </el-select>
      <span>上下册:</span>
      <el-select v-model="bookTopBotRadio" placeholder="请选择上下册" @change="getbookTypeVersionUnit()">
        <el-option
          v-for="item in bookTopBotlist"
          :key="item.code"
          :label="item.name"
          :value="item.code">
        </el-option>
      </el-select>
    </p>
    <p class="a-p-f-d-p">
      <span>所属单元:</span>
      <el-select v-model="UnitRadio" placeholder="请选择单元" @change="getPaperByUnit()">
        <el-option
          v-for="item in unitlist"
          :key="item.code"
          :label="item.name"
          :value="item.code">
        </el-option>
      </el-select>
    </p>
    <hr>
    <el-table :data="paperListData" highlight-current-row v-on:row-click="getrowclick" style="margin-top: 15px">
      <el-table-column property="diagnosisPaperName" label="试卷名称" min-width='600'></el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    props: ['subjectId','group','toArtsType','tocode'],
    data() {
      return {
        bookVersionlist:[],
        bookVersionRadio: '',
        bookTopBotlist:[],
        bookTopBotRadio:'',
        unitlist:[],
        UnitRadio:'',
        dialogSubject: '',
        paperListData:[],
      };
    },
    beforeUpdate: function () {
//      this.getBookTypeVersion()
    },
    mounted: function () {
      this.getBookBuyFirst()
    },
    watch: {
      subjectId:'getBookBuyFirst'
    },
    methods: {
      getBookBuyFirst:function() {
        this.paperListData = []
        this.bookTopBotRadio = ''
        this.UnitRadio = ''
        this.getBookTypeVersion()
      },
      //根据学科获取教材版本
      getBookTypeVersion: function () {
        this.$http.post(this.rootUrl + 'teacher/rescours/getBookTypeVersion?requestId=123',
          {
            "gradeCode":this.group,
            "subjectCode":this.subjectId,
          }).then((res) => {
          this.bookVersionlist=res.body.result;
          this.bookVersionRadio= '';
          this.bookTopBotlist = [];
          this.unitlist = [];
          this.UnitRadio = '';
        }, (res) => {
          console.log(res);
        });
      },
      //根据教材版本获取上下册
      getbookTypeVersionAndUnit: function () {
          if(this.bookVersionRadio.length > 5){
            this.$http.post(this.rootUrl + 'teacher/rescours/getbookTypeVersionAndUnit?requestId=123',
              {
                "gradeCode":this.group,
                "subjectCode":this.subjectId,
                "booktypeCode":this.bookVersionRadio,
                "productsIds":"581c1b44f70541fc88f8658041477c6c",
                "code":"0"
              }).then((res) => {
              this.bookTopBotlist=res.body.result;
              this.bookTopBotRadio= '';
              this.unitlist = [];
            }, (res) => {
              console.log(res);
            });
          }
      },
      //根据上下册获取单元
      getbookTypeVersionUnit: function () {
          if(this.bookTopBotRadio.length > 5){
            this.$http.post(this.rootUrl + 'teacher/rescours/getbookTypeVersionAndUnit?requestId=123',
              {
                "gradeCode":this.group,
                "subjectCode":this.subjectId,
                "booktypeCode":this.bookVersionRadio,
                "productsIds":"581c1b44f70541fc88f8658041477c6c",
                "code":this.bookTopBotRadio
              }).then((res) => {
              this.unitlist=res.body.result;
              this.UnitRadio= '';
            }, (res) => {
              console.log(res);
            });
          }
      },
      //根据单元获取试卷
      getPaperByUnit: function () {
          if(this.UnitRadio.length>5){
            let parms = {
              "pageNum": 1,
              "pageSize": 10,
              "unitCode":this.UnitRadio
            }
            this.postSearch(parms);
          }
      },
      postSearch: function (parm) {
        this.$http.post(this.rootUrl + 'manager/teacher/getDiagnosisPaperByPaper?requestId=123',parm
        ).then((res) => {
          this.paperListData=res.body.result.list;
        }, (res) => {
          console.log(res);
        });
      },

      getrowclick:function (row, event, column) {
        let someDate = {
          data:{
            diagnosisPaperName: row.diagnosisPaperName,
            code: row.code,
            totalScore: row.totalScore,
            subjectCode: this.subjectId,
            artsType: this.toArtsType,
            id:this.tocode
          },
          dialogFormVisible: false
        }
        this.$emit('getrowclick',someDate)
      },
    }
  };
</script>
<style>
  .a-p-f-d-p{
    margin: 15px 0;
  }
</style>
