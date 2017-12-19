<template>
  <div >
    <h3>文件列表：</h3>
    <div :id="filelist">Your browser doesn't have Flash, Silverlight or HTML5 support.</div>
    <br />
    <div :id="container">
      <el-button :id="pickfiles" slot="trigger" size="small" type="primary">选取文件</el-button>
      <el-button :id="uploadfiles" style="margin-left: 10px;" size="small" type="success">上传到服务器</el-button>
    </div>
    <pre :id="console"></pre>
  </div>
</template>

<script>
  import md5 from 'MD5'
  export default {
    props: ['name','id'],
    data() {
      return {
        filelist:'filelist',
        container:'container',
        pickfiles:'pickfiles',
        uploadfiles:'uploadfiles',
        console:'console',
      }
    },
    mounted: function () {
      this.filelist = this.filelist + this.id
      this.container = this.container + this.id
      this.pickfiles = this.id + this.pickfiles
      this.uploadfiles = this.uploadfiles + this.id
      this.console = this.console + this.id
      this.upyunInit()
    },
    methods: {
      // init
      upyunInit(){
          var that = this;
          let aaa = 'pickfiles'
        console.log(that.pickfiles);
        var options = {
          'bucket': 'keepmark',
          'save-key': '/{year}/{mon}/{day}/{filemd5}{.suffix}',
          'expiration': Math.floor(new Date().getTime() / 1000) + 86400
        };
// 查看更多参数：http://docs.upyun.com/api/form_api/#表单API接口简介
        var policy = window.btoa(JSON.stringify(options));
// 从 UPYUN 用户管理后台获取表单 API
        var form_api_secret = 'WwbrepSiLMoTpx/+D2c+3klosIA=';
// 计算签名
        var signature = md5(policy + '&' + form_api_secret);

        var uploader = new plupload.Uploader({
          runtimes : 'html5,flash,silverlight,html4',
          browse_button : 'pickfiles',   // you can pass in id... that.pickfiles
          container: document.getElementById('container'), // ... or DOM Element itself that.container
          flash_swf_url : 'lib/plupload-2.1.2/js/Moxie.swf',
          silverlight_xap_url : 'lib/plupload-2.1.2/js/Moxie.xap',

          url : 'http://v0.api.upyun.com/' + options.bucket,

          multipart_params: {
            'Filename': '${filename}', // adding this to keep consistency across the runtimes
            'Content-Type': '',
            'policy': policy,
            'signature': signature,
          },

          init: {
            PostInit: function() {
              document.getElementById(that.filelist).innerHTML = '';
              console.log('PostInit');
              document.getElementById(that.uploadfiles).onclick = function() {
                uploader.start();
                return false;
              };
            },

            FilesAdded: function(up, files) {
              plupload.each(files, function(file) {
                document.getElementById(that.filelist).innerHTML += '<div id="' + file.id + '">' + file.name + ' (' + plupload.formatSize(file.size) + ') <b></b></div>';
              });
            },

            UploadProgress: function(up, file) {
              document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = '<span>' + file.percent + "%</span>";
            },

            FileUploaded: function(up, file, info) {
              var response = JSON.parse(info.response);
              document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML += ' [Url]: http://keepmark.b0.upaiyun.com' + response.url;
            },
            Error: function(up, err) {
              document.getElementById(that.console).appendChild(document.createTextNode("\nError #" + err.code + ": " + err.message));
            }
          }
        });
        uploader.init();
      }
    },
  }
</script>
<style>
  .addU-i{
    width: 300px;
  }
</style>
