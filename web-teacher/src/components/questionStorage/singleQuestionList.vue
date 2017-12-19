<template>
  <div class="singleQuestionList">
    <!--同步辅导，选择学科下拉列表el-select-->
    <section class="header" v-if="true">
    		
      <div class="title">
	    		<img src="../../../static/img/leftArrow.png" class="backBtn" @click="backToPrev"/>
        <span>题库 ＞&nbsp;
        </span>
        <span class="storageName">{{data.storageInfo.questionBookName}}</span>
          <button @click="addQuestion">添加测题</button>
      </div>
    </section>
		<!---->
		<div class="singleStorageInfo">
			<span class="storageName">{{data.storageInfo.questionBookName}}</span>
			<span class="alterButton" @click="editStorage">修改</span>
			<img src="../../../static/img/desc.png" alt="" />
			<span class="storageDesc">{{data.storageInfo.description}}</span>
		</div>
		<!--我的题库列表-->
    <section class="questionContent" style="display: block;">
    		
      <div v-if="data.storageQuestionList.length">
        <eduQuestionItem 
					v-for="(item, index) in data.storageQuestionList" 
					:key="index"
    				:questionItem="item"
    				:type="'personType'"
    				@popupSelect="handlePopupSelect"
          @deleteAction="handleDeleteQuestion"
          @editQuestion="handleEditQuestion"
				></eduQuestionItem>
      </div>
      <div v-else class="nodata">
        <img src="../../../static/img/questionListDefaultBG.png"/>
      </div>
    </section>
    <!--添加到我的题库弹出对话框-->
    <addQuestionPopup
    		:popupQues="data.addToQuestionPopup"
    		:selectOptions="data.questionStorageList"
    		@popupQuesAction="handlePopupQuesAction"
    	></addQuestionPopup>
    	<!--新建题库弹出对话框-->
    <addStoragePopup 
    		:popup="data.dialogFormVisible"
    		@popupAction="handleAddAction"
    		:action="'add'"
    		:itemInfo="data.storageInfo"
    	></addStoragePopup>
    <!--分页-->
    <!--<template>
      <div class="block" style="display: block;">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page=data.pageNum
          :page-sizes="[100, 200, 500, 1000]"
          :page-size=data.pageSize
          layout="total, sizes, prev, pager, next, jumper"
          :total=data.storageQuestionData.total>
        </el-pagination>
      </div>
    </template>-->
  </div>
</template>
<script>
  import eduQuestionItem from "./questionComponent/eduQuestionItem.vue"
	import addQuestionPopup from "./questionComponent/addQuestionPopup.vue"
  import addStoragePopup from "./questionComponent/addStoragePopup.vue"
	
  export default {
    components: {
      eduQuestionItem,addQuestionPopup,addStoragePopup
    },
    data() {
      return {
      		data:{
      			localData:null,
      			personalPageNum:1,
      			personalPageSize:100,
      			
      			storageInfo:{
      				questionBookName:"",
      				description:""
      			},
      			storageQuestionList:[],
      			storageQuestionData: {total: 0},//个人仓库总页数
      			dialogFormVisible:false,
      			questionStorageList:[],
      			addToQuestionPopup:false
      		},
      		searchText:"",
      		addToQuestionTemp:{}
      }
    },
    mounted() {
    		this.data.localData = this.localData.get("webTeacherUser");
//  		console.log(JSON.parse(localStorage.getItem("storageItem")));
    		this.data.storageInfo = JSON.parse(localStorage.getItem("storageItem"));
//  		console.log(this.data.storageInfo,"题库信息");
    		//获取个人题库中的试题列表
    		this.getQuestionList();
    		//获取题库列表,用于复制
    		this.getQuestionStorageList();
    },
    methods: {
	    	getQuestionStorageList() {
	      		//获得我的题库列表数据
	      		let sendData = {
	      			teacherCode : this.data.localData.userId,
						pageNum:this.data.personalPageNum,
						pageSize:this.data.personalPageSize,
						questionBookName:this.searchText=="" ? null : this.searchText
	      		};
//	    		console.log(sendData);
	      		this.$ajax.getQuestiontest(sendData).then(({httpCode, result})=>{
//	    			console.log(httpCode,"httpCode");
//	    			console.log(result,"result");
	      			if (httpCode == 200) {
	      					this.data.questionStorageList = result.rows;
	            } else {
	              this.$message('获取个人题库失败,请刷新页面重试');
	            }
	      		})
	      },
    		getQuestionList(){
//  			console.log(this.data.storageInfo);
    			let sendData = {
      			questionBookCode : this.data.storageInfo.questionBookCode
				};
//				console.log(sendData,"知识点");
				let _this = this;
      		this.$ajax.getQuestionlist(sendData).then(({httpCode, result})=>{
//    			console.log(httpCode,"httpCode");
//    			console.log(result,"result");
      			if (httpCode == 200) {
              //处理返回的数据
              _this.data.storageQuestionList = result.rows;
            } else {
              this.$message('获取题库知识点失败,请刷新页面重试');
            }
      		});
    		},
    		handleDeleteQuestion(item){
//  			console.log("个人题库问题删除",item);
    			this.$confirm('确定要删除此题库吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          //确认删除,进行删除操作
          let sendData = {
          		baseCode: item.baseCode,
          		questionBookCode: item.questionBookCode
          }
//        console.log(sendData);
          
          this.$ajax.baseQuestionDelete(sendData).then(({httpCode, result})=>{
//	      			console.log(httpCode,"httpCode");
//	      			console.log(result,"result");
	      			if (httpCode == 200) {
	      				if(result==true){
	      					this.$message('删除问题操作成功');
	      					//刷新列表
	      					this.getQuestionList();
	      				}
	            } else {
	              this.$message('删除题库失败,请稍后重试');
	            }
	      		})
        }).catch(() => {
          //取消删除,什么都不做
          console.log("用户取消了删除");
        });
    		},
    		handleEditQuestion(item){
//  			console.log(item);
    			//存储题目(题目中包含题库的信息)
				localStorage.setItem("editQuestion","true");
				localStorage.setItem("questionInfo",JSON.stringify(item));
    			//页面跳转
    			this.$router.push({path: '/questionStorage/singleQuestionEdit'});
    		},
    		handlePopupSelect(item){
//  			console.log("个人问题复制",item);
    			//缓冲数据
    			this.addToQuestionTemp = item;
    			//弹出对话框
    			this.data.addToQuestionPopup = true;
    		},
    		backToPrev(){
//  			console.log("返回上一层");
    			history.go(-1);
    		},
    		editStorage(){
    			//修改界面弹窗
//  			console.log("修改窗口");
    			this.data.dialogFormVisible = true;
    		},
    		handleAddAction(data){
    			//判断点击的是确定还是取消
    			
//    		console.log("子组件触发了");
//    		console.log(data);
				//进行数据检查
				if(data == 'canceled'){
					this.data.dialogFormVisible = false;
				}else if(data.title.trim() == ""){
					this.$message("题库名称不能为空或全是空格");
				}else{
					//有数据,进行数据请求,进行数据的添加
					//判断是否修改title
					let titleTemp = data.title;
					if(data.title == this.data.storageInfo.questionBookName){
						titleTemp = null;
					}
					let sendData = {
	      			questionBookCode:this.data.storageInfo.questionBookCode,
	      			questionBookName:titleTemp,
	      			teacherCode:this.data.storageInfo.teacherCode,
	      			description:data.desc
					};
//					console.log(sendData);
					let _this = this;
	      		this.$ajax.questionBankUpdate(sendData).then(({httpCode, result})=>{
//	      			console.log(httpCode,"httpCode");
//	      			console.log(result,"result");
	      			if (httpCode == 200) {
	      				if(result==true){
	      					//隐藏对话框
	      					_this.data.dialogFormVisible = false;
	      					//修改页面信息值
	      					_this.data.storageInfo.questionBookName = data.title;
	      					_this.data.storageInfo.description = data.desc;
	      				}
	            }else if(httpCode == 40007){
	            		this.$message('已经存在题库名称');
	            } else {
	              this.$message('修改题库失败,请稍后重试');
	            }
	      		})
				}
      
    		},
    		addQuestion(){
    			//最右上角添加例题
//  			console.log("添加例题");
    			//其他数据处理
    			//存储当前信息
    			localStorage.setItem("storageItem",JSON.stringify(this.data.storageInfo))
    			localStorage.setItem("editQuestion","false");
//  			console.log(this.data.storageInfo);
    			this.$router.push({path: '/questionStorage/singleQuestionEdit'});
    		},
    		handlePopupQuesAction(data){
//    		console.log(this.addToQuestionTemp,"edu")
//    		console.log(data,"option");
      		if(data == 'canceled'){
					this.data.addToQuestionPopup = false;
				}else if(!data){
					this.$message("请选择要添加到的题库");
				}else{
					//有选择项,进行数据请求,进行数据的添加
					//根据学科名称,找到学科code
//					console.log(subjectCodeObj);
					let sendData = {
						"baseName": this.addToQuestionTemp.baseName,
				    "resourceCode": this.addToQuestionTemp.resourceCode,
				    "source": this.addToQuestionTemp.source,
				    "coverUrl": this.addToQuestionTemp.coverUrl,
				    "rightAnswer": this.addToQuestionTemp.rightAnswer,
				    "questionType": this.addToQuestionTemp.questionType,
				    "knowledges": this.addToQuestionTemp.knowledges,
				    "subjectCode": this.addToQuestionTemp.subjectCode,
				    "questionScore": this.addToQuestionTemp.score,
				    "questionStem": this.addToQuestionTemp.questionStem,
				    "questionOption": this.addToQuestionTemp.questionOption,
				    "questionAnalyze":this.addToQuestionTemp.questionAnalyze,
				    "questionBookName": data.questionBookName,
				    "questionBookCode": data.questionBookCode
					};
//					console.log(sendData);
					let _this = this;
	      		this.$ajax.baseQuestionSave(sendData).then(({httpCode, result})=>{
//	      			console.log(httpCode,"httpCode");
//	      			console.log(result,"result");
	      			if (httpCode == 200) {
	      				if(result==true){
	      					//隐藏对话框
	      					_this.data.addToQuestionPopup = false;
	      					//刷新列表
//	      					_this.getQuestionStorageList();
	      				}
	            }else if(httpCode == 40007){
	            		this.$message('题库中已经存在当前题目');
	            } else {
	              this.$message('添加到题库失败,请稍后重试');
	            }
	      		})
				}
      }
    },
    computed: {},
    filters: {}

  }
</script>
<style lang="scss">
  @import '../../../static/css/contentRight';

  .singleQuestionList {
    .header {
      margin: 20px;
      margin-bottom: 0px;
      min-width:1450px;
      .title {
      	
        overflow: hidden;
        margin-top: 20px;
        /*margin-left:18px;*/
        box-sizing: border-box;
        padding: 10px 40px;
        background: white;
        border-bottom: 1px solid #e1e5ec;
        .backBtn{
        		cursor:pointer;
        		float: left;
        		margin-right: 20px;
        		padding-top: 10px;
        }
        .storageName{
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
        button {
          float: right;
          width: 143px;
          height: 40px;
          border-radius: 20px;
          font-size: 18px;
          color: #fff;
          background: #1fd094;
          outline: none;
          cursor: pointer;
        }
      }
    }
    .singleStorageInfo{
    		margin: 20px;
    		margin-bottom: 0px;
    		height: 70px;
    		background: #FFFFFF;
    		border-bottom: 1px solid #e1e5ec;
    		min-width: 1450px;
    		text-align: left;
    		font-size: 0;
    		line-height: 70px;
    		padding-left: 40px;
    		*{
    			vertical-align: middle;
    		}
    		.storageName{
    			font-size: 18px;
    			margin-right: 15px;
    		}
    		.alterButton{
    			cursor: pointer;
    			font-size: 18px;
    			color: #1fd094;
    			padding: 0 100px 0 15px;
    			border-left: 1px solid #e1e5ec;
    		}
    		.storageDesc{
    			padding-left: 10px;
    			font-size: 14px;
    			color: #828282;
    			text-overflow: ellipsis;
    			overflow: hidden;
    			max-width: 30%;
    			white-space: nowrap;
    			display: inline-block;
    		}
    }
    .questionContent {
    		text-align: left;
    	  min-width: 1450px;
    		background: #FFFFFF;
			margin: 20px;
			padding-left: 40px;
    		margin-top: 0px;
    		box-sizing: border-box;
      overflow: hidden;
      .nodata {
      		position: relative;
        height: 600px;
        line-height: 100px;
        font-size: 20px;
        /*background: #fff;*/
        margin: 20px;
        img{
        		position: absolute;
        		left: 0;
        		right: 0;
        		top: 0;
        		bottom: 0;
        		margin: auto;
        }
      }
    }
    
    .el-pagination {
      margin-top: 30px;
      margin-bottom: 30px;
      * {
        display: inline-block;
        vertical-align: middle;
      }
      .el-pager li {
        font-size: 20px;
        min-width: 40px;
        height: 40px;
        line-height: 40px;
      }
      .el-pager li.active {
        background: #1fd094;
      }
      .btn-next, .btn-prev {
        height: 40px;
      }
      .el-select .el-input {
        width: 142px;
      }
      .el-select .el-input input {
        height: 40px;
        font-size: 20px;
      }
      .el-select {
        vertical-align: top;
      }
      button, span {
        height: 40px;
        line-height: 40px;
        font-size: 20px;
      }
      .el-pagination__editor {
        height: 40px;
        min-width: 40px;
        font-size: 20px;
        vertical-align: top;
      }
    }
  }
  .el-select-dropdown{
		.el-select-dropdown__item.hover{
			background-color: #d3f2e5;
		}
		.el-select-dropdown__item.selected{
			background-color: #1fd094;
		}
	}

</style>
