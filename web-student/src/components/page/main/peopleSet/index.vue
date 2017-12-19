<template>
  <div>
    <div class="content-right-title-wrap">
      <h2 class="title">个人中心>个人设置</h2>
    </div>
    <div class="content-right-body-wrap clear-fix">
      <div class="set">
        <div class="title">
          个人设置
        </div>
        <div class="body">
          <div class="item">
            <div class="caption">
              <img src="../../../../../static/img/icon/icon_souji.png" height="27" width="18"/>
              手机号
            </div>
            <label class="input-wrap">
              {{user.userPhone | photoHide }}
              <router-link to="/main/changePhone" class="ge-pull-right btn">
                修改手机号
              </router-link>
            </label>
          </div>
          <div class="item">
            <div class="caption">
              <img src="../../../../../static/img/icon/icon_pwd.png" height="24" width="21"/>
              修改密码
            </div>
            <label class="input-wrap">
              <router-link to="/main/changePwd" class="ge-pull-right btn">
                修改密码
              </router-link>
            </label>
          </div>

        </div>
        <div class="foot">

        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    components: {},
    data() {
      return {
        user: this.$user().get()
      }
    },
    mounted() {
      console.log(this.user)
    },
    computed: {}
    ,
    filters: {
      photoHide(val) {
        try {
          val = val.split('');
          val.splice(3, 5, '*****')
          return val.join('')
        } catch (e) {
          return '';
        }

      }
    }
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
          .btn {
            @include ge-btn(160px, 40px);
          }
        }
      }

    }
    .foot {
      padding: 100px 0 30px 0;
    }
  }

</style>
