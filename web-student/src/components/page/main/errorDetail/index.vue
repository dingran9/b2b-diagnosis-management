<template>
  <div>
    <div class="content-right-title-wrap">
      <h2 class="title">个人中心>错题记录
        <goback></goback>
      </h2>

    </div>
    <div class="content-right-body-wrap clear-fix">
      <fav-question
        :question="query"
        type="1"
      ></fav-question>
      <div class="analyze-wrap">
        <h3 class="analyze-title">
          答案解析 :
        </h3>
        <div class="analyze-body">
          <div class="ge-por">
            <span class="analyze-body-caption">答案 :</span>
            <div class="analyze-body-text">
              正确答案是 <span v-html="strToUrl(query.rightAnswer)"></span>, 你的答案是 <span v-html="strToUrl(query.studentAnswer)"></span>

            </div>
          </div>
          <div class="ge-por">
            <span class="analyze-body-caption">解析 :</span>
            <div class="analyze-body-text">
              <template v-for="item in query.questionAnalyzes">
                <span v-html="filterStr(item.analyzeKey) + filterStr(item.analyzeValue)"></span>
              </template>

            </div>
          </div>
          <div style="padding-top:10px;">
          <span>
            语音解析:
          </span>
            <radioPlayer
              v-if="query.audioAnalyzePath"
              :audio-is-play.sync="isPlay"
              :audio-src="query.audioAnalyzePath"></radioPlayer>
            <span v-else>
                暂无语音解析
              </span>
          </div>
        </div>

      </div>
      <div class="analyze-foot">
        <div class="delete-btn" @click="deleteQuestion">
          删除本题
        </div>
      </div>

    </div>
  </div>
</template>
<script>
  import radioPlayer from '../../../common/radioPlayer.vue';
  import goback from '../../../common/goback.vue';
  import favQuestion from '../../../common/favQuestion.vue';
  export default {
    components: {
      favQuestion, goback, radioPlayer
    },
    data(){
      return {
        query: {},
        isPlay: false
      }
    },
    mounted(){
      this.query = this.localData.get('errorDetail');
      console.log(this.query)
    },
    beforeRouteLeave(to, from, next){
      this.isPlay = false;
      this.$nextTick(() => {
        next();
      })

    },
    methods: {
      deleteQuestion(){
        this.$confirm('您是否确认删除该错题记录?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            let sendData = {"questionCodes":[this.query.questionCode]};
             this.$ajax.deleteWrongQuestions(sendData)
               .then(({httpCode,result})=>{
                 if(httpCode == 200){
                   this.$message({
                     type: 'success',
                     message: '删除成功!'
                   });
                    this.$router.go(-1);
                 }else{
                   this.$message('删除失败,请重试!');
                 }

               })

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      filterStr(str) {
        return !!str ? str : '';
      }
    }
    ,
    computed: {}
    ,
    filters: {}

  }
</script>
<style lang="scss">
  @import "../../../../../static/css/gemixin.scss";
  @import '../../../../../static/css/contentRight.scss';
  .analyze-wrap {
    background: #fff;
    text-align: left;
    padding: 40px;
    .analyze-title {
      font-size: 18px;
      color: #4c6175;
      padding: 0 0 20px 0;
    }
    .analyze-body {
      line-height: 30px;
      color: #666666;
      font-size: 16px;
      .analyze-body-caption {
        position: absolute;
        left: 0;
        top: 0;
      }
      .analyze-body-text {
        padding: {
          left: 55px;
        }
      }
    }

  }
  .analyze-foot {
    padding: {
      top: 70px;
      bottom: 70px;
    }
    .delete-btn {
      @include ge-btn(400px, 50px);
    }
  }
</style>
