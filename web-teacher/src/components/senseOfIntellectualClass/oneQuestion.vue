<template>
	<div class="eduQuesItem">
		<div class="questionArea">
			<p v-html="questionNameFn(questionItem)" class="questionTitleArea"></p>
			<ul>
				<li v-for="answerOption in answerDealFn(questionItem)">
					<div class="optionKeyWrap">
						<span v-html="answerOption.optionKey"></span><span>、</span>
					</div>
					<div class="answerContent">
						<p v-html="answerFn(answerOption.optionValue,questionItem)"></p>
					</div>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
	export default {
		component:{},
    props:['questionItem'],
		data(){
			return {

			}
		},
		mounted(){
console.log(1);
    },
		methods:{
		  close(){
        window.opener=null;
        window.open('','_self');
        window.close();
      },
			questionNameFn(questionItem){
				let questionName = questionItem.stem || questionItem.baseName;
				return this.strToUrl(questionName);
			},
			answerFn(answer,questionItem){
				let answerTemp = answer;;
				return this.strToUrl(answer);
			},
			answerDealFn(questionItem){
				let answer;
				if(questionItem.hasOwnProperty("quesOption")){
					answer = questionItem.quesOption;
				}else{
					answer = questionItem.questionOption;
				}
				if(answer == ""){
					return [];
				}
				if(answer){
					return JSON.parse(answer);
				}
			},
			titleFn(questionItem){
				if(questionItem.stem){
					return		questionItem.stem
				}else{
					return questionItem.baseName
				}
			},
		},
		filters:{
			titleFilter:function(title){
				return title;

		},

		}
	}
</script>

<style lang="scss" scoped>
	.eduQuesItem{
		padding:  20px;
    margin-bottom:20px;
		border: 1px solid #e1e5ec;
    border-radius: 10px;
		overflow: hidden;
    text-align: left;
		.questionArea{
      position: relative;
			float:left;
			word-wrap:break-word; /*连续的数字或者英文就会不换行 得使用强制换行*/
			word-break:break-all;
			p.questionTitleArea{
				/*width: 650px;*/
				/*display: inline-block;*/
        font-size: 40px;
				margin-bottom: 20px;
				img{
					max-width: 80%;
				}
			}
			img{
				vertical-align: middle;
			}
			li{
				vertical-align: top;
				overflow: hidden;
				.optionKeyWrap,.answerContent{
          font-size: 40px;
					float: left;
					max-width: 600px;
					img{
						vertical-align: top;
						max-width: 50%;
					}
				}
			}
      .startExercise{
        position: absolute;
        bottom: 0px;
        right: -200px;
        cursor: pointer;
        float: left;
        width: 160px;
        height: 40px;
        border-radius: 20px;
        background: #1fd094;
        color: #FFFFFF;
        text-align: center;
        line-height: 40px;
        font-size: 18px;
      }
		}

	}

</style>
