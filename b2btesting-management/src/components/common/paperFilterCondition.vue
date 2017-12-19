<template>
  <div>
    <hr>
    <div class="comflter">
      <p class="comflter-p">
        <span class="comflter-p-span">年级:</span>
        <el-radio-group v-model="grondRadio" @change="getSubject()">
          <el-radio  v-for="(item,index) in groundCode" :key = 'item.code' class="radio"  v-bind:label=item.code  >{{item.name}}</el-radio>
        </el-radio-group>
      </p>
      <p class="comflter-p">
        <span class="comflter-p-span">学科:</span>
        <el-radio-group v-model="subjectRadio" @change="getBookTypeVersion()">
          <el-radio v-for="(item,index) in subjectlist" :key = 'item.subject_code' class="radio"  v-bind:label=item.subject_code>{{item.subject_name}}</el-radio>
        </el-radio-group>
      </p>
      <p class="comflter-p">
        <span class="comflter-p-span">教材:</span>
        <el-radio-group v-model="bookVersionRadio" @change="getbookTypeVersionAndUnit()">
          <el-radio v-for="(item,index) in bookVersionlist" :key = 'item.ctb_code' class="radio"  v-bind:label=item.ctb_code>{{item.book_type}}</el-radio>
        </el-radio-group>
      </p>
      <p class="comflter-p">
        <span class="comflter-p-span">上下册:</span>
        <el-radio-group v-model="bookTopBotRadio" @change="getbookTypeVersionUnit()">
          <el-radio v-for="(item,index) in bookTopBotlist" :key = 'item.code' class="radio"  v-bind:label=item.code>{{item.name}}</el-radio>
        </el-radio-group>
      </p>
      <p class="comflter-p">
        <span class="comflter-p-span">单元:</span>
        <el-radio-group v-model="UnitRadio" @change="getPaperByUnit()">
          <el-radio v-for="(item,index) in unitlist" :key = 'item.code' class="radio"  v-bind:label=item.code>{{item.name}}</el-radio>
        </el-radio-group>
      </p>
    </div>
    <hr>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        groundCode: [
          {code:11,name:'一年级'},
          {code:12,name:'二年级'},
          {code:13,name:'三年级'},
          {code:14,name:'四年级'},
          {code:15,name:'五年级'},
          {code:16,name:'六年级'},
          {code:21,name:'七年级'},
          {code:22,name:'八年级'},
          {code:23,name:'九年级'},
          {code:31,name:'高一'},
          {code:32,name:'高二'},
          {code:33,name:'高三'},
        ],
        grondRadio: 11,
        subjectlist:[],
        subjectRadio: ' ',
        bookVersionlist:[],
        bookVersionRadio: ' ',
        bookTopBotlist:[],
        bookTopBotRadio:' ',
        unitlist:[],
        UnitRadio:' ',
      }
    },
    mounted: function () {
      this.getSubject()
    },
    methods: {
      //根据学年获取学科
      getSubject: function () {


        var xhr = new XMLHttpRequest();
        xhr.open("POST", this.rootUrl + 'teacher/rescours/getSubjectByGradeCode?requestId=123', true);
        xhr.setRequestHeader("Content-type","application/json;charset=UTF-8");
        xhr.setRequestHeader("Accept","application/json, text/plain, */*");
        xhr.onreadystatechange = function(){
          var XMLHttpReq = xhr;
          if (XMLHttpReq.readyState == 4) {
            if (XMLHttpReq.status == 200) {
              var text = XMLHttpReq.responseText;
              console.log(text);
            }
          }
        };
        xhr.send(JSON.stringify({"gradeCode":this.grondRadio}));


//        this.$http.post(this.rootUrl + 'teacher/rescours/getSubjectByGradeCode?requestId=123',{"gradeCode":this.grondRadio}).then((res) => {
//          this.subjectlist=res.body.result
//        }, (res) => {
//          console.log(res);
//        });
      },
      //根据学科获取教材版本
      getBookTypeVersion: function () {
        this.$http.post(this.rootUrl + 'teacher/rescours/getBookTypeVersion?requestId=123',
          {
            "gradeCode":this.grondRadio,
            "subjectCode":this.subjectRadio
          }).then((res) => {
          this.bookVersionlist=res.body.result
        }, (res) => {
          console.log(res);
        });
      },
      //根据教材版本获取上下册
      getbookTypeVersionAndUnit: function () {
        this.$http.post(this.rootUrl + 'teacher/rescours/getbookTypeVersionAndUnit?requestId=123',
          {
            "gradeCode":this.grondRadio,
            "subjectCode":this.subjectRadio,
            "booktypeCode":this.bookVersionRadio,
            "productsIds":"581c1b44f70541fc88f8658041477c6c",
            "code":"0"
          }).then((res) => {
          this.bookTopBotlist=res.body.result
        }, (res) => {
          console.log(res);
        });
      },
      //根据上下册获取单元
      getbookTypeVersionUnit: function () {
        this.$http.post(this.rootUrl + 'teacher/rescours/getbookTypeVersionAndUnit?requestId=123',
          {
            "gradeCode":this.grondRadio,
            "subjectCode":this.subjectRadio,
            "booktypeCode":this.bookVersionRadio,
            "productsIds":"581c1b44f70541fc88f8658041477c6c",
            "code":this.bookTopBotRadio
          }).then((res) => {
          this.unitlist=res.body.result
        }, (res) => {
          console.log(res);
        });
      },
      //根据单元获取试卷
      getPaperByUnit: function () {
        this.$http.post(this.rootUrl + 'manager/teacher/getDiagnosisPaperByPaper?requestId=123',
          {
            "pageNum": 1,
            "pageSize": 10,
            "unitCode":this.UnitRadio
          }).then((res) => {
          this.tableData=res.body.result.list
        }, (res) => {
          console.log(res);
        });
      },
    }
  }
</script>
<style>
  .comflter {
    margin: 15px 0;
  }
  .comflter-p {
    margin: 15px 0;
    padding-left: 70px;
    position: relative;
  }
  .comflter-p-span{
    position: absolute;
    top: 0;
    left: 0;
  }
</style>
