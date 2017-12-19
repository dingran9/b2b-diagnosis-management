<template>
  <div >
    <el-button slot="trigger" size="small" type="primary" @click="clickInput">选取文件</el-button>
    <input type="file" ref="file_upload" :id="file_upload" style="display: none">
    <el-button style="margin-left: 10px;" size="small" type="success" @click="uploadByForm">上传到服务器</el-button>
  </div>
</template>

<script>
  import md5 from 'MD5'
  export default {
    props: ['name','id'],
    data() {
      return {
        myForm:'myForm',
        file_upload:'file_upload',
        url: null
      }
    },
    mounted: function () {
      this.myForm = this.myForm + this.id
      this.file_upload = this.file_upload + this.id
    },
    watch:{
      url:'giveBabaUrl'
    },
    methods: {
      clickInput(){
        this.$refs.file_upload.click()
      },
      giveBabaUrl(){
        this.$emit('giveBabaUrl',this.url);
      },
      // init
      uploadByForm() {
        let that = this
        // 定义文件类型
        let options = {
          'bucket': 'keepmark',
          'save-key': '/{year}/{mon}/{day}/{filemd5}{.suffix}',
          'expiration': Math.floor(new Date().getTime() / 1000) + 86400
        };
        let policy = window.btoa(JSON.stringify(options));
        // form 表单秘钥
        let form_api_secret = 'WwbrepSiLMoTpx/+D2c+3klosIA=';
        // 生成签名
        let signature = md5(policy + '&' + form_api_secret);
        let formData = new FormData();//构造空对象，下面用append 方法赋值。
        formData.append("policy", policy);
        formData.append("signature", signature);
        formData.append("file",  $("#"+ that.file_upload)[0].files[0]);
        // ajax请求
        let XHR = new XMLHttpRequest();
        XHR.open("POST", "http://v0.api.upyun.com/keepmark");
        XHR.onreadystatechange = function () {
          if (XHR.readyState == 4 && XHR.status == 200) {
            that.url = JSON.parse(XHR.responseText).url
            XHR = null;
          }
        };
        XHR.send(formData);
      }
    },
  }
</script>
<style>
  .addU-i{
    width: 300px;
  }
</style>
