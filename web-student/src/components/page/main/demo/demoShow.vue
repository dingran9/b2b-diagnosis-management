<template>
  <div class="homeworkListWrap">
  		<el-table
	    :data="tableData"
	    border
	    style="width: 80%">
	    <el-table-column
	      prop="sortNum"
	      label="序号"
	      width="180">
	    </el-table-column>
	    <el-table-column
	      prop="taskName"
	      label="作业名称"
	      width="180">
	    </el-table-column>
	    <el-table-column
	      prop="subjectName"
	      label="学科">
	    </el-table-column>
	    <el-table-column
	      prop="statusTitle"
	      label="作业状态"
	      width="180">
	    </el-table-column>
	    <el-table-column label="操作">
	      <template scope="scope">
	        <el-button
	          @click="handleEdit(scope.$index, scope.row)">{{scope.row.operation}}</el-button>
	      </template>
	    </el-table-column>
	  </el-table>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        tableData: []
      }
    },
    mounted(){
    		//获取列表信息
    		this.getHomeWorkList();
    },
    methods: {
    		getHomeWorkList(){
    			//获得学生的id信息
    			let studentCode = JSON.parse(localStorage.getItem("web-user")).userId;
    			let sendData = {
    				studentCode : studentCode,
    				"pageNum":1,
    				"pageSize":1000
    			};
    			//请求接口获取列表
    			this.$ajax.getTaskListByInClassTest(sendData)
        .then(({httpCode, result}) => {
          if (httpCode == 200) {
//          this.data.groundList = result;
//          this.getTestList();
//[
//	{
//	  "sortNum": "1",
//	  "name": "断句练习",
//	  "courseName": "语文",
//	  "statusTitle": "已完成",
//	  "status": true,
//	  "operation": "查看作业"
//	},
//	{
//	  "sortNum": "2",
//	  "name": "三角形对称",
//	  "courseName": "数学",
//	  "statusTitle": "未作答",
//	  "status": false,
//	  "operation": "开始答题"
//	},
//	{
//	  "sortNum": "3",
//	  "name": "语法规则",
//	  "courseName": "英语",
//	  "statusTitle": "未作答",
//	  "status": false,
//	  "operation": "开始答题"
//	}
//]
						console.log(result);
						this.listDealFn(result.list);
          } else {
            this.$message('获取作业列表失败,请刷新页面重试');
          }
        })
        
        
    		},
    		listDealFn(data){
    			console.log(data);
    			
    			var dealData = [];
    			data.forEach(function(item,index){
    				console.log(item,index);
    				if(item){
    					if(item.taskStatus == 0){
    						item.statusTitle = "未作答";
    						item.status = false;
    						item.operation = "开始答题";
    					}else if(item.taskStatus == 1){
    						item.statusTitle = "已完成",
    						item.status = true;
    						item.operation = "查看作业";
    					}
    					dealData.push(item)
    				}
    			})
    			dealData.forEach(function(item,index){
    				item.sortNum = index+1;
    			})
    			this.tableData = dealData;
    		},
      handleEdit(index, row) {
        console.log(index, row);
        if(row.status == true){
	        	localStorage.setItem("homeworkInfo",JSON.stringify(row));
        		this.$router.push("/main/checkAnswers");
        }else if(row.status == false){
        		localStorage.setItem("homeworkInfo",JSON.stringify(row));
        		this.$router.push("/main/startHomeWork");
        }
      }
    }
  }
</script>

<style lang="scss">
	.homeworkListWrap{
		margin: 20px;
		background: #FFFFFF;
		height: 95% !important;
		overflow: auto !important;
		
		.el-table{
			margin: auto;
			margin-top: 50px;
			min-width:800px;
			th{
				text-align: center;
			}
			
		}
	}
</style>