<template>
  <div class="login-wrap">
    <div class="login-bg">
      <div class="ms-login">
        <ul>
          <!--<li><router-link :to="{path:'/Login',query:{role:'学生'}}"><img src="../../../static/img/l_1.png" /><p>学生登录</p></router-link></li>-->
          <li><router-link :to="{path:'/Login',query:{role:'系统管理员'}}"><img src="../../../static/img/l_2.png" /><p>系统管理员</p></router-link></li>
          <li><router-link :to="{path:'/Login',query:{role:'校长'}}"><img src="../../../static/img/l_3.png" /><p>校长登录</p></router-link></li>
          <li><router-link :to="{path:'/Login',query:{role:'管理员'}}"><img src="../../../static/img/l_4.png" /><p>学校管理员登录</p></router-link></li>
        </ul>
      </div>
    </div>

  </div>
</template>

<script>
  import md5 from 'MD5'
  import {setStore} from '../../config/utils.js'
  export default {
    data: function(){
      return {
        role:'角色',//登录角色

      }
    },
    methods: {
      submitForm(formName) {

      },
    }
  }
</script>

<style scoped>
  .login-wrap{
    position: relative;
    width:100%;
    height:100%;
    background:url(../../../static/img/before_bg.png) bottom no-repeat #f9fdfe;
  }
  .login-bg{
    width:1422px;
    height:773px;
    position: absolute;
    left:50%;
    top:50%;
    transform: translate(-50%,-50%);
  }
  .ms-login ul{
    width: 960px;
    margin: 0 auto;
  }
  .ms-login ul li{
    list-style:none;
    float:left;
    box-shadow: 1px 1px 10px #e6ecef;
    width:280px;
    height:335px;
    background:#fff;
    margin-left:40px;text-align: center;
  }
  .ms-login ul li img{
      margin-top:60px;
  }
  .ms-login ul li p{
    line-height:60px;
    color:#7fbed0;
  }
</style>
