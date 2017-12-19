<template>
	<div class="eduQuesItem">
		<div class="questionArea" v-if="!data.isFuHeQuestion">
			<p v-html="questionNameFn(questionItem)" class="questionTitleArea"></p>
			<!--<img src="../../../../static/img/no2.png" alt="" />-->
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
		<div class="operationArea" v-if="!data.isFuHeQuestion">
			<div class="knowPoints" v-show="type !='questionPageType'">
				<el-tag v-for="item in (questionItem.tree || JSON.parse(questionItem.knowledges))">{{item.name}}</el-tag>
			</div>
			<div class="addToMyWrap" v-show="type=='eduType'">
				<p @click="showAddPopup(questionItem)">添加到我的题库</p>
				<div class="hotLevelWrap" style="display: none;">
					<img src="../../../../static/img/redThumb.png" />
					<!--{{questionItem.useTimes}}-->
				</div>
			</div>
			<div class="myTestOperation" v-show="type =='personType'">
				<span class="edit" @click="handleEditQuestion" v-if="questionItem.source==0">编辑</span>
				<span class="noEdit" v-else>易教题库不可编辑</span>
				<span class="add" @click="handleCopyQuestion">复制到...</span>
				<span class="delete" @click="handleDeleteQuestion">删除</span>
			</div>
			<div class="myTestOperation questionPageType" v-show="type =='questionPageType'">
				<div class="questionInfo">
					<p>
						<span class="infoTitle">预估分值</span>
						<span>{{data.score}}分</span>
					</p>
					<p>
						<span class="infoTitle difficult">难度</span>
						<el-rate v-model="data.difficultStar" :max="3" :disabled="true"></el-rate>
					</p>
					<p>
						<span class="infoTitle">年级</span>
						<span>{{data.gradeName}}</span>
					</p>
				</div>
				<div class="pointsWrap">
					<p>包含知识点</p>
					<el-tag v-for="item in (questionItem.tree || JSON.parse(questionItem.knowledges))">{{item.name}}</el-tag>
				</div>
				<div class="actionWrap">
					<el-popover ref="analysis" placement="bottom" width="200" trigger="hover">
						<p>解析:</p>
						<p v-html="data.analysis"></p>
					</el-popover>
					<el-popover ref="answer" placement="bottom" width="200" trigger="hover">
						<p style="padding-left: 10px;">答案:</p>
						<p v-for="answerItem in eduPaperAnswerDealFn(questionItem.answer)" style="padding-left: 10px; word-wrap: break-word;word-break: break-all;" v-html="answerFn(answerItem.answerValue)">
						</p>
					</el-popover>
					<i class="addToCustomPaper" @click="addToLocalTemp(questionItem)" v-if="!questionItem.isLocalTemp">添加</i>
					<i class="deleteFromCustomPaper" @click="deleteFromLocalTemp(questionItem)" v-else>取消</i>
					<el-button v-popover:analysis>显示解析</el-button>
					<el-button v-popover:answer>显示答案</el-button>
				</div>
			</div>
		</div>
		<div v-if="data.isFuHeQuestion">
			<p class="fuheInfo">复合题</p>
			<div class="fuheTitleWrap">
				<p v-html="questionNameFn(questionItem)" class="questionTitleArea"></p>
				<p class="fuheQuestionInfo">
					<span class="infoTitle difficult">难度</span>
					<el-rate v-model="data.difficultStar" :max="3" :disabled="true"></el-rate>
					<i class="addToCustomPaper" @click="addToLocalTemp(questionItem)" v-if="!questionItem.isLocalTemp">添加</i>
					<i class="deleteFromCustomPaper" @click="deleteFromLocalTemp(questionItem)" v-else>取消</i>
				</p>
			</div>
			<fuheSubQuestionItem v-for="subtitle in data.subtitles" :key="subtitle.id" :questionItem="subtitle"></fuheSubQuestionItem>
		</div>
	</div>
</template>

<script>
	import fuheSubQuestionItem from "./fuheSubQuestionItem.vue"
	export default {
		props: ["questionItem", "type", "materialVersion", "questionTypes"],
		components: {
			fuheSubQuestionItem
		},
		data() {
			return {
				data: {
					difficultStar: 0,
					gradeName: "",
					score: "",
					analysis: "",
					isLocalTemp: false,
					isFuHeQuestion: false,
					subtitles: [],
				}
			}
		},
		mounted() {
			console.log(this.questionItem);
			//难度等级
			this.data.difficultStar = parseInt(this.questionItem.difficultStar) || 3;
			//			console.log(this.data.difficultStar)
			//分值,如果没有,默认3分
			this.data.score = parseInt(this.questionItem.score || 3);
			//年级
			this.data.gradeName = this.commonGrond[this.questionItem.gradeCode] || null;
			//答案解析
			if(this.questionItem.type != 6) {
				this.data.isFuHeQuestion = false;
				if((JSON.parse((this.questionItem.quesAnalyze || this.questionItem.questionAnalyze)) || "[]")[0]) {
					//				console.log("sdfsdfasf")
					this.data.analysis = this.strToUrl((JSON.parse((this.questionItem.quesAnalyze || this.questionItem.questionAnalyze)) || "[]")[0].analyzeValue);
				} else {
					this.data.analysis = "";
				}
			} else {
				//是复合题
				console.log(12313123123123)
				this.data.isFuHeQuestion = true;
				console.log(this.questionItem.subtitle);
				this.data.subtitles = this.questionItem.subtitle;
			}

		},
		methods: {
			isLocalTempFn() {
				let _this = this;
				_this.localQuestionIndex.map(function(item) {
					console.log(item);
					console.log(_this.questionItem);
					if(item == _this.questionItem.id) {
						_this.data.isLocalTemp = true;
					}
				})
			},
			questionNameFn(questionItem) {
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
			answerFn(answer, questionItem) {
				let answerTemp = answer;;
				//				if(questionItem.source == "1" || questionItem.source == "web"){
				//					//说明是易教的题,进行转换
				////					console.log("易教试题格式化");
				////					console.log(answer);
				//					answerTemp = this.strToUrl(answer);
				////					console.log(answerTemp);
				//				}
				return this.strToUrl(answer);
			},
			answerDealFn(questionItem) {
				//				console.log(questionItem)
				//				console.log("hahahahhahaha");
				let answer;

				if(questionItem.hasOwnProperty("quesOption")) {
					answer = questionItem.quesOption;
				} else {
					answer = questionItem.questionOption;
				}

				//				console.log(answer,"答案信息");
				if(answer == "") {
					return [];
				}
				if(answer) {
					return JSON.parse(answer);
				}
			},
			eduPaperAnswerDealFn(answer){
				console.log(answer)
				var answer = answer || "";
				if((answer.indexOf("[") > -1 ) && (answer.indexOf("]") > -1)){
					//就认为是一个数组
					return JSON.parse(answer);
				}
				
				return [{"answerValue":answer}];
			},
			showAddPopup(item) {
				//				console.log(item);
				this.$emit("popupSelect", item);
			},
			titleFn(questionItem) {
				//				console.log(this.questionItem);
				if(questionItem.stem) {
					return questionItem.stem
				} else {
					return questionItem.baseName
				}
			},
			handleEditQuestion() {
				//编辑例题
				//				console.log("路由跳转到编辑例题");
				//通知父组件跳转到编辑页面
				this.$emit("editQuestion", this.questionItem);
			},
			handleCopyQuestion() {
				//复制例题
				//				console.log(this.questionItem,"复制例题");
				this.$emit("popupSelect", this.questionItem);
			},
			handleDeleteQuestion() {
				//删除例题
				//				console.log("删除例题");
				this.$emit("deleteAction", this.questionItem);
			},
			addToLocalTemp(item) {
				//添加到本地
				let dealItem = this.dealQuestionItem(item)
				console.log(dealItem);
				let localData = localStorage.getItem("questionAdded");
				//				console.log(localData);
				if(localData && localData != "") {
					console.log("本地存在数据", JSON.parse(localData));
					let localDataTemp = JSON.parse(localData);
					//判断是否存在已经有的题型
					for(var i = 0; i < localDataTemp.length; i++) {
						if(localDataTemp[i].itemType == item.type) {
							console.log(localDataTemp[i].itemType, item.type)
							//说明此题类型已经存在,如果内部没有这个题,就添加进去
							let questiontag = [];
							localDataTemp[i].diagnosisSmallQuestionDtosList.map(function(item) {
								questiontag.push(item.repositoryQuestionCode);
							})
							//							console.log(questiontag,"tags");
							if(questiontag.indexOf(dealItem.repositoryQuestionCode) > -1) {
								//什么也不做
							} else {
								localDataTemp[i].diagnosisSmallQuestionDtosList.push(dealItem);
							}
							break;
						}
					}
					console.log(i);
					if(i == localDataTemp.length) {
						//没有一样的,添加新的
						let localDataNewTemp = {
							itemType: item.type,
							itemContent: this.getTypeContent(item.type),
							diagnosisSmallQuestionDtosList: [dealItem]
						};
						localDataTemp.push(localDataNewTemp);

					}
					//存储到本地
					console.log(localDataTemp);
					localStorage.setItem("questionAdded", JSON.stringify(localDataTemp));

				} else {
					console.log("空数据,无列表");
					let localDataTemp = [{
						itemType: item.type,
						itemContent: this.getTypeContent(item.type),
						diagnosisSmallQuestionDtosList: [dealItem]
					}];
					//存储到本地
					console.log(localDataTemp);
					localStorage.setItem("questionAdded", JSON.stringify(localDataTemp));

				}
				//更改问题的islocaltemp属性
				this.questionItem.isLocalTemp = true;
				//添加到本地试题,刷新题目数量
				this.$emit("localNum");

			},
			dealQuestionItem(item) {
				//0客观1主观
				let type = 0;
				if(item.type == 1 || item.type == 2) {
					type = 0;
				} else {
					type = 1;
				}
				let logicType = "";
				console.log(item);
				console.log(this.questionTypes, "题型");
				this.questionTypes.map(function(questionType) {
					if(questionType.id == item.enlargeId) {
						logicType = questionType.logicType;
					}
				})

				let subtitle = "";
				console.log()
				if(item.type == 6) {
					subtitle = item.subtitle;
				}

				return {
					"repositoryQuestionCode": item.id,
					"questionAnswer": item.answer,
					"quesionOption": item.quesOption,
					"questionScore": item.score,
					"difficultStar": item.difficultStar,
					"questionType": item.type,
					"type": type,
					"stageCode": item.stageCode,
					"gradeCode": item.gradeCode,
					"subjectCode": this.localData.get("webTeacherUser").userSubject,
					"bookVersion": this.materialVersion.name,
					"bookVersionCode": this.materialVersion.code,
					"questionCode": null, //待确定
					"questionStem": item.stem,
					"questionAnalyze": item.quesAnalyze,
					"questionKnowledge": item.tree,
					"questionProduction": item.basetree,
					"logicType": logicType,
					"subtitle": subtitle
				}
			},
			getTypeContent(typeCode) {
				return this.questionTypeCode[typeCode];
			},
			deleteFromLocalTemp(item) {
				//从本地删除
				let localData = localStorage.getItem("questionAdded");
				console.log(item);
				if(localData && localData != "") {
					let localDataTemp = JSON.parse(localData);
					console.log(localDataTemp);
					for(var i = 0; i < localDataTemp.length; i++) {
						if(localDataTemp[i].itemType == item.type) {
							//类型相同
							for(var j = 0; j < localDataTemp[i].diagnosisSmallQuestionDtosList.length; j++) {
								if(localDataTemp[i].diagnosisSmallQuestionDtosList[j].repositoryQuestionCode == item.id) {
									localDataTemp[i].diagnosisSmallQuestionDtosList.splice(j, 1);
									break;
								}
							}
						}
					}
					localStorage.setItem("questionAdded", JSON.stringify(localDataTemp));
					this.questionItem.isLocalTemp = false;
					this.$emit("localNum");
				}
				//本地没有试题,不管它

			}
		},
		filters: {
			titleFilter: function(title) {
				//				console.log(title);
				//				var re = /http:[/]{2}[a-zA-Z0-9.%=/_-]{1,}[.](jpg|png)/g;
				//				if(re.test(title)){
				//					//有图
				//					console.log("有图")
				//					return title.match(re);
				//				}else{
				//					console.log("无图")
				//				}
				return title;

			},

		}
	}
</script>

<style lang="scss">
	.eduQuesItem {
		padding: 35px 10px;
		border-bottom: 1px solid #e1e5ec;
		overflow: hidden;
		.questionArea {
			float: left;
			word-wrap: break-word;
			/*连续的数字或者英文就会不换行 得使用强制换行*/
			word-break: break-all;
			p.questionTitleArea {
				width: 650px;
				word-wrap:break-word;
				word-break:break-all;
				/*display: inline-block;*/
				margin-bottom: 20px;
				img {
					max-width: 50%;
				}
			}
			img {
				vertical-align: middle;
			}
			li {
				vertical-align: top;
				overflow: hidden;
				word-wrap:break-word;
				word-break:break-all;
				.optionKeyWrap,
				.answerContent {
					float: left;
					max-width: 650px;
					img {
						vertical-align: top;
						max-width: 50%;
					}
				}
			}
			.fuheQuestionName {
				word-wrap: break-word;
				/*连续的数字或者英文就会不换行 得使用强制换行*/
				word-break: break-all;
				max-width: 600px;
			}
		}
		.operationArea {
			position: relative;
			float: left;
			margin-left: 110px;
			width: calc(100% - 800px);
			.el-tag {
				background: #d3f2e5;
				color: #505050;
				height: 30px;
				border-radius: 15px;
				line-height: 30px;
				text-align: center;
				margin: 5px;
			}
			.addToMyWrap {
				position: relative;
				margin-top: 100px;
				margin-left: 50px;
				p {
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
				.hotLevelWrap {
					cursor: pointer;
					float: right;
					margin-right: 80px;
					margin-top: 8px;
					* {
						vertical-align: bottom;
					}
				}
			}
			.myTestOperation {
				font-size: 0;
				position: relative;
				margin-top: 100px;
				margin-left: 10px;
				span {
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
				.edit {
					cursor: pointer;
					background: transparent;
					border: 1px solid #5c5c5c;
				}
				.noEdit {
					background: transparent;
					border: 1px solid #C2CCD1;
					color: #C2CCD1;
					cursor: not-allowed;
				}
				.add {
					cursor: pointer;
					background: #1fd094;
					color: #FFFFFF;
				}
				.delete {
					cursor: pointer;
					background: #FF6666;
					color: #FFFFFF;
				}
			}
			.myTestOperation.questionPageType {
				margin: 0;
				/*background: #CCCCCC;*/
				span {
					display: initial;
				}
				.questionInfo {
					font-size: 0;
					margin-bottom: 20px;
					.infoTitle {
						font-size: 14px;
						display: inline-block;
						width: 100px;
						height: 20px;
						margin: 0;
						background: #FFFFFF;
						border-radius: 0;
						line-height: 20px;
					}
					.difficult {
						vertical-align: middle;
					}
					.el-rate__item {
						margin: 0;
					}
					.el-rate {
						display: inline-block;
						font-size: 0;
						vertical-align: baseline;
					}
				}
				.pointsWrap {
					margin-bottom: 20px;
					&>p {
						width: 100px;
						text-align: center;
						font-size: 14px;
					}
				}
				.actionWrap {
					i,
					span {
						cursor: pointer;
						text-align: center;
						height: 40px;
						line-height: 40px;
						display: inline-block;
						width: 60px;
						font-size: 14px;
						margin: 0 10px;
					}
					&>span {
						display: none;
					}
					.addToCustomPaper {
						border: 1px #13CE66 solid;
						color: #13CE66;
						border-radius: 4px;
					}
					.deleteFromCustomPaper {
						border: 1px orangered solid;
						border-radius: 4px;
						color: orangered;
					}
					.el-button {
						padding: 0;
					}
				}
				.el-tag {
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
		/*复合题样式*/
		.fuheTitleWrap {
			.questionTitleArea {
				display: inline-block;
				width: 650px;
				/*display: inline-block;*/
				word-wrap:break-word;
				word-break:break-all;
				margin-bottom: 20px;
				img {
					max-width: 50%;
				}
			}
			.fuheQuestionInfo {
				display: inline-block;
				font-size: 0;
				vertical-align: top;
				margin-bottom: 20px;
				margin-left: 110px;
				.infoTitle {
					font-size: 14px;
					display: inline-block;
					width: 100px;
					height: 20px;
					margin: 0;
					background: #FFFFFF;
					border-radius: 0;
					line-height: 20px;
				}
				.difficult {
					vertical-align: middle;
				}
				.el-rate__item {
					margin: 0;
				}
				.el-rate {
					display: inline-block;
					font-size: 0;
					vertical-align: baseline;
					span.el-rate__item {}
				}
				.addToCustomPaper,
				.deleteFromCustomPaper {
					display: block;
					width: 60px;
					height: 40px;
					margin-left: 40px;
					margin-top: 20px;
				}
				.addToCustomPaper {
					border: 1px #13CE66 solid;
					color: #13CE66;
					border-radius: 4px;
				}
				.deleteFromCustomPaper {
					border: 1px orangered solid;
					border-radius: 4px;
					color: orangered;
				}
				i,
				span {
					cursor: pointer;
					text-align: center;
					height: 40px;
					line-height: 40px;
					display: inline-block;
					/*width: 60px;*/
					font-size: 14px;
					margin: 0 6px 0 0;
					font-size: 18px;
				}
			}
		}
		.fuheInfo {
			width: 100px;
			background: #eeeeee;
			text-align: center;
		}
	}
	.el-popover{
		p{
			word-wrap: break-word;
			word-break: break-all;
		}
	}
</style>
