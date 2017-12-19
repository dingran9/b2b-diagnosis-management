<template>
	<section class="addtoMyStorage">
      <el-dialog title="添加到我的题库" :visible.sync="popupQues" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
			    <el-select v-model="value" placeholder="请选择">
				    <el-option
				      v-for="item in selectOptions"
				      :key="item.questionBookCode"
				      :label="item.questionBookName"
				      :value="item.questionBookCode">
				    </el-option>
				  </el-select>
			  <div slot="footer" class="dialog-footer">
			    <el-button @click="cancelPopup">取 消</el-button>
			    <el-button type="primary" @click="confirmPopup">确 定</el-button>
			  </div>
			</el-dialog>
    </section>
</template>

<script>
	export default {
    props:["popupQues","selectOptions"],
    components: {},
    data(){
      return {
        data: {},
        form: {
          title: '',
          desc: ''
        },
        value:""
      }
    },
    mounted(){
//  		console.log(this.popupQues);
//  		console.log(this.selectOptions);
    },
    methods: {
    		cancelPopup(){
//  			console.log("取消");
    			this.$emit('popupQuesAction',"canceled");
    			this.value="";
    		},
    		confirmPopup(){
//  			console.log("确定");
    			let _this = this;
    			//通过value(code值),找到item
    			let selectItem =  this.selectOptions.filter(function(item){
    				return item.questionBookCode == _this.value
    			})
    			this.$emit('popupQuesAction',selectItem[0]);
    			this.value = "";
    		}
    },
    computed: {},
    filters: {}

  }
</script>

<style lang="scss">
.addtoMyStorage{
    .el-dialog { //单独设定，不考虑与content的层级关系
      width: 630px;
      height: 340px; //相对于浏览器的比例，因为其遮罩是浏览器的100%
      .el-dialog__header {
        background: #d3f2e5;
        padding: 0;
        height: 60px;
        line-height: 60px;
        position: relative;
        button {
          position: absolute;
          right: 24px;
          top: 22px;
          cursor: pointer;
        }
      }
      .el-dialog__body {
      		height: 200px;
      		.el-select{
      			width: 50%;
      			margin-top: 50px;
      			text-align: center;
      		}
      }
      .el-dialog__footer {
        height: 0px;
        text-align: center;
        padding:0;
        button{
        		width: 140px;
        		height: 40px;
        		border-radius: 20px;
        		background: #B3B3B3;
        		border: none;
        }
        button:nth-last-child(1) {
          margin-left: 50px;
          background: #1fd094;
        }
      }
    }
  }
</style>