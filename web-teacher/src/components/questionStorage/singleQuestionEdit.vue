<template>
  <div class="singleQuestionEdit">
    <!--同步辅导，选择学科下拉列表el-select-->
    <section class="header" v-if="true">

      <div class="title">
	    		<img src="../../../static/img/leftArrow.png" class="backBtn" @click="backToPrev"/>
        <span>题库 ＞&nbsp;</span>
        <span class="storageName">{{storageInfo.questionBookName}} ＞&nbsp;</span>
        <span class="addQuestion">添加测试题</span>
      </div>
    </section>
    <section class="addQuestionArea">
    		<div class="questionWrap">
    			<span>&nbsp;&nbsp;&nbsp;题干:</span>
    			<div class="questionTitle">
            <ueditor v-bind:value=defaultMsg v-bind:config=config v-on:ready="baseNameReady"></ueditor>
          </div>
    		</div>
    		<div class="questionWrap">
    			<span>&nbsp;&nbsp;&nbsp;答案:</span>
    			<div class="questionAnswer" >
            <i v-bind:class="activeClassFn(index)" v-for="(item,index) in questionOption" @click="changeOptionKey(index)"><i class="duigou"><img src="../../../static/img/xuanxiangduigou.png" alt=""></i> {{item.optionKey}}</i>
            <!--<i class="options">B</i>-->
            <!--<i class="options">C</i>-->
            <!--<i class="options">D</i>-->
            <i class="addOptions el-icon-plus" @click="addOptionKey"></i>
            <i class="rightOption el-icon-circle-check" @click="setRightAnswer">设为正确答案</i>
            <i class="deleteOption el-icon-delete" @click="deleteCurrentOption">删除当前选项</i>
            <ueditor class="ueditor"  v-bind:value=questions.questionOption v-bind:config=config v-on:ready="ready"></ueditor>
          </div>
    		</div>
    		<div class="questionKnowWrap">
    			<span class="pointTitle">知识点:</span>
    			<div class="questionKnowPoint">
    				<div class="pointWrap">
    					<el-tag
						  v-for="tag in tags"
						  :key="tag.id"
						  closable
						  :type="''"
						  @close="handleClose(tag)"
						  >
						  {{tag.name}}
						</el-tag>
    				</div>
    				<div class="treeWrap">
    					<el-tree :data="questionTree" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
    				</div>
    			</div>
    		</div>
      <div class="submitBtns">
      		<span @click="cancelEditQuestion">
      			取消
      		</span>
      		<span class="confirmBtn" @click="sumbitQuestion">
      			提交
      		</span>
      </div>
    </section>

  </div>
</template>
<script>
	import ueditor from '../common/editor.vue'
  export default {
    components: {
      ueditor
    },
    data() {
      return {
        config: {
          initialFrameWidth: 800,
          initialFrameHeight: 220
        },
        questionOption:[
          {'optionKey':'A','optionValue':'<p>选项A</p>','isTrue':false},
          {'optionKey':'B','optionValue':'<p>选项B</p>','isTrue':false},
          {'optionKey':'C','optionValue':'<p>选项C</p>','isTrue':false},
          {'optionKey':'D','optionValue':'<p>选项D</p>','isTrue':false},
        ],
        defaultMsg: {optionValue:"题干"},
        baseName:{},
        quesRightAnswer:"",
        questions:{
          questionOption:{},
        },
        storageInfo:{
	      		questionBookName:""
	      },
	      activeAnswer:0,
	      tags: [],
        questionTree:[],
      		defaultProps: {
          children: 'children', //试题树的默认值
          label: 'knowledgeName'
        },
        editQuestionItem:{}
      }


    },
    beforeMount(){

    },
    mounted() {
    		if((localStorage.getItem("editQuestion") && localStorage.getItem("editQuestion") == "true")){
    			//是修改题目
    			this.editQuestionItem = JSON.parse(localStorage.getItem("questionInfo"));
    			//修改名称
    			this.storageInfo = this.editQuestionItem;
//  			console.log(this.editQuestionItem,"要修改的选项");
    			//修改题目
    			this.defaultMsg.optionValue = this.strToUrl(this.editQuestionItem.baseName);
    			//修改答案
//  			console.log(JSON.parse(this.editQuestionItem.questionOption));
    			let _this = this;
    			let questionOptionTemp = [];
    			JSON.parse(this.editQuestionItem.questionOption).map(function(item,index){
    				if(item.optionKey == _this.editQuestionItem.rightAnswer){
    					questionOptionTemp.push({
	    					optionKey : item.optionKey,
	    					optionValue : _this.strToUrl(item.optionValue),
	    					isTrue : true
	    				})
    				}else{
    					questionOptionTemp.push({
	    					optionKey : item.optionKey,
	    					optionValue : _this.strToUrl(item.optionValue),
	    					isTrue : false
	    				})
    				}

    			});
    			console.log(questionOptionTemp);
    			this.questionOption = questionOptionTemp;
    			//修改正确答案
    			this.quesRightAnswer = this.editQuestionItem.rightAnswer;
    			//修改知识点
    			this.tags = JSON.parse(this.editQuestionItem.knowledges);
    		}
	    	if(localStorage.getItem("editQuestion") && localStorage.getItem("editQuestion") == "false"){

	    		this.storageInfo = JSON.parse(localStorage.getItem("storageItem"));
	    	}
	    	this.changeOptionKey(0);
	    	//显示知识点数
	    	if(localStorage.getItem("KnowledgePointTree") && localStorage.getItem("KnowledgePointTree") != ""){
	    		this.questionTree = JSON.parse(localStorage.getItem("KnowledgePointTree"));
	    	}else{
	    		this.$router.push({path: '/questionStorage/questionList'});
	    	}

    },
    methods: {
      // 监听答案editor
      ready (someData) {
//      console.log(someData,"editor_ready");
        this.questionOption.forEach((e)=>{
          if(e.optionKey == someData.uid){
            e.optionValue = someData.content
          }
        })
//      console.log(this.questionOption,"editor监听");
      },
      //监听题目editor
      baseNameReady(data){
      		this.baseName = data;
      },
      //更改选项
      changeOptionKey(v){
//    		console.log(v,"vvvvv");
        this.questions.questionOption = this.questionOption[v];
        //修改激活项
        this.activeAnswer = v;
      },
      //添加选项
      addOptionKey(){
        let length = this.questionOption.length
        if(length >3) return this.$message('最多只支持4个选项');
        this.questionOption.push({
          'optionKey':changeItem(length+1),'optionValue':'<p>选项'+changeItem(length+1)+"</p>",'isTrue':false
        })
        function changeItem(v){
          switch (v){
            case 1:return 'A';
            case 2:return 'B';
            case 3:return 'C';
            case 4:return 'D';
            case 5:return 'E';
            case 6:return 'F';
            case 7:return 'G';
            case 8:return 'H';
          }
        }
      },
      backToPrev(){
//  			console.log("返回上一层");
    			history.go(-1);
    		},
    		activeClassFn(index){
//  			console.log(index);
    			if(index == this.activeAnswer){
    				if(this.questionOption[index].isTrue){
    					return "options active rightAnswer";
    				}else{
    					return "options active";
    				}
    			}else{
    				if(this.questionOption[index].isTrue){
    					return "options rightAnswer";
    				}else{
    					return "options";
    				}
    			}

    		},
    		setRightAnswer(){
//  			console.log("设置正确答案vvvvvvv");
    			let _this = this;
    			this.questionOption.forEach(function(item,index){
//  				console.log(index,"第几个");
    				if(index == _this.activeAnswer){
//  					console.log(index);
    					_this.questionOption[index].isTrue = true;
    					_this.quesRightAnswer = answerItem(index+1);
//  					console.log(answerItem(index+1))
    				}else{
//  					console.log(0);
    					_this.questionOption[index].isTrue = false;
    				}
    			});
    			function answerItem(v){
          switch (v){
            case 1:return 'A';
            case 2:return 'B';
            case 3:return 'C';
            case 4:return 'D';
            case 5:return 'E';
            case 6:return 'F';
            case 7:return 'G';
            case 8:return 'H';
          }
        }
    		},
    		deleteCurrentOption(){
    			//弹出element对话框
    			this.$confirm('是否删除当前选项?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
       }).then(() => {
       		//确保最少存在一个选项
       		if(this.questionOption.length == 2){
       			this.$message("至少要有两个选项");
       			return;
       		}

       		//删除当前激活项
	//  			console.log(this.activeAnswer,this.questionOption.length);
	    			if(this.activeAnswer == this.questionOption.length - 1){
	    				//最后一项
	//  				console.log("最后一项")
	    				this.questionOption.pop();
	    				if(this.activeAnswer != 0){
	    					this.changeOptionKey(this.activeAnswer-1);
	    				}else{

	    				}

	    			}else if(this.activeAnswer<this.questionOption.length){
	    				//说明是中间的选项,清空这个选项
	    				this.questionOption[this.activeAnswer].optionValue = "请重新输入答案";
	    				//改变数组
	    				this.$set(this.questionOption,this.activeAnswer,this.questionOption[this.activeAnswer]);
						this.questions.questionOption = this.questionOption[this.activeAnswer];
						//模拟点击事件,进行刷新
						if(this.activeAnswer != 0){
							this.changeOptionKey(this.activeAnswer-1);
							let _this = this;
							setTimeout(function(){
								_this.changeOptionKey(_this.activeAnswer+1);
							},100);
						}else{
							this.changeOptionKey(this.activeAnswer+1);
							let _this = this;
							setTimeout(function(){
								_this.changeOptionKey(_this.activeAnswer-1);
							},100);
						}
	    			}
       }).catch(() => {
          //取消删除,什么都不做
//        console.log("用户取消了删除");
       });
    		},
    		handleNodeClick(data){
    			//检查如果点击的是知识点,改变值,并且进行数据请求
        if(data.chk != "0"){
        		//改变tags的值
//      		console.log(this.tags);
        		let dataTemp = {
        			id: data.ctbCode,
        			name: data.knowledgeName
        		}
        		let isDuplicate = false;
        		for (var i = 0; i < this.tags.length; i++) {
        			if(this.tags[i].id == dataTemp.id){
        				isDuplicate = true;
        			}
        		}
        		if(!isDuplicate){
        			let tempdata = {
        				id: data.ctbCode,
        				name:data.knowledgeName
        			}
        			this.tags.push(tempdata)
        		}
        }
    		},
    		handleClose(tag){
    			this.tags.splice(this.tags.indexOf(tag), 1);
    		},
    		sumbitQuestion(){
    			let _this = this;
    			if(this.quesRightAnswer == ""){
    				this.$message("请选择一个正确答案");
    				return;
    			}
    			//答案选项
//  			console.log(this.questionOption);
    			//处理答案选项
    			let questionOptions = [];
    			this.questionOption.map(function(item, index){

    				questionOptions.push({
    					optionKey: item.optionKey,
    					optionValue: _this.htmlToImgStr(item.optionValue)
    				})
    			});
    			//处理答案选项的个数
    			if(questionOptions.length < 2){
    				this.$message("请至少提供两个选项,供学生选择");
    				return;
    			}

//  			console.log("AAAAAAAA");
//  			console.log("题目",this.baseName);

//  			console.log("题目格式化",this.htmlToImgStr(this.baseName.content));

//  			return;
//  			console.log(questionOptions);
    			let sendData = {
						"baseName": this.htmlToImgStr(this.baseName.content),
				    "resourceCode": null,
				    "source": "0",
				    "coverUrl": null,
				    "rightAnswer": this.quesRightAnswer,
				    "questionType": 1,
				    "knowledges": JSON.stringify(this.tags),
				    "subjectCode": this.localData.get("webTeacherUser").userSubject,
				    "questionScore": null,
				    "questionStem": "",
				    "questionOption": JSON.stringify(questionOptions),
				    "questionAnalyze":null,
				    "questionBookName": this.storageInfo.questionBookName,
				    "questionBookCode": this.storageInfo.questionBookCode
					};
//					console.log(sendData,"发送的信息");

	      		if((localStorage.getItem("editQuestion") && localStorage.getItem("editQuestion") == "true")){
	      			sendData.baseCode = this.editQuestionItem.baseCode;
	      			//更新操作
	      			this.$ajax.baseQuestionUpdate(sendData).then(({httpCode, result})=>{
//		      			console.log(httpCode,"httpCode");
//		      			console.log(result,"result");
		      			if (httpCode == 200) {
		      				if(result==true){
		      					//跳转到上一个页面
		      					history.go(-1);
		      				}
		            } else {
		              this.$message('添加到题库失败,请稍后重试');
		            }
		      		})
	      		}else{
	      			//新建操作
	      			this.$ajax.baseQuestionSave(sendData).then(({httpCode, result})=>{
//		      			console.log(httpCode,"httpCode");
//		      			console.log(result,"result");
		      			if (httpCode == 200) {
		      				if(result==true){
		      					//跳转到上一个页面
		      					history.go(-1);
		      				}
		            } else {
		              this.$message('添加到题库失败,请稍后重试');
		            }
		      		})
	      		}
				},
				cancelEditQuestion(){
					history.go(-1);
				}

    },
    computed: {},
    filters: {
      changeItem(v){
        switch (v){
          case 1:return 'A';
          case 2:return 'B';
          case 3:return 'C';
          case 4:return 'D';
          case 5:return 'E';
          case 6:return 'F';
          case 7:return 'G';
          case 8:return 'H';
        }
      }
    }
  }
</script>
<style lang="scss">
  @import '../../../static/css/contentRight';

  .singleQuestionEdit {
  		.edui-editor-breadcrumb{
  			display:none;
  		}
    .header {
      margin: 20px;
      margin-bottom: 0px;
      .title {
        overflow: hidden;
        margin-top: 20px;
        /*margin-left:18px;*/
        box-sizing: border-box;
        padding: 10px 40px;
        background: white;
        border-bottom: 1px solid #e1e5ec;
        .backBtn{
        		cursor: pointer;
        		float: left;
        		margin-right: 20px;
        		padding-top: 10px;
        }
        .storageName{}
        .addQuestion{
        		color: #1fd094;
        }
        span {
          color: #000000;
          font-size: 18px;
          float: left;
          display: inline-block;
          height: 40px;
          line-height: 40px;
          vertical-align: middle;
          img{
          		height: 18px;
          		vertical-align: middle;
          }
        }

      }
    }
    .addQuestionArea{
    		background: #FFFFFF;
    		margin: 20px;
    		margin-bottom: 0px;
    		vertical-align: top;
    		.questionWrap{
    			width: 850px;
    			margin: auto;
          margin-bottom: 20px;
    			position: relative;
    			span{
    				position: absolute;
    				left: 0;
    				top: 0;
    			}
    		}
    		.questionTitle,.questionAnswer,.questionKnowPoint{
    			display: inline-block;
    			/*background: gray;*/
    			width: 800px;
    			margin-left: 80px;

    		}
    		.questionTitle{
    			height: 190px;
    			border: 1px solid #eeeeee;
    			background: #EEEEEE;
    			text-align: left;
    		}
    		.questionAnswer{
          height: 50px;
          background: #fff;
          text-align: left;
          .options {
            display: inline-block;
            width: 40px;
            line-height: 40px;
            text-align: center;
            position: relative;
            cursor: pointer;
            .duigou {
            	display: none;
              z-index: 999;
              position: absolute;
              top: 0px;
              right: 0px;
              width: 20px;
              height: 20px;
              line-height: 20px;
              background: #f0f4fb;
              border-radius: 0 0 0 30px;
              img {
                position: absolute;
                top: 4px;
                right: 3px;
              }
            }
          }
          .options.active{
          		border: 1px solid #1fd094;
          }
          .rightAnswer{
          		.duigou{
          			display: block;
          		}
          }
          checkOption{
            color: #fff;
            background: #1fd094;
          }
          .deleteOption {
            color: red;
            border: 1px solid red;
          }
          .rightOption, .deleteOption{
            float: right;
            height: 40px;
            line-height: 40px;
            padding: 0 5px;
            cursor: pointer;
          }
          .rightOption {
            color: #1fd094;
            margin-left: 10px;
            border: 1px solid #1fd094;
          }
          .addOptions {
            display: inline-block;
            width: 40px;
            line-height: 40px;
            text-align: center;
            color: #ccc;
            border: 1px dashed #ccc;
            cursor: pointer;
          }
          .ueditor{
            margin-top: 16px;
          }
    		}
    }

    .questionKnowWrap{
    		width: 850px;
    		margin: auto;
    		position: relative;
    		text-align: left;
    		.pointTitle{
    			position: absolute;
    			left: 0;
    			top: 0;
    		}
    		.pointWrap{
    			margin-bottom: 20px;
    			min-height: 35px;
    			/*background: transparent;*/
    			.el-tag{
    				background: transparent;
    				color: #000000;
    				border: 1px solid #1fd094;
    				margin-right: 10px;
    				margin-bottom: 10px;
    			}
    		}
    		.treeWrap{
    			height: 300px;
    			border: 1px solid #d1dbe5;
    			overflow-y: scroll;
    			.el-tree{
    				border: none;

    				text-align: left;
    				border: none;
    				padding-top: 20px;
    				padding-left: 25px;
    				.el-tree-node__expand-icon{
    					border: none;
    					display: inline-block;
    					background: url(../../../static/img/folder.png) no-repeat;
    					width: 20px;
    					height: 20px;
    				}
    				.el-tree-node__expand-icon.expanded{
    					transform: rotate(0);
    				}
    				.el-tree-node__expand-icon.is-leaf{
    					width: 10px;
    					height: 10px;
    					border-radius: 50%;
    					background: #1FD094;
    				}

    			}
    		}
    }
    .submitBtns{
    		padding: 60px 0;
    		span{
    			display: inline-block;
    			width: 140px;
    			height: 40px;
    			line-height: 40px;
    			text-align: center;
    			color: #FFFFFF;
    			background: #b3b3b3;
    			border-radius: 20px;
    			margin: 0 25px;
    			cursor: pointer;
    		}
    		.confirmBtn{
    			background: #1FD094;
    		}
    }
  }


</style>
