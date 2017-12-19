<template>
  <div>
    <div class="content-right-title-wrap">
      <h2 class="title">阶段检测>报告详情>去攻克 <goback></goback></h2>

    </div>
    <div class="content-right-body-wrap">
      <div class="capture">
        <video v-if=" videoSrc"
               width="658"
               height="444"
               :src="videoSrc"
               controls
               style="background: #000;margin:10px"
        ></video>
        <img v-else class="no-video-img" src="../../../../../static/img/no-video.png" alt="">
        <div class="capture-btn-wrap">
          <div class="capture-btn"
               @click="practice">
            练一练
          </div>
        </div>

      </div>
    </div>
  </div>
</template>
<script>
  import goback from '../../../common/goback.vue';
  export default {
    components: {goback},
    data(){
      return {
        result: {},
        videoSrc: ''
      }
    },
    mounted(){
      this.$ajax.getVideoByKnowledge(this.$route.query)
        .then(({httpCode, result}) => {
          if (httpCode == 200) {
            this.result = result;
            try {
              this.videoSrc = result.videoInfo[0].video_url;
              this.videoId = result.videoInfo[0].id;
            } catch (e) {
            }
          } else {
            this.$message('获取视频资源失败,请刷新页面重试!');
          }
        })
    },
    props: {},
    methods: {
      practice(){
        if(!this.videoId){
          this.$message('该视频下没有练一练试题');
          return;
        }
        this.$router.push({
          path: '/main/practice',
          query:Object.assign({videoId:this.videoId},this.$route.query),
        })
      }
    },
    computed: {},
    filters: {}

  }
</script>

<style lang="scss" scoped>
  @import '../../../../../static/css/contentRight.scss', '../../../../../static/css/gemixin.scss';

  .capture {
    max-width: 1260px;
    @include margin-center;
    background: #fff;
    .no-video-img {
      padding: {
        top: 180px;
        bottom: 110px;

      }

    }
    .capture-btn-wrap {
      padding: {
        bottom: 30px;
      }
    }
    .capture-btn {
      @include ge-btn(400px, 50px);
    }
  }
</style>
