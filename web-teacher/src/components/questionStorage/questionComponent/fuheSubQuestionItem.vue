<template>
	<div class="fuheEduQuesItem">
		<div class="questionArea">
			<p v-html="questionNameFn(questionItem)" class="questionTitleArea" style="word-wrap:break-word;
				word-break:break-all;"></p>
			<ul>
				<li v-for="answerOption in answerDealFn(questionItem)">
					<div class="optionKeyWrap" v-if="answerOption.optionKey">
						<span v-html="answerOption.optionKey"></span><span>、</span>
					</div>
					<div class="answerContent">
						<p v-html="answerFn(answerOption.optionValue,questionItem)"></p>

					</div>
				</li>
			</ul>
		</div>
		<div class="operationArea">
			<div class="myTestOperation questionPageType">
				<div class="questionInfo">
					<p>
						<span class="infoTitle">预估分值</span>
						<span>{{questionItem.score}}分</span>
					</p>
				</div>
				<div class="pointsWrap">
					<p>包含知识点</p>
					<el-tag v-for="item in (questionItem.tree || JSON.parse(questionItem.knowledges))">{{item.name}}</el-tag>
				</div>
				<div class="actionWrap">
					<el-popover
					  ref="analysis"
					  placement="bottom"
					  width="200"
					  trigger="hover">
					  <p>解析</p>
					  <p v-html="data.analysis"></p>
					</el-popover>
					<el-popover
					  ref="answer"
					  placement="bottom"
					  width="200"
					  trigger="hover">
					  <p style="padding-left: 10px;">答案:</p>
						<p v-for="answerItem in eduPaperAnswerDealFn(questionItem.answer)" style="padding-left: 10px; word-wrap: break-word;word-break: break-all;" v-html="answerFn(answerItem.answerValue)">
						</p>
					</el-popover>
					<el-button v-popover:analysis>显示解析</el-button>
					<el-button v-popover:answer>显示答案</el-button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		props:["questionItem"],
		component:{},
		data(){
			return {
				data:{
					difficultStar:0,
					gradeName: "",
					score:"",
					analysis:"",
					isLocalTemp:false,
					isFuHeQuestion:false,
					subtitles:[],
				}
			}
		},
		mounted(){
//			console.log(this.questionItem.quesAnalyze);
			if((JSON.parse((this.questionItem.quesAnalyze || this.questionItem.questionAnalyze)) || "[]")[0]) {
					this.data.analysis = this.strToUrl((JSON.parse((this.questionItem.quesAnalyze || this.questionItem.questionAnalyze)) || "[]")[0].analyzeValue);
				} else {
					this.data.analysis = "";
				}
			
		},
		methods:{
			eduPaperAnswerDealFn(answer){
				console.log(answer)
				if((answer.indexOf("[") > -1 ) && (answer.indexOf("]") > -1)){
					//就认为是一个数组
					return JSON.parse(answer);
				}
				
				return [{"answerValue":answer}];
			},
			questionNameFn(questionItem){
//				console.log(questionItem);
				let questionName = questionItem.stem || questionItem.baseName;
//				if(questionItem.source == "1" || questionItem.source == "web"){
//					//说明是易教的题,进行转换
////					console.log("易教试题格式化");
////					console.log(questionItem);
//					questionName = this.strToUrl(questionName);
////					console.log(questionName);
//				}
				return this.strToUrl(questionName);
			},
			answerFn(answer,questionItem){
				let answerTemp = answer;;
				return this.strToUrl(answer);
			},
			answerDealFn(questionItem){
//				console.log(questionItem)
//				console.log("hahahahhahaha");
				let answer;
				
				if(questionItem.hasOwnProperty("quesOption")){
					answer = questionItem.quesOption;
				}else{
					answer = questionItem.questionOption;
				}
				
//				console.log(answer,"答案信息");
				if(answer == ""){
					return [];
				}
				
				if(answer){
					return JSON.parse(answer);
				}
			},
			titleFn(questionItem){
//				console.log(this.questionItem);
				if(questionItem.stem){
					return		questionItem.stem
				}else{
					return questionItem.baseName
				}
			},
		},
		filters:{
			titleFilter:function(title){},
			
		}
	}
</script>

<style lang="scss">
	.fuheEduQuesItem{
		padding: 5px 0;		
		overflow: hidden;
		.questionArea{		
			float:left;
			word-wrap:break-word; /*连续的数字或者英文就会不换行 得使用强制换行*/
			word-break:break-all;
			.questionTitleArea{
				width: 650px;
				/*display: inline-block;*/
				margin-bottom: 20px;
				word-wrap:break-word; /*连续的数字或者英文就会不换行 得使用强制换行*/
				word-break:break-all;
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
					
					img{
						vertical-align: top;
						max-width: 50%;
					}
				}
			}
			.fuheQuestionName{
				word-wrap:break-word; /*连续的数字或者英文就会不换行 得使用强制换行*/
				word-break:break-all;
				max-width: 600px;
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
			.addToMyWrap{
				position: relative;
				margin-top: 100px;
				margin-left: 50px;
				p{
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
				.hotLevelWrap{
					cursor: pointer;
					float: right;
					margin-right: 80px;
					margin-top: 8px;
					*{
						vertical-align: bottom;
					}
				}
			}
			.myTestOperation{
				font-size: 0;
				position: relative;
				margin-top: 100px;
				margin-left: 10px;
				span{
					display: inline-block;
					width: 140px;
					height: 40px;
					text-align: center;
					line-height: 40px;
					border-radius: 20px;
					font-size: 16px;
					margin-right: 40px;
					margin-bottom: 40px;
				}
				.edit{
					cursor: pointer;
					background: transparent;
					border: 1px solid #5c5c5c;
				}
				.noEdit{
					background: transparent;
					border: 1px solid #C2CCD1;
					color: #C2CCD1;
					cursor: not-allowed;
				}
				.add{
					cursor: pointer;
					background: #1fd094;
					color: #FFFFFF;
				}
				.delete{
					cursor: pointer;
					background: #FF6666;
					color: #FFFFFF;
				}
			}
			.myTestOperation.questionPageType{
				margin: 0;
				/*background: #CCCCCC;*/
				span{
					display: initial;
				}
				.questionInfo{
					font-size: 0;
					margin-bottom: 20px;
					.infoTitle{
						font-size: 14px;
						display: inline-block;
						width: 100px;
						height: 20px;
						margin: 0;
						background: #FFFFFF;
						border-radius: 0;
						line-height: 20px;
					}
					.difficult{
						vertical-align: middle;
					}
					.el-rate__item{
						margin: 0;
					}
					.el-rate{
						display: inline-block;
						font-size: 0;
						vertical-align: baseline;
					}
				}
				.pointsWrap{
					margin-bottom: 20px;
					&>p{
						width: 100px;
						text-align: center;
						font-size: 14px;
					}
				}
				.actionWrap{
					i,span{
						cursor: pointer;
						text-align: center;
						height: 40px;
						line-height: 40px;
						display: inline-block;
						width: 60px;
						font-size: 14px;
						margin: 0 10px;
					}
					&>span{
						display: none;
					}
					.addToCustomPaper{
						border: 1px #13CE66 solid;
						color: #13CE66;
						border-radius: 4px;
					}
					.deleteFromCustomPaper{
						border: 1px orangered solid;
						border-radius: 4px;
						color: orangered;
					}
					.el-button{
						padding: 0;
					}
				}
				.el-tag{
					background: #d3f2e5;
					color: #505050;
					height: 30px;
					border-radius: 15px;
					line-height: 30px;
					text-align: center;
					margin: 5px;
					font-size: 12px;
				}
			}
		}
	}
	
</style>