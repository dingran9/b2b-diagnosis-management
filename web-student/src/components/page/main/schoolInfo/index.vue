<template>
  <div>
    <div class="content-right-title-wrap">
      <h2 class="title">个人中心>个人设置</h2>
    </div>
    <div class="content-right-body-wrap clear-fix">
      <div class="set">
        <div class="title">
          学校信息
        </div>
        <div class="body">
          <div class="item">
            <div class="caption">
              <img src="../../../../../static/img/icon/icon_school.png" height="22" width="24"/>
              我的学校
            </div>
            <label class="input-wrap">
              {{user.schoolName}}
            </label>
          </div>
          <div class="item">
            <div class="caption">
              <img src="../../../../../static/img/icon/icon_people.png" height="22" width="24"/>
              我的班级
            </div>
            <label class="input-wrap">
              {{user.gradeName + ' ' + user.className}}
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
  import md5 from 'md5';
  export default {
    components: {},
    data(){
      return {
        user :this.$user().get(),
        data: {
          reportList: [],
          groundList: []
        },
      }
    },
    mounted(){
        console.log(this.user)
    },
    methods: {

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
