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
      <div @click="$emit('select',questionItem)" class="startExercise">开始做题</div>
		</div>
		<div class="operationArea">
			<div class="knowPoints">
				<el-tag v-for="item in (questionItem.tree || JSON.parse(questionItem.knowledges))">{{item.name}}</el-tag>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		props:["questionItem","type"],
		component:{},
		data(){
			return {
				data:{

				}
			}
		},
		mounted(){
//			this.answerDealFn(this.questionItem);
		},
		methods:{
			questionNameFn(questionItem){
			  JSON.stringify()
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
		padding: 35px 0;
		border-bottom: 1px solid #e1e5ec;
		overflow: hidden;
		.questionArea{
      position: relative;
			float:left;
			word-wrap:break-word; /*连续的数字或者英文就会不换行 得使用强制换行*/
			word-break:break-all;
      min-height: 140px;
			p.questionTitleArea{
				width: 650px;
				/*display: inline-block;*/
				margin-bottom: 20px;
				img{
					max-width: 50%;
				}
			}
			img{
				vertical-align: middle;
			}
			li{
				vertical-align: top;
				overflow: hidden;
				.optionKeyWrap,.answerContent{
					float: left;
					max-width: 600px;
					img{
						vertical-align: top;
						max-width: 50%;
					}
				}
			}
		}
		.operationArea{
			position: relative;
			float: left;
			margin-left: 110px;
			width: calc(100% - 800px);
			.el-tag{
				background: #d3f2e5;
				color: #505050;
				height: 30px;
				border-radius: 15px;
				line-height: 30px;
				text-align: center;
				margin: 5px;
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

</style>
