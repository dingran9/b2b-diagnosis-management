<template>
  <div>
    <div class="content-right-title-wrap">
      <h2 class="title">作业   {{homeworkTitle}}
        <goback></goback>
      </h2>

    </div>
    <div
      v-if="data.questionList.length"
      class="content-right-body-wrap ge-por">
      <answer-card
        :answers="answersQuestionHandle"
        :currentNum="curAnswerNum"
        @post-answers="postAnswers"
        @select-Question="chooseQuestion"></answer-card>
      <question
        :test="test"
        :question-info="{
          curAnswerNum:curAnswerNum,
          data:data.questionList[curAnswerNum],
          totalNum:data.questionList.length
        }"
        @next="nextQuestion"
      ></question>

    </div>
    <div v-else>暂无试题!</div>
  </div>
</template>
<script>
  import answerCard from '../../../common/answerCard.vue';
  import question from '../../../common/question.vue';
  import goback from '../../../common/goback.vue';
  export default {
    components: {
      answerCard, question, goback
    },
    data(){
      return {
        test: {data: 1},
        result: {},
        data: {
          questionList: []
        },
        curAnswerNum: 0,
        homeworkTitle:""
      }
    },
    mounted(){
    		this.homeworkTitle = JSON.parse(localStorage.getItem("homeworkInfo")).taskName;
    		this.getQuestion();
    },
    methods: {
    		getQuestion(){
    			var sendData = {
    				taskCode :  JSON.parse(localStorage.getItem("homeworkInfo")).code,
					type: JSON.parse(localStorage.getItem("homeworkInfo")).taskStatus,
    			};
//  			var sendData = {
//  				taskCode :  "d8578d19fcdb4e7bb2dc61ea86663e1e",
//  				type: JSON.parse(localStorage.getItem("homeworkInfo")).taskStatus,
//  			};
	      
	      this.$ajax.getTaskInfoByInClassTest(sendData)
	        .then(({httpCode, result}) => {
	          if (httpCode == 200) {
	            this.beginTime = +new Date();
	            //处理数据
	            this.data.questionList = function () {
	              let questions = (result) || [];
	              //缓存练一练数据
//	              this.localData.set('practicePaperDetail', questions);
	              for (let item of questions) {
	                item.stem = this.strToUrl(item.stem);
									item.type = "1";
	                item.studentAnswer = '';
	                try {
	                  item.quesOption = item.quesOption.length && JSON.parse(item.quesOption);
	                  for (let tempItem of item.quesOption) {
	                    tempItem.optionValue = this.strToUrl(tempItem.optionValue);
	                  }
	                } catch (e) {
	                  console.log('试卷解析有问题,使劲怼后台的!!!');
	                }
	              }
	              return questions;
	            }.bind(this)();
	
	            //缓存返回结果
	            this.result = result;
	          } else {
	            this.$message('获取试卷详情失败,请刷新浏览器充重试!');
	          }
	        })
	    
    		},
      chooseQuestion(index){
        this.curAnswerNum = index;
      },
      postAnswers(){
        //拿到缓存数据
//      console.log(this.data.questionList,"题目信息");
//      let questions = this.localData.get('practicePaperDetail');
//      for (var i = 0; i < this.data.questionList.length; i++) {
//        var obj = this.data.questionList[i];
//        questions[i].isRight = obj.answer == obj.studentAnswer;
//        questions[i].userAnswerResul = obj.studentAnswer;
//      }
//      //
//      this.localData.set('practicePaperDetail', questions);
				let questionData = this.data.questionList;
				console.log(questionData);
				let sendData = {};
				sendData.studentCode = JSON.parse(localStorage.getItem("web-user")).userId;
				sendData.studentName =  JSON.parse(localStorage.getItem("web-user")).userName;
				sendData.taskCode = questionData[0].taskCode
				sendData.studentAnswerSheetList = [];
				
				for (var i = 0; i < questionData.length; i++) {
					sendData.studentAnswerSheetList.push({
						baseCode:questionData[i].code,
						sout:i+1,
						questionType:"1",
						studentAnswer:questionData[i].studentAnswer
					})
				}
				console.log(sendData);
				
				this.$ajax.saveTaskInfoByInClassTest(sendData)
        .then(({httpCode, result}) => {
          if (httpCode == 200) {
						console.log(result);
//						this.listDealFn(result.list);
						if(result){
			        this.$router.push({
			          path: '/main/demoShow',
			        })
						}
          } else {
            this.$message('提交答案失败,请稍后重试');
          }
        })
				
//      this.$router.push({
//        path: '/main/demoShow',
//
//      })

      },
      nextQuestion(){
        this.curAnswerNum += 1;
      }
    },
    computed: {
      answersQuestionHandle(){
        let temp = [];
        for (let item of this.data.questionList) {
          temp.push({
            isAnswer: item.studentAnswer
          })
        }
        return temp;
      },
      curQestion(){
        return this.data.questionList[this.curAnswerNum];
      },

    },
    beforeRouteEnter(to, from, next){
      next(vm => {
        // 通过 `vm` 访问组件实例
        if(from.path ==  "/main/practicePaperDetail"){
            vm.$router.go(-1);
        }
      })
    },
    filters: {}

  }
</script>
<style lang="scss" scoped>
  @import '../../../../../static/css/contentRight.scss';

</style>
