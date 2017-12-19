<template>
  <div class="createNewPaper">
    <!--同步辅导，选择学科下拉列表el-select-->
    <section class="header" v-if="true">
      <div class="title">
      		<img src="../../../static/img/leftArrow.png" class="backBtn" @click="backToPrev"/>
        <span>试卷管理 ＞&nbsp;</span>
				<span class="newPageTitle">{{paperTitle}}</span>
      </div>
      <div class="listType">
      	<button v-bind:class="storageSelectClass('personal')" @click.prev.stop="changeStorage('personal')" style="display: none;">我的组卷题库</button>
      	<button v-bind:class="storageSelectClass('edu')" @click.prev.stop="changeStorage('edu')">易教资源库</button>
      	<!--<el-input
			  placeholder="搜索题库"
			  icon="search"
			  v-model="searchText"
			  :on-icon-click="handleIconClick"
			  @keyup.enter.native="handleIconClick">
			</el-input>-->

      </div>
    </section>
    <!--我的题库列表-->

    <!--易教题库列表-->
    <section class="eduQuestionContent">
    		<div class="selectConditions">
    				<div class="conditionItem">
    					<span>教学版本筛选:</span>
    					<!--<el-select v-model="value" placeholder="请选择">
					    <el-option
					      v-for="item in options"
					      :key="item.value"
					      :label="item.label"
					      :value="item.value">
					    </el-option>
					  </el-select>-->
					  <el-input
						  placeholder="教学版本"
						  v-model="materialVersion.name"
						  :disabled="true">
						</el-input>
    				</div>
    				<div class="conditionItem">
    					<span>学科:</span>
    					<!--<el-select v-model="value" placeholder="请选择">
					    <el-option
					      v-for="item in options"
					      :key="item.value"
					      :label="item.label"
					      :value="item.value">
					    </el-option>
					  </el-select>-->
					  <el-input
						  placeholder="学科"
						  v-model="userSubject.name"
						  :disabled="true">
						</el-input>
    				</div>
    				<div class="conditionItem">
    					<span>年级:</span>
    					<!--<el-select v-model="value" placeholder="请选择">
					    <el-option
					      v-for="item in options"
					      :key="item.value"
					      :label="item.label"
					      :value="item.value">
					    </el-option>
					  </el-select>-->
					  <el-input
						  placeholder="年级"
						  v-model="userGradeIden.name"
						  :disabled="true">
						</el-input>
    				</div>
    				<div class="conditionItem">
    					<span>难度:</span>
    					<el-select v-model="difficultStarValue" placeholder="请选择" @change="difficultStarChange">
					    <el-option
					      v-for="starItem in difficultStars"
					      :key="starItem.difficultStar"
					      :label="starItem.value"
					      :value="starItem.difficultStar">
					    </el-option>
					  </el-select>
    				</div>
    				<div class="conditionItem">
    					<span>题型:</span>
    					<el-select v-model="questionTypeValue" placeholder="请选择" @change="questionTypeChange">
					    <el-option
					      v-for="item in questionTypes"
					      :key="item.id"
					      :label="item.enlargeType"
					      :value="item.id"
					      :disabled="item.disabled">
					    </el-option>
					  </el-select>
    				</div>
    			</div>
    		<!--易教资源库知识点-->
    		<section class="eduLeftContent" v-show="storageSelect == 'edu'">
    			<div class="selectPoint">
    				<span></span>选择知识点
    			</div>
    			<el-tree :data="questionTree" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
    		</section>
    		<!--个人卷子列表-->
    		<section class="eduLeftContent" v-show="storageSelect == 'personal'">
    			<ul class="personalQuestions">
    				<li v-for="item in personalQuestions"
    					:key="item.code"
    					v-bind:class="personalQuestionsClass(item)"
    					@click="personalQuestionChange(item)"
    					>
    					{{item.name}}
    				</li>
    			</ul>
    		</section>
    		<section class="eduRightContent">

    			<div class="eduQuestionList">
    				<eduQuestionItem
    					v-for="(item, index) in data.eduStorageList"
    					:key="index"
    					:questionItem="item"
    					:type="'questionPageType'"
    					:materialVersion="materialVersion"
    					:questionTypes="questionTypes"
    					@popupSelect="handlePopupSelect"
    					@localNum="localNumChange"
    					></eduQuestionItem>
    			</div>
    			<!--edu分页-->
    <template>
        <el-pagination
          @size-change="handleEduSizeChange"
          @current-change="handleEduCurrentChange"
          :current-page.sync=data.eduPageNum
          :page-size=data.eduPageSize
          layout="total, prev, pager, next, jumper"
          :total=data.eduPages
          v-show="data.eduStorageList.length"
          >
        </el-pagination>
    </template>
    		</section>

    </section>
    <!--新建题库弹出对话框-->
    <addStoragePopup
    		:popup="dialogFormVisible"
    		@popupAction="handleAddAction"
    		:action="'add'"
    		:itemInfo="{}"
    	></addStoragePopup>

    <!--添加到我的题库弹出对话框-->
    <addQuestionPopup
    		:popupQues="addToQuestionPopup"
    		:selectOptions="data.questionStorageList"
    		@popupQuesAction="handlePopupQuesAction"
    	></addQuestionPopup>
    	<!--本地题库的按钮悬浮-->
    	<div v-bind:class="questionCartdata" @click="jumpQuestionsAdded">
  			<el-badge :value="badgeValue" class="item">
			  <i class="badgeContent"></i>
			</el-badge>
    	</div>

  </div>
</template>
<script>
//import questionItem from "./questionComponent/questionItem.vue"
  import eduQuestionItem from "./questionComponent/eduQuestionItem.vue"
  import addQuestionPopup from "./questionComponent/addQuestionPopup.vue"
  import addStoragePopup from "./questionComponent/addStoragePopup.vue"
//import canvasGround from '../common/canvasGround.vue';

  export default {
    components: {
      eduQuestionItem,addQuestionPopup,addStoragePopup
    },
    data() {
      return {
        data: {
          localData: null,//从localstorage得到的数据
          personalPageNum: 1,//当前页数
          personalPageSize: 10,//每页显示数量
          questionStorageList: [],//个人仓库列表
          personalPages: {total: 0},//个人仓库总页数
          eduPageNum: 1,//当前页数
          eduPageSize: 10,//每页显示数量
          eduStorageList: [],//易教仓库列表
          eduPages: 0,//易教仓库总页数
        },
        paperTitle:"",
        storageSelect:"edu", //选择的题库标签
        searchText: "", //搜索关键字
        userSubject: {}, //学科
        userGradeIden: {}, //年级
        materialVersion: {}, //教材版本
        difficultStars:[
        		{value:"简单",difficultStar:1},{value:"普通",difficultStar:2},{value:"困难",difficultStar:3},{value:"全部",difficultStar:4}
        ], //难度等级
        questionTypes:[{
        		enlargeType : "全部",
					id: 0,
					isdel:"0",
					logicType: "all",
					questionTypeCode: "all",
					subjectCode: "all"
        }],//题型
        difficultStarValue:4,//难度等级
        personalQuestions:[
        		{name:"第一个名称",code:"abcdefg1",active:false},{name:"第二个名称",code:"abcdefg2",active:false},{name:"第二个名称",code:"abcdefg3",active:false}
        ],
        questionTypeValue: 0,
        knowledgeCode:"",
        badgeValue:0,
        localQuestionIndex:[],//本地试题code
        windowLocalStorage: {
          reportData: null,
          testDetail: null,
          getTeacherInfo: null,
          webUser: null,
        },
        dialogFormVisible: false,
        addToQuestionPopup:false,
        addToQuestionTemp:{},
        questionTree:[],
        defaultProps: {
          children: 'children', //试题树的默认值
          label: 'knowledgeName'
        },
        editStoredPaper:false,//是否是进行修改试卷
      		questionCartdata: "questionCart"
        /*下面都是临时数据*/

      }
    },
    mounted() {

    		console.log(this.$route.query,"12312313123");
    		if(this.$route.query.code){
    			localStorage.setItem("questionAdded","");
          localStorage.setItem("updatePaperData","");
    			//获取当前试卷的类型
    			console.log(this.$route.query.code);
    			//进行已经存储数据的获取
    			this.getStoredPaper(this.$route.query.code);
    			this.editStoredPaper = true;
    		}else{
    			console.log("没有code");
    			this.paperTitle = "新建试卷";
				//清空本地数据
//				localStorage.setItem("questionAdded","");
//          localStorage.setItem("updatePaperData","");
    			//本地试题数量
				this.localNumChange();
    		}
      window.localStorage.page = "createNewPaper";
      this.data.localData = this.localData.get("webTeacherUser");

//      this.windowLocalStorage.reportData=this.localData.get("reportData");
//      this.windowLocalStorage.testDetail=this.localData.get("testDetail");
      		this.windowLocalStorage.getTeacherInfo = this.localData.get("getTeacherInfo");
//      this.windowLocalStorage.webUser=this.localData.get("webTeacherUser");
			//获取我的题库
//			this.getQuestionStorageList();
			//获取易教题库数据(先获取教材版本,然后获取树状列表)
			this.getMaterialVersion();
			//获得试题分类
			this.getQuestionType();

    },
    methods: {
      fn(item) {
        console.log(item)
      },
      subjectSeleted(index) {
        this.getTestPaper(this.data.subjectList[this.flag.subjectSeleted]);
      },
      storageSelectClass(storageName){
      		if(this.storageSelect == storageName){
      			return "active";
      		}else{
      			return ""
      		}
      },
      backToPrev(){
      		console.log("返回上一层,这里处理返回题库列表");
      		history.go(-1);
      },
      personalQuestionsClass(item){
      		//个人列表类名控制
      		if(item.active){
      			return "active";

      		}
      		return "";
      },
      getStoredPaper(code){
      		//获取试卷信息
//    		var code = "c1128cf767284d86b399fd725bd099ca";
      		let _this = this;
      		this.$ajax.showPaper(code).then(({httpCode, result})=>{
//    			console.log(httpCode,"httpCode");
//    			console.log(result,"单个试卷的试题信息");
      			if (httpCode == 200) {
      				if(result){
      					localStorage.setItem("updatePaperData",JSON.stringify(result));
      					_this.paperTitle = result.paperName;
      					//进行试卷信息解析,并存储到本地
      					_this.addToLocalTemp(result.paperSystemQusetionType)
      				}else{}
          } else {
            this.$message('获取试卷信息失败,请稍后再试');
          }
      		})
      },
      addToLocalTemp(pageData) {
      		console.log(pageData,"大类型数组");
      		let pageDataLocal = [];
      		for (var i = 0; i < pageData.length; i++) {
      			var singleTypeCollect = {
      				"itemType":"",
      				"itemContent":"",
      				"diagnosisSmallQuestionDtosList":[]
      			};
      			singleTypeCollect.itemType = pageData[i].type;
      			singleTypeCollect.itemContent = pageData[i]["typeList"][0].itemContent;
      			console.log(pageData[i]["typeList"][0],"大的对象")

      			//处理每一道题
      			var questionItems = pageData[i]["typeList"][0].list;
      			//获得logicType
      			var logicType = pageData[i]["typeList"][0].logicType;
      			console.log(questionItems.length);
      			for (var j = 0; j < questionItems.length; j++) {
      				var itemTemp = this.dealItemResult(questionItems[j],logicType)
      				console.log(itemTemp,"单题组合信息");
      				singleTypeCollect.diagnosisSmallQuestionDtosList.push(itemTemp);
      				console.log(singleTypeCollect);
      			}
      			pageDataLocal.push(singleTypeCollect);
      		}
      		console.log(pageDataLocal,"组合完成信息");
      		localStorage.setItem("questionAdded",JSON.stringify(pageDataLocal));
      		//更新数量
      		this.localNumChange();
      },
      dealItemResult(item,logicType){
				console.log(item,"单个题目信息");
				//0客观1主观
				let type = 0;
				if(item.type == 1 || item.type == 2) {
					type = 0;
				} else {
					type = 1;
				}
//				let logicType = "";
//				console.log(this.questionTypes, "题型");
//				this.questionTypes.map(function(questionType) {
//					if(questionType.id == item.enlargeId) {
//						logicType = questionType.logicType;
//					}
//				})

				let subtitle = "";
				console.log(item);
				console.log(item.questionType,"item.questionType");
				if(item.type == 6) {
					subtitle = item.componentQuestions;
				}

				return {
					"repositoryQuestionCode": item.repositoryQuestionCode,
					"questionAnswer": item.answer,
					"quesionOption": item.quesOption,
					"questionScore": item.score,
					"difficultStar": item.difficultStar,
					"questionType": item.type,
					"type": type,
					"stageCode": item.stageCode,
					"gradeCode": item.gradeCode,
					"subjectCode": this.localData.get("webTeacherUser").userSubject,
					"bookVersion": item.bookVersionName,
					"bookVersionCode": item.bookVersionCode,
					"questionCode": null, //待确定
					"questionStem": item.stem,
					"questionAnalyze": item.quesAnalyze,
					"questionKnowledge": item.tree,
					"questionProduction": item.basetree,
					"logicType": logicType,
					"subtitle": subtitle
				}

			},
      localNumChange(){
      		let _this = this;
      		_this.localQuestionIndex = [];
      		//本地题目数量变化
      		console.log("计算本地题目数量");
      		let localData = localStorage.getItem("questionAdded");
//				console.log(localData);
				if(localData && localData !=""){
					//本地存在数据,计算数量
					let numCount = 0;
					let localDataTemp = JSON.parse(localData);
					for (var i = 0; i < localDataTemp.length; i++) {
						numCount += localDataTemp[i].diagnosisSmallQuestionDtosList.length;

						localDataTemp[i].diagnosisSmallQuestionDtosList.map(function(item){
							_this.localQuestionIndex.push(item.repositoryQuestionCode);
						})
					}
					this.badgeValue = numCount;
				}else{
					//本地无数据
					this.badgeValue = 0;
				}
				//图标变化方法
				this.iconChange();
      },
      iconChange(){
      		this.questionCartdata = "questionCart active";
      		let _this = this;
      		setTimeout(function(){
      			_this.questionCartdata = "questionCart";
      		},300);
      },
      personalQuestionChange(question){
      		this.personalQuestions.map(function(item,index){
      			if(question.code == item.code){
      				item.active = true;
      			}else{
      				item.active = false;
      			}
      		})

      		//处理选择变更,进行数据请求变化


      },
      getQuestionType(){
      		//获取试题的分类
      		let _this = this;
      		let subjectCode = this.userSubject.code;
      		this.$ajax.getQuestionType(subjectCode).then(({httpCode, result})=>{
//      			console.log(httpCode,"httpCode");
//      			console.log(result,"result");
      			if (httpCode == 200) {
              //添加全部的选项
              result.push({
              		enlargeType : "全部",
								id: 0,
								isdel:"0",
								logicType: "all",
								questionTypeCode: "all",
								subjectCode: "all"
              })
							_this.questionTypes = result;

            } else {
              this.$message('获取试题类型失败,请刷新页面重试');
            }
      		})
      },
      getMaterialVersion(){
      		//获得易教数据,需要先获得1.教材版本2.学科3.年级
      		//1.获得学科,年级,学校的id来获得教材版本(同时修改搜索条件)
      		//1.1学科
      		this.userSubject = {
      			name:this.commonSubject[this.data.localData.userSubject],
      			code:this.data.localData.userSubject
      		};
      		//1.2年级
      		this.userGradeIden =	{
      			name:this.commonGrond[this.data.localData.userGradeIden],
      			code:this.data.localData.userGradeIden
      		};
      		//1.3学校id
      		let schoolID = this.data.localData.userSchoolId;
      		//2.根据以上信息,获取教学版本
      		let sendData = {
      			schoolId : schoolID,
      			gradeIden : this.userGradeIden.code,
      			subjectIden : this.userSubject.code
				};
				//console.log(sendData);
				let _this = this;
      		this.$ajax.getmanagerMaterial(sendData).then(({httpCode, result})=>{
      			//console.log(httpCode,"httpCode");
      			//console.log(result,"result");
      			if (httpCode == 200) {
              //处理数据,进行教材版本的显示以及存储
              let material =  result.filter(function(item){
              		return item.subjectName == _this.userSubject.name;
              });
              //取到符合条件的第一个值
              //console.log(material[0]);
             	_this.materialVersion = {name:material[0]["materialVersion"],code:material[0]["versionCode"]}
             	_this.getEduTreeList();
            } else {
              this.$message('获取教材版本失败,请刷新页面重试');
            }
      		})
      },
      getEduTreeList(){
      		//根据年级gradeCode,学科subjectCode,教材版本booktypeCode,获得树状数据
      		let sendData = {
      			booktypeCode : this.materialVersion.code,
      			gradeCode : this.userGradeIden.code,
      			subjectCode : this.userSubject.code
				};
//				console.log(sendData,"知识点");
				let _this = this;
      		this.$ajax.getResourceKnowledgeTree(sendData).then(({httpCode, result})=>{
//    			console.log(httpCode,"httpCode");
//    			console.log(result,"result");
      			if (httpCode == 200) {
              //处理返回的数据
              _this.dealTreeData(result);
            } else {
              this.$message('获取题库知识点失败,请刷新页面重试');
            }
      		});
      },
      dealTreeData(data){

//    		console.log(data);
      		//数据中不是知识点的就是目录
      		let map = {};
      		data.forEach(function(item){
      			map[item.ctbCode] = item;
      		})
//    		console.log(map);
      		//形成树状结构
      		let val = [];
      		data.forEach(function(item){
      			// 以当前遍历项的parentCode,去map对象中找到索引的ctbCode
            var parent = map[item.parentCode];
            if(parent){
            		(parent.children || (parent.children = [])).push(item);
            }else{
            		val.push(item);
            }
      		});
      		//存储树状结构
      		localStorage.setItem("KnowledgePointTree",JSON.stringify(val));
//    		console.log(val);
      		//将树状数据赋值给树状结构
      		this.questionTree = val;
      },
      getQuestionStorageList() {
      		//获得我的题库列表数据
      		let sendData = {
      			teacherCode : this.data.localData.userId,
					pageNum:this.data.personalPageNum,
					pageSize:this.data.personalPageSize,
					questionBookName:this.searchText=="" ? null : this.searchText
      		};
//    		console.log(sendData);
      		this.$ajax.getQuestiontest(sendData).then(({httpCode, result})=>{
//    			console.log(httpCode,"httpCode");
//    			console.log(result,"result");
      			if (httpCode == 200) {
              this.$set(this.data,'questionStorageList', result.rows);
              this.$set(this.data,'personalPages',result);
            } else {
              this.$message('获取个人题库失败,请刷新页面重试');
            }
      		})
      },
      getEduQuestionStorageList(){
      		//置空易教题库列表
      		this.data.eduStorageList = [];
      		let sendData = {
				    "gradeCode": this.userGradeIden.code,
				    "subjectCode": this.userSubject.code,
				    "knowledgeCode": this.knowledgeCode == "" ? null : this.knowledgeCode,
				    "pageNum": this.data.eduPageNum,
				    "pageSize": this.data.eduPageSize,
				    "booktypeCode": this.materialVersion.code,
				    "difficultStar": this.difficultStarValue == 4 ? null : this.difficultStarValue,
				    "stem":  this.searchText == "" ? null : this.searchText,
				    "type":  this.questionTypeValue == 0 ? null : this.questionTypeValue
				}
      		console.log(sendData);
      		this.$ajax.getResourceQuestions(sendData).then(({httpCode, result})=>{
      			console.log(httpCode,"httpCode");
      			console.log(result,"易教题库result");
      			if (httpCode == 200) {
      				if(result.rows){
      					//处理试题是不是本地缓存
      					this.isLocalTempQuestion(result.rows)
      					this.data.eduPages = parseInt(result.total)
      				}else{
      					//置空易教题库列表
      					this.data.eduStorageList = [];
      					this.$message('当前知识点没有相关题目');
      				}
          } else {
            this.$message('获取易教题库失败,请选择要考查的知识点或者刷新页面重试');
          }
      		})
      },
      isLocalTempQuestion(data){
      		let _this = this;
      		data.map(function(item){
      			if(_this.localQuestionIndex.indexOf(item.id)>-1){
      				item.isLocalTemp = true;
      			}else{
      				item.isLocalTemp = false;
      			}
      		})
      		_this.data.eduStorageList = data;
      },
      changeStorage(tagName){
      		if(tagName == "personal"){
      			//判断当前页面
      			if(this.storageSelect == "personal"){
      				return;
      			}
//    			console.log(1);
      			//切换显示隐藏
      			this.storageSelect = "personal";
      			this.getQuestionStorageList();
      		}else if(tagName == "edu"){
      			//判断当前页面
      			if(this.storageSelect == "edu"){
      				return;
      			}
      			//切换显示隐藏
      			this.storageSelect = "edu";
      			//判断是否进行立即搜索
      			if(this.knowledgeCode){
      				this.getEduQuestionStorageList();
      			}
      		}
      },
//    handleIconClick(){
//    		//搜索按钮进行点击操作
////    		console.log(this.searchText);
//    		//进行判断进行列表刷新
//    		if(this.storageSelect == "personal"){
////    			console.log(1);
//    			this.getQuestionStorageList();
//    		}else if(this.storageSelect == "edu"){
////    			console.log(2);
//    			this.getEduQuestionStorageList();
//    		}
//    },
      handleEduSizeChange(val) {
      		//改变每页的数量
//    		console.log(val)
      		//每页数量
        this.data.eduPageSize = val;
        //重置当前页数为1
        this.data.eduPageNum = 1;
        //获取易教仓库列表数据
        this.getEduQuestionStorageList();
      },
      handleEduCurrentChange(val) {
//    		console.log(val);
      		//当前页数
        this.data.eduPageNum = val;
        //获取易教仓库列表数据
        this.getEduQuestionStorageList();
      },
      handleNodeClick(data) {
//      console.log(data);
        //检查如果点击的是知识点,改变值,并且进行数据请求
        if(data.chk != "0"){
        		//改变值
        		this.knowledgeCode = data.ctbCode;
        		this.getEduQuestionStorageList();
        }
      },
      difficultStarChange(data){
//    		console.log(data);
      		//改变当前难度值
      		this.difficultStarValue = data;
      		//判断是否进行立即搜索
    			if(this.knowledgeCode){
    				this.getEduQuestionStorageList();
    			}
      },
      questionTypeChange(data){
//    		console.log(data);
      		//改变当前难度值
      		this.questionTypeValue = data;
      		//判断是否进行立即搜索
    			if(this.knowledgeCode){
    				this.getEduQuestionStorageList();
    			}
      },
      handleAddAction(data){
//    		console.log("子组件触发了");
				//进行数据检查
				if(data == 'canceled'){
					this.dialogFormVisible = false;
					return;
				}
      		if(data.title == undefined){
      			data.title = "";
      		}
      		if(data.desc == undefined){
      			data.desc = "";
      		}
				if(data.title.trim() == ""){
					this.$message("新建的题库名称不能为空或全是空格");
				}else{
					//有数据,进行数据请求,进行数据的添加

					let sendData = {
	      			description : data.desc.trim(),
	      			questionBookName : data.title.trim(),
	      			teacherCode : this.data.localData.userId,
	      			teacherName : this.data.localData.userName
					};
//					console.log(sendData);
					let _this = this;
	      		this.$ajax.questionBankSave(sendData).then(({httpCode, result})=>{
//	      			console.log(httpCode,"httpCode");
//	      			console.log(result,"result");
	      			if (httpCode == 200) {
	      				if(result==true){
	      					//隐藏对话框
	      					_this.dialogFormVisible = false;
	      					//刷新列表
	      					_this.getQuestionStorageList();
	      				}
	            }else if(httpCode == 40007){
	            		this.$message('已经存在题库名称');
	            } else {
	              this.$message('新建题库失败,请稍后重试');
	            }
	      		})
				}
      },
      handlePopupQuesAction(data){
//    		console.log(this.addToQuestionTemp,"edu")
//    		console.log(data,"option");
      		if(data == 'canceled'){
					this.addToQuestionPopup = false;
				}else if(!data){
					this.$message("请选择要添加到的题库");
				}else{
					//有选择项,进行数据请求,进行数据的添加
					//根据学科名称,找到学科code
					let subjectCodeObj = {};
//					console.log(this.commonSubject);
					for(var key in this.commonSubject){
						if(this.commonSubject[key] == this.addToQuestionTemp.subjectName){
							subjectCodeObj.subjectCode = key;
							subjectCodeObj.subjectName = this.addToQuestionTemp.subjectName
						}
					}
					//处理树状知识点
					let knowledgeTree=[];
					this.addToQuestionTemp.tree.forEach(function(item,index){
						knowledgeTree.push({
							id : item.id,
							name : item.name
						})
					});
					let sendData = {
						"baseName": this.addToQuestionTemp.stem,
				    "resourceCode": this.addToQuestionTemp.id,
				    "source": "1",
				    "coverUrl": null,
				    "rightAnswer": this.addToQuestionTemp.answer,
				    "questionType": Number(this.addToQuestionTemp.type),
				    "knowledges": JSON.stringify(knowledgeTree),
				    "subjectCode": subjectCodeObj.subjectCode,
				    "questionScore": this.addToQuestionTemp.score,
				    "questionStem": "",
				    "questionOption": this.addToQuestionTemp.quesOption,
				    "questionAnalyze":this.addToQuestionTemp.quesAnalyze,
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
	      					_this.addToQuestionPopup = false;
	      					//刷新列表
//	      					_this.getQuestionStorageList();
	      				}
	            }else if(httpCode == 40007){
	            		this.$message('本题已添加，不能重复添加');
	            } else {
	              this.$message('添加到题库失败,请稍后重试');
	            }
	      		})
				}
      },
      showAddStoragePopup(){
      		this.dialogFormVisible = true;
      },
      handleDeleteStorage(item){
//    		console.log("触发删除操作");
//    		console.log(item);
      		this.$confirm('确定要删除此题库吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          //确认删除,进行删除操作
          let sendData = {
          		questionBookCode: item.questionBookCode
          }
          this.$ajax.questionBankDelete(sendData).then(({httpCode, result})=>{
//	      			console.log(httpCode,"httpCode");
//	      			console.log(result,"result");
	      			if (httpCode == 200) {
	      				if(result==true){
	      					this.$message('删除题库操作成功');
	      					//刷新列表
	      					this.getQuestionStorageList();
	      				}
	            }else if(httpCode == 40006){
	            		this.$message('删除的题库中有题目');
	            } else {
	              this.$message('删除题库失败,请稍后重试');
	            }
	      		})
        }).catch(() => {
          //取消删除,什么都不做
//        console.log("用户取消了删除");
        });


      },
      handlePopupSelect(item){
//    		console.log(item,"父组件");
      		//弹出选择对话框
      		this.addToQuestionPopup = true;
      		//存储一下需要添加的试题
      		this.addToQuestionTemp = item;
      },
      jumpQuestionsAdded(){
//    		if(this.badgeValue < 1){
//    			this.$message("当前没有题目");
//    			return;
//    		}
//				let url = window.location.origin + window.location.pathname;
//				console.log(url);
				//获得当前的链接地址
      		//跳转到本地试题查看
      		if(!this.editStoredPaper){
      			this.$router.push({path: '/seeTheQuestionsAdded'});
//					window.open(url + "#/" + "seeTheQuestionsAdded");
      		}else{
      			this.$router.push({path: '/seeTheQuestionsAdded',
      				query:{
	            code:this.$route.query.code
	          }
      			});
//					window.open(url + "#/" + "seeTheQuestionsAdded?code=" + this.$route.query.code);
      		}
      }
    },
    computed: {
    },
    filters: {}

  }
</script>
<style lang="scss">
  @import '../../../static/css/contentRight';

  .createNewPaper {
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
        span {
          color: #000000;
          font-size: 18px;
          float: left;
          display: inline-block;
          height: 40px;
          line-height: 40px;
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
	      .newPageTitle{
	      		color: #1fd094;
	      }
	      .backBtn{
        		cursor:pointer;
        		float: left;
        		margin-right: 20px;
        		padding-top: 10px;
        }
      }
      .listType{
	      	background: white;
	      	/*height: 90px;*/
	      	min-width:1450px;
	      	min-height: 90px;
	      	overflow: hidden;
	      	padding-left: 20px;
	      	button{
	      	  margin-top: 25px;
	      	  margin-left: 20px;
	      	  float: left;
          width: 143px;
          height: 40px;
          border-radius: 20px;
          font-size: 18px;
          outline: none;
          cursor: pointer;
          background: transparent;
          &:hover{
          		background: #d3f2e5;
          }
	      	}
	      	button.active{
	      			background: #1fd094;
	      			color: #fff;
	      	}
	      	.sortCondition{
	      		margin-right: 40px;
	      		margin-top: 35px;
	      		float: right;
	      		.sortConItem{
	      			padding-right: 5px;
	      		}
	      		.sortConItem img{
	      			display: none;
	      		}
	      		.sortConItem.active{
	      			color: #1fd094;
	      		}
	      		.sortConItem.active img{
	      			display: initial;

	      		}
	      	}
	      	.el-input{
	      		margin-top: 27px;
	      		margin-right: 40px;
	      		float: right;
	      		width: 300px;
	      		height: 40px;

	      	}
	      }
    }
    /*.questionContent {
    		min-width: 1450px;
      overflow: hidden;
      .nodata {
      		position: relative;
        height: 600px;
        line-height: 100px;
        font-size: 20px;
        //background: #fff;//
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


    }*/
		.eduQuestionContent{
			min-width: 1120px;
			margin: 20px;
    		margin-bottom: 0px;
    		height: 100%;
    		box-sizing: border-box;
    		position: relative;

    		.selectConditions{
    				min-width: 1450px;
    				overflow: hidden;
    				background: #FFFFFF;
    				/*height: 70px;*/
    				border-bottom: 1px solid #e1e5ec;
    				.conditionItem{
    					margin-left: 40px;
    					margin-top: 15px;
    					margin-bottom: 10px;
    					float: left;
    					color: #505050;
    					.el-input{

    						width: 180px;
    						height: 40px;
    						.el-input__inner:focus,.el-input__inner:hover{
    							border-color: #1FD094;
    						}
    					}
    				}
    			}

    		.eduLeftContent{
    			position: absolute;
    			width: 312px;
    			height: 100%;
    			background: #FFFFFF;
    			left: 0;
    			top: 66px;
    			overflow-y:scroll;
    			.selectPoint{
    				font-size: 18px;
    				color: #505050;
    				text-align: left;
    				height: 70px;
    				line-height: 70px;
    				border-bottom: 1px solid #e5e5e5;
    				padding-left: 30px;
    				box-sizing: border-box;
    				span{
    					margin: 0 10px;
    					display: inline-block;
    					width: 10px;
    					height: 10px;
    					border-radius: 50%;
    					background: #1fd094;
    				}
    			}
    			/*个人文件夹*/
    			.personalQuestions{
    				padding-top: 20px;
    				li{
    					width: 80%;
    					margin: auto;
    					height: 40px;
    					line-height: 40px;
    					white-space: nowrap;
    					overflow: hidden;
    					text-overflow: ellipsis;
    					&.active{
    						color: #1FD094;
    					}
    				}
    			}
    			/*element-Tree*/
    			.el-tree{
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
    				.el-tree-node.is-current{
    					&>.el-tree-node__content{
    						background: #d3f2e5;
    					}
    				}
    			}
    		}
    		.eduRightContent{
    			background: #FFFFFF;
    			position: absolute;
    			width: calc(100% - 312px);
    			min-width: 1120px;
    			top: 66px;
    			left: 312px;
    			height: 100%;


    			.eduQuestionList{
    				background: #FFFFFF;
    				text-align: left;
    				padding: 0 40px;
    				box-sizing: border-box;
    				width: 100%;
    				height: calc(100% - 100px);
    				border-bottom: 1px solid #e1e5ec;
    				overflow-x: hidden;
    				overflow-y: scroll;
    			}
    		}

    		.el-pagination{
    			margin-top: 40px;
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
       .el-input {
        width: 142px;
      }
       .el-input input {
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
    .questionCart{
    		transition: transform 0.3s ease-in-out;
    		cursor: pointer;
    		width: 80px;
    		height: 80px;
    		border-radius: 50%;
    		/*box-shadow: 0 0 10px #1FD094;*/
    		bottom: 100px;
    		right: 100px;
    		position: fixed;
    		z-index: 1000;
    		background: url(../../../static/img/localcart.png) no-repeat center;
    		background-size: 80px;
    		.badgeContent{
    			display: block;
    			width: 30px;
    			height: 20px;
    		}
    }
    .questionCart.active{
    		transform: scale(1.2) ;
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
