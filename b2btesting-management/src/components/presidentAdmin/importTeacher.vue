<template>


  <div>
    <!--<el-upload-->
      <!--class="upload-demo"-->
      <!--ref="upload"-->
      <!--action="http://211.157.179.213:8866/userManager/readExcel/45"-->
      <!--name="excelfile"-->
      <!--:on-preview="handlePreview"-->
      <!--:on-remove="handleRemove"-->
      <!--:file-list="fileList"-->
      <!--:auto-upload="false">-->
      <!--<el-button slot="trigger" size="small" type="primary">选取文件</el-button>-->
      <!--<el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>-->
      <!--<div slot="tip" class="el-upload__tip">只能上传xlsx文件，且不超过***kb</div>-->
    <!--</el-upload>-->
    <div>
      <span>载入文件:</span>
      <form style="display: inline-block" id="form1"  action="http://211.157.179.220:8866/userManager/readExcel/45" method="post" enctype="multipart/form-data">
        <input type="file" id="file" name="excelfile" accept="application/vnd.sealed-xls" >
      </form>
      <el-button style="margin-left: 10px;" size="small" type="success" @click="upLoadFile">上传到服务器</el-button>
    </div>
    <p class="upLoadexplain">
      说明：请严格按照模板中的格式填写，填写完成载入文件后，点击确认按钮即可，批量导入的默认密码为教师工号。<a v-bind:href = getexlsx>下载模板</a>
    </p>




  </div>
</template>

<script>
  export default {
    data() {
      return {
        fileList: [],
        userSchoolId: JSON.parse(window.localStorage.getItem("Userinfo")).userSchoolId,
        url: this.rootUrl+"userManager/readExcel/45",
        getexlsx:this.rootUrl+"excelTemp/teacher_info.xlsx",
        fileType: null
      };
    },
    mounted(){
      this.fileChange()
    },
    methods: {
        fileChange(){
          let rootThis = this
          document.addEventListener('change', function (e) {
            rootThis.fileType = document.getElementById('file').files[0].name.split('.').pop().toString()
          });
        },
      submitUpload() {
        this.$refs.upload.submit();
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
        console.log(file.response);
      },
      upLoadFile(){
        if (this.fileType != "xlsx") {
          this.$message('请检查文件类型');
          return
        }
        var form = new FormData(document.getElementById('form1'));
        this.$http.post(this.rootUrl + 'userManager/readExcel/' + this.userSchoolId + '', /*获取老师code*/
          form).then((res) => {
          if (res.body.code == 'Success' && res.body.httpCode == '200') {
            this.$message('上传成功');
            this.$router.push('/teacherList')
          }
        }, (res) => {
          console.log(res);
        });
      },
    }
  }
</script>
<style>
  .upLoadexplain{
    margin-top: 50px;
    font-size: 15px;
    color: grey;
    padding-left: 100px;
  }
</style>

