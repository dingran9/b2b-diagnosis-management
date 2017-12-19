<template>
  <div class="questionItem" :class="data.deleteOverClass">
  	<div @click="questionItemClick(listItem)" style="display: block;">
    <div class="head">
      <div class="oval" @click.prev.stop="deleteItem(listItem)" @mouseover.prev.stop="deleteMouseOver" @mouseleave="deleteMouseLeave">
      		<span class="titleRight">...</span>
      		<img src="../../../../static/img/questionDelete.png"/>
      </div>
    </div>
    <div class="body">
    		<p class="question_title">
    			{{listItem.questionBookName}}    			
    		</p>
    		<p class="question_desc">
				{{listItem.description}}
    		</p>
    </div>
    <div class="bottom">
      <span class="questionItemClass">{{data.classCode}}</span>
      <span class="questionCount">共
      	<i>{{listItem.questionCount}}</i>
      	题</span>
      <span class="questionData">
      		<i class="date" v-if="!(isYesterday(listItem.updateTime) || isToday(listItem.updateTime))">{{listItem.updateTime | dataFilter}}</i>
      		<i class="week">{{listItem.updateTime | weekFilter}}</i>
      		<i class="time">{{listItem.updateTime | timeFilter}}</i>
      	</span>
    </div>
    </div>
  </div>
</template>
<script>
  export default {
    props:["listItem","itemIndex"],
    components: {

    },
    data(){
      return {
        data: {
					classCode:"",
					deleteOverClass: ""
        }
      }
    },
    mounted(){
			this.getClassName();

    },
    methods: {
    		deleteMouseOver(){
    			this.data.deleteOverClass = "deleteOver";
    		},
    		deleteMouseLeave(){
    			this.data.deleteOverClass = "";
    		},
      questionItemClick(item){
      		//单个条目点击,跳转到列表页面
//    		console.log(item)
      		window.localStorage.storageItem = JSON.stringify(item);
      		this.$router.push({path: '/questionStorage/singleQuestionList'});
      },
    		getClassName(){
//  			console.log(this.data)
    			this.data.classCode = this.commonGrond[this.localData.get("webTeacherUser").userGradeIden];
    		},
      deleteItem(item){
//    		console.log(item,"删除操作");
        this.$emit('deleteAction',item);
      },
			isYesterday(theDate){
			    var date = (new Date());    //当前时间
			    var today = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime(); //今天凌晨
			    var yestday = new Date(today - 24*3600*1000).getTime();
			    return new Date(theDate).getTime() < today && yestday <= new Date(theDate).getTime();
			},
			isToday(theDate){
					var date = (new Date());    //当前时间
			    var today = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime(); //今天凌晨
			    return new Date(theDate).getTime() >= today; 
			}
    },
    computed: {},
    filters: {
    		dataFilter:function(date){
    			let dateTemp = new Date(date);
    			let month = dateTemp.getMonth() + 1;
    			let dateOfMonth = dateTemp.getDate();
    			if (month < 10) month = "0" + month;
        if (dateOfMonth < 10) dateOfMonth = "0" + dateOfMonth;
        return month + "-" + dateOfMonth;
    			
    		},
    		weekFilter:function(date){
    			function isYesterday(theDate){
					var date = (new Date());    //当前时间
			    var today = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime(); //今天凌晨
			    var yestday = new Date(today - 24*3600*1000).getTime();
			    return new Date(theDate).getTime() < today && yestday <= new Date(theDate).getTime();
				}
    			function isToday(theDate){
						var date = (new Date());    //当前时间
				    var today = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime(); //今天凌晨
				    return new Date(theDate).getTime() >= today; 
				}
    			let week;
    			if(isYesterday(date)){
    				//是昨天
    				week = "昨天";
    			}else if(isToday(date)){
    				//是今天
    				week = "今天";
    			}else{
    				let dateTemp = new Date(date);
	    			let day = dateTemp.getDay();
	    			var arr_week = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六");
	    			week = arr_week[day];
    			}
    			
    			//判断是昨天,今天
    			return week;
    		},
    		timeFilter:function(date){
    			let dateTemp = new Date(date);
    			let hour = dateTemp.getHours();
    			let minute = dateTemp.getMinutes();
    			if(hour<10){
    				hour = "0" + hour;
    			}
    			if(minute<10){
    				minute = "0" + minute;
    			}
    			return hour+":"+minute;
    		}
    }

  }
</script>
<style lang="scss" scoped>
  @import '../../../../static/css/contentRight';
  .deleteOver.questionItem{
  		box-shadow:0 0 15px #f5b6c4 !important;
  }
  .questionItem{
    width:360px;
    height:200px;
    background:#fff;
    margin-left:20px;
    margin-top:30px;
    margin-right:20px;
    margin-bottom: 20px;
    float:left;
    cursor: pointer;
    /*border:4px solid #ffffff;*/
   
    &:hover{
			box-shadow: 0 0 25px #cee0f5;
			transition: .3s;
    }
    &:active{
      /*border:4px solid #1fd094;*/
    }
    .head{
      /*border-bottom:1px solid #e1e5ec;*/
      height:44px;
      text-align:left;
      position:relative;
      overflow:hidden;
      /*padding-left:40px;
      padding-top:20px;*/
      .titleLeft{
        color:#1fd094;
        font-size:20px;
      }
      .oval{
      		transition: all 0.3s ease;
        width:88px;
        height:88px;
        background:#1fd094;
        border-radius:50%;
        position:absolute;
        right:-44px;
        top:-44px;
        .titleRight{
	        color:#ffffff;
	        font-size:30px;
	        position:absolute;
	        left:13px;
	        bottom:13px;
	      }
	      &:hover{
	      		
	      		background: #f66;
	      }
	      &:hover .titleRight{
	      		display: none;
	      }
	      &:hover img{
	      		display: initial;
	      }
	      img{
	      		display: none;
	      		position: absolute;
	      		left:17px;
	        bottom:17px;
	      }
	      
      }
    }
    .body{
      height:117px;
      padding-left: 20px;
      overflow: hidden;
      border-bottom: 1px solid #e1e5ec;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp:3;//行数
      -webkit-box-orient:vertical;
      .question_title{
      		width: 320px;
      		font-size: 18px;
      		line-height: 30px;
      }
      .question_desc{
      		width: 320px;
      		font-size: 16px;
      		line-height: 20px;
      		color: #828282;
      }
    }
    .bottom{
      text-align: left;
      height: 40px;
      line-height: 40px;
      color: #828282;
      font-size: 0;
      *{
      		font-size: 16px;
      }
      .questionItemClass{
      		padding: 0 20px;
      		
      }
      .questionCount i{
      		color: #ff6666;
      }
      .questionData{
      		float: right;
      		padding-right: 22px;
      		.date,.time{
      			color: #ff6666;
      		}
      		.week{
      			
      		}
      		
      }
    }

  }
</style>
