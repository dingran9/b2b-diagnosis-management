<template>
	<section class="createNewStorage">
      <el-dialog title="新建题库" :visible.sync="popup" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false" >
      	<span slot="title" v-if="action == 'alter'">修改题库</span>
			  <el-form :model="form">
			      <el-input v-model="form.title" auto-complete="off" required placeholder="请输入题库名称 (请保持20字以内)" :maxlength="20"></el-input>
			    		<el-input v-model="form.desc" auto-complete="off" placeholder="请简单描述一下? (请保持20字以内)" :maxlength="20"></el-input>
			  </el-form>
			  <div slot="footer" class="dialog-footer">
			    <el-button @click="cancelPopup">取 消</el-button>
			    <el-button type="primary" @click="confirmPopup">确 定</el-button>
			  </div>
			</el-dialog>
    </section>
</template>

<script>
	export default {
    props:["popup","action","itemInfo"],
    components: {},
    data(){
      return {
        data: {},
        form: {
          title: '',
          desc: ''
        },
        
      }
    },
    watch:{
    		itemInfo:function(newItemInfo){
//  			console.log(newItemInfo,"新的值");
    			this.form.title = newItemInfo.questionBookName;
    			this.form.desc = newItemInfo.description;
    		}
    },
    mounted(){
    		if(this.action == "alter"){
    			this.form.title = this.itemInfo.questionBookName;
    			this.form.desc = this.itemInfo.description;
//  			console.log(this.form,"内容");
    		}
    		
    },
    methods: {
    		cancelPopup(){
//  			console.log("取消");
    			this.$emit('popupAction',"canceled");
    		},
    		confirmPopup(){
//  			console.log("确定");
    			this.$emit('popupAction',this.form)
    		}
    },
    computed: {},
    filters: {}

  }
</script>

<style lang="scss">
	.createNewStorage {
      
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
        		font-size: 0;
          padding-top: 15px;
          height: 200px;
          background: #FFFFFF;
          overflow: auto;
					.el-input{
						margin-top: 20px;
						width: 500px;
						height: 50px;
						.el-input__inner{
							padding-left: 30px;
							height: 50px;
						}
						&:nth-child(1)::before{
							position: absolute;
							content: "*";
					    color: #ff4949;
					    top: 16px;
					    left: 15px;
						}
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