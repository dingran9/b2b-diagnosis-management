<template>
  <div>
    <section class="content-right-title-wrap">
      <h2 class="title">备课管理</h2>
    </section>
    <section class="content-right-body-wrap clear-fix">
      <video controls="controls" autoplay="autoplay">
        <source src="../../../static/img/movie.ogg" type="video/ogg"/>
        Your browser does not support the video tag.
      </video>
    </section>
  </div>
</template>
<script>

  export default {
    components: {},
    data() {
      return {}
    },
    mounted() {
    },
    methods: {}
  }
</script>
<style lang="scss" scoped>
  @import '../../../static/css/contentRight';

  video {
    width: 50%;
    height: 50%;
  }
  video::-internal-media-controls-download-button {
    display:none;
  }

  video::-webkit-media-controls-enclosure {
    overflow:hidden;
  }

  video::-webkit-media-controls-panel {
    width: calc(100% + 2px);
  }

  .content-right-body-wrap {
    background: white;
    overflow: hidden;
  }

</style>
