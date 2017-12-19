<template>
  <div
    @click="$router.go(-1)"
    class="ge-pull-right"
    style="font-size: 16px;cursor: pointer" >
    <img src="../../../static/img/back_icon.png"  style="vertical-align: middle;"/>
    返回上一级
  </div>
</template>
<script>
export default {
  components:{

  },
  data:()=>{
      return {
          result:{}
      }
  },
  mounted(){
      this.user = this.$user().get();
  },
  methods:{

  },
  props:{

  },
  computed:{

  },
  watch:{

  },
  filters:{

  }
}
</script>
<style scoped lang="scss">
  @import "~@/../static/css/gemixin.scss";
</style>
