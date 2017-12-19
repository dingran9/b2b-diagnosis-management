<template>
  <div>
    <div class="content-right-title-wrap">
      <h2 class="title">个人中心>个人设置 <goback></goback></h2>
    </div>
    <div class="content-right-body-wrap clear-fix">
      <div class="set">
        <div class="title">
          修改密码
        </div>
        <div class="body">
          <div class="item">
            <div class="caption">
              <img src="../../../../../static/img/icon/icon_suo.png" height="24" width="21"/>
              原密码
            </div>
            <label class="input-wrap">
              <input type="password" v-model="passwords.oldPsd" placeholder="请输入原密码">
            </label>
          </div>
          <div class="item">
            <div class="caption">
              <img src="../../../../../static/img/icon/icon_suo.png" height="24" width="21"/>
              新密码
            </div>
            <label class="input-wrap">
              <input type="password" placeholder="请输入新密码"  v-model="passwords.newPsd">
            </label>
          </div>
          <div class="item">
            <div class="caption">
              <img src="../../../../../static/img/icon/icon_suo.png" height="24" width="21"/>
              确认新密码
            </div>
            <label class="input-wrap">
              <input type="password" placeholder="请再次输入新密码" v-model="passwords.twoPsd">
            </label>
          </div>

        </div>
        <div class="foot">
          <div class="submit-btn" @click="changePsd">
            完成
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import goback from '../../../common/goback.vue';
  import md5 from 'md5';
  export default {
    components: {goback},
    data(){
      return {
        data: {
          reportList: [],
          groundList: []
        },
        passwords: {
          oldPsd: '',
          newPsd: '',
          twoPsd: ''
        },
        flag: {
          subjectSelect: 0
        }
      }
    },
    mounted(){
      this.user = this.$user().get();
      let user = this.user;


    },
    methods: {
      changePsd(){
        let {oldPsd, newPsd, twoPsd} = this.passwords;
        if (!oldPsd) {
          this.$message('请输入原密码');
        } else if (oldPsd.length < 5 || oldPsd.length > 16) {
          this.$message('原密码必须是6-16位!!' );
        } else if (!newPsd) {
          this.$message('请输入新密码');
        } else if (newPsd.length < 5 || newPsd.length > 16) {
          this.$message('新密码必须是6-16位!');
        } else if (newPsd != twoPsd) {
          this.$message('两次密码输入不一致');
        } else if (oldPsd == newPsd) {
          this.$message('新密码不能和原密码相同!');
        } else {
          this.$ajax.checkOldPwd({"password": md5(oldPsd), "userCode": this.user.userId})
            .then(({httpCode}) => {
              if(httpCode ==200){
                return this.$ajax.changePwd({
                  "password": md5(newPsd),
                  "userCode": this.user.userId,
                  "token": this.user.token
                })
              }else{
                return new Promise(function(r,s){s('1');})
              }
            })
            .then(({httpCode}) => {
              if(httpCode == 200){
                this.$message('修改密码成功!');
              }else{
                this.$message('原密码错误!');
              }
            })
            .catch(()=>{
              this.$message('原密码错误!');
            })
        }
      }
    }
    ,
    computed: {}
    ,
    filters: {}

  }
</script>
<style lang="scss" scoped>
  @import '../../../../../static/css/contentRight.scss', "../../../../../static/css/gemixin.scss";

  .set {
    max-width: 1000px;
    min-width: 700px;
    background: #fff;
    margin: 100px auto;
    min-height: 200px;
    .title {
      $h: 60px;
      height: $h;
      line-height: $h;
      color: #4c6175;
      font-size: 20px;
      font-weight: 600;
      border-bottom: 1px solid #e1e5ec;
    }
    .body {
      padding: 45px;
      text-align: left;
      font-size: 18px;
      .item {
        $h: 40px;
        height: $h;
        line-height: $h;
        clear: both;
        &:after {
          content: '';
          display: table;
          clear: both;
        }
        margin-bottom: 20px;
        .caption {
          width: 23%;
          display: inline-block;
          float: left;
          color: #4c6175;
          img {
            margin-right: 20px;
          }
        }
        .input-wrap {
          width: 77%;
          display: inline-block;
          float: left;
          background: #f0f4fb;
          input {
            background-color: transparent;
            display: inline-block;
            padding-left: 20px;
            font-size: 18px;
          }
        }
      }

    }
    .foot {
      padding: 100px 0 30px 0;
      .submit-btn {
        @include ge-btn(400px, 50px);
      }
    }
  }

</style>
