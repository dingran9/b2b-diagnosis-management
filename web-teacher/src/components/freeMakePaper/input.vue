<template>
    <input type="text" class="number-input" :value="value" @input="valueChange" :disabled="disable">
</template>
<script>
  export default {
    components: {},
    props: {
      value: {},
      max:{default:9999},
      min:{default:0},
      disable:{default:false}
    },
    beforeCreate() {
    },
    created() {
    },
    mounted() {

    },
    data() {
      return {}
    },
    methods: {
      valueChange(event) {
       let {max,min} = this;
        let inputEl = event.target.value.replace(/[^\d]/g, '')*1;
        if(inputEl>max){
          inputEl=max;
        }else if(inputEl<min){
          inputEl='';//这里不能等于min否则删除的时候必须选中才能删除
        }
        event.target.value=inputEl;
        this.$emit("input", inputEl);
      },
    },
    computed: {},
    filters: {},

  }
</script>
<style scoped lang="scss" scoped>
  input{
    line-height: 35px;
    border: 1px solid #bfcbd9;
    border-radius: 3px;
    padding: 0 10px;
    display: inline-block;
    width:231px;
    height:50px;
    color:#1f2d3d;
    box-sizing: border-box;
    font-size:14px;
    vertical-align: top;
    &::-webkit-input-placeholder{
      color:#97a8be;opacity:1;
    }
    &::-moz-placeholder { /* Mozilla Firefox 4 to 18 */
      color: #97a8be; opacity:1;
    }
    &::-moz-placeholder { /* Mozilla Firefox 19+ */
      color: #97a8be;opacity:1;
    }
  }

</style>
<style>

</style>
