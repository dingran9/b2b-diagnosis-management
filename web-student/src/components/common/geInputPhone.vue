<template>
  <input @input="keyupHandle($event.target.value)"
         ref="input"
         :value="value">
</template>
<script>
  export default {
    components: {},
    data(){
      return {
        localValue:''
      }
    },
    props: {
        value:{

        },
      isMobile:{

      },
      maxLength:{
            default:11
      }
    },
    mounted(){
        this.keyupHandle(this.value);
    },
    methods: {
      keyupHandle(value){
        value = value.trim().replace(/[^\d]/g,'').slice(0,this.maxLength);
        this.$refs.input.value = value;
        this.$emit('input',value);
        this.$emit('update:isMobile',/^1[34578]\d{9}$/.test(value))
      }
    },
    computed: {},
    filters: {}

  }
</script>
<style>

</style>
