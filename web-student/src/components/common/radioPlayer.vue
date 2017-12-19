<template>
  <div class="audio-button "
       :class="{act:audioIsPlay}"
       @click="tabPlay"
      >
  </div>
</template>
<script>
  export default {
    components: {},
    data(){
      return {
        audio: new Audio()
      }
    },
    props: {
      audioIsPlay: {
        default: false,
      },
      audioSrc:{
        type:String
      }

    },
    mounted(){
      this.audio.src = this.audioSrc;
      this.isPlay(this.audioIsPlay);
      this.audio.onended = ()=>{
        this.$emit('update:audioIsPlay',false);
      }
    },
    methods: {
      tabPlay(){
       this.$emit('update:audioIsPlay',!this.audioIsPlay);
      },
      isPlay(isPlay){
        if(isPlay){
          this.audio.play();
        }else{
          this.audio.pause();
        }
      }
    },
    watch:{
      audioIsPlay(isPlay){
         this.isPlay(isPlay)
      },
      audioSrc(src){
          this.audio.src = src;
      }
    },
    computed: {},
    filters: {},
    beforeDestroy(){
        //关闭声音
        this.audioIsPlay = false;
    }

  }
</script>
<style scoped>
  .audio-button {
    display: inline-block;
    vertical-align: middle;
    cursor: pointer;
    width: 160px;
    height: 40px;
    background:url(../../../static/img/STSingleVoice@2x.png) no-repeat 10px center / 10px 15px,
    url(../../../static/img/STSingleVoiceView@2x.png) no-repeat center center / 100% 100%;
  }
  .audio-button.act{
    animation: audio-act .6s infinite;
  }
  @keyframes audio-act {
    100%{
      background:url(../../../static/img/STSingleVoice@2x.png) no-repeat 10px center / 12px 17px,
      url(../../../static/img/STSingleVoiceView@2x.png) no-repeat center center / 100% 100%;
    }
  }
</style>
