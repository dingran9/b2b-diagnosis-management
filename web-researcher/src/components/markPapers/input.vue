<template>
    <input type="text" class="number-input" :value="value" @input="valueChange" :disabled="disable">
</template>
<script>
  export default {
    components: {},
    props: {
      value: {},
      max:{default:100},
      min:{default:0},
      pointNum:{default:2},
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
       let {max,min, pointNum} = this;
        pointNum = +pointNum;
        let inputEl = event.target,
          inputValue = inputEl.value,
          val = +inputEl.value,
          temp = inputValue.trim();
        if (isNaN(val)) {
          temp = inputValue.slice(0, -1);
        }
        if(temp < min )temp = min;
        if(temp > max )temp = max;
        let rep = new RegExp('.\\d{'+ (pointNum + 1)+'}');
        if(rep.test(temp))temp = temp.toString().substring(0, temp.toString().indexOf('.')+ pointNum + 1)
        inputEl.value = temp;
        this.$emit("input", temp);
      }
    },
    computed: {},
    filters: {},

  }
</script>
<style scoped>
  .number-input {
    font-size: 18px;
    line-height: 35px;
    border: 1px solid #dadada;
    height: 35px;
    width: 100px;
    border-radius: 3px;
    color: black;
    padding: 0 10px;
    display: inline-block;
  }
</style>
<style>

</style>
