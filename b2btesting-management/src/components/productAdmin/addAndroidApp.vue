<template>
  <div v-loading="loading"
       element-loading-text="正在上传中">
    <div class="crumbs" style="position: relative">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-menu"></i>APP版本管理</el-breadcrumb-item>
        <el-breadcrumb-item>更新app</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <hr>
    <el-form :model="form" label-width="100px" style="margin-top: 15px;width: 600px">
      <el-form-item label="类型:" >
        <el-radio-group v-model="form.type">
          <el-radio  v-for="(item,index) in radioList" :key = 'item.code' class="radio"  v-bind:label=item.code  >{{item.name}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否强制:" >
        <el-radio class="radio" v-model="form.necessary" label="1">强制更新</el-radio>
        <el-radio class="radio" v-model="form.necessary" label="0">不强制更新</el-radio>
      </el-form-item>
      <el-form-item label="app名字:" >
        <el-input v-model="form.appName" auto-complete="off" class="addU-i"></el-input>
      </el-form-item>
      <el-form-item label="版本:" >
        <el-input type="number" v-model="form.appVersion" auto-complete="off" class="addU-i"></el-input>
      </el-form-item>
      <el-form-item label="描述:" >
        <el-input v-model="form.appDescribe" auto-complete="off" class="addU-i"></el-input>
      </el-form-item>
      <el-form-item label="下载地址:" >
        <el-input :disabled="true" v-model="form.downUrl" auto-complete="off" class="addU-i"></el-input> <el-button type="primary" @click="clickInputfile">选择安装包<i class="el-icon-upload el-icon--right" ></i></el-button>
        <input style="display: none" ref='inputFile' type="file" id="file" class="header-load" @change="uploadAvatar" accept="accept='.apk'">
      </el-form-item>
      <el-form-item>
        <!--<upupyun :name="toChildName" id='1' v-on:giveBabaUrl="listenToChildUpyun"></upupyun>-->
        <!--<upupyun :name="toChildName" id='2' v-on:giveBaBaUrl="listenToChildUpyun"></upupyun>-->
        <el-button :disabled="((!form.type) || (!form.necessary) || (!form.appName) || (!form.appVersion)|| (!form.appDescribe)|| (!form.downUrl))" type="primary" @click="onSubmitEdit" style="float: right">立即提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import upYun from '../common/upyun.vue'
  import upupyun from '../common/upupyun.vue'
  export default {
    data() {
      return {
        loading: false,
        radioList:[
          {code:1,name:'学生'},
          {code:2,name:'教师'},
          {code:3,name:'校长'}
        ],
        getAuthRoles:[],
        form: {
          appVersion: '',
          appName: '',
          appDescribe: '',
          necessary: '',
          type: '',
          downUrl: '',
        },
        toChildLoading:'正在上传中',
        toChildName:'选择安装包'
      }
    },
    components:{
      upYun,upupyun
    },
    mounted: function () {
      let that = this
      document.addEventListener('uploaded', function (e) {
        console.log(e);
        let imgPathNew = 'http://keepmark.b0.upaiyun.com' + e.detail.path;
        that.form.downUrl = imgPathNew
        that.loading = false
      });
    },
    methods: {
      clickInputfile(){
        this.$refs.inputFile.click();
      },
      //上传图片
      uploadAvatar() {
          try {
            let ext = document.getElementById('file').files[0].name;
            if(ext.split('.').pop() !== 'apk'){
              this.$message('请选择正确的安装包');
              return
            }
            this.loading = true
            let date = parseInt((new Date().getTime() + 3600000) / 1000);
            let config = {
              "bucket": 'keepmark', //空间名称
              "expiration": date, //上传请求过期时间
              "save-key": "/img.jpg",
              form_api_secret: 'WwbrepSiLMoTpx/+D2c+3klosIA='
            };
            let instance = new Sand(config);
            let options = {
              'notify_url': 'http://upyun.com'
            };
            instance.setOptions(options);
            instance.upload('/upload/'+ parseInt((new Date().getTime() + 3600000) / 1000) + ext, "file");
          } catch (e){
              console.log(e)
          }

      },
      // 立即添加
      onSubmitEdit(){
        this.$http.post(this.rootUrl + 'diagnosis/app/addApkUrl?requestId=123', {
          "appDescribe": this.form.appDescribe,
          "appName": this.form.appName,
          "appVersion": this.form.appVersion,
          "downUrl": this.form.downUrl,
          "necessary": this.form.necessary,
          "type": this.form.type
        }).then((res) => {
          if (res.body.code == 'Success' && res.body.httpCode == '200') {
            this.$message('新增成功');
            this.$router.push('appAndroidMange')
          }
        }, (res) => {
          console.log(res);
        });
      },
      // 监听子组件的方法
      listenToChildUpyun(url){
        // http://keepmark.b0.upaiyun.com' 公共的
        console.log(url)
      }
    },
  }
</script>
<style>
  .addU-i{
    width: 300px;
  }
</style>
