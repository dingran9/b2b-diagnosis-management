<template>

    <div class="titleViewstyle">
      <el-button type="success" @click="$router.go(-1)" style="position: absolute;right:50px;top:60px;z-index:10;">返回</el-button>
       <div v-if="false">
         <!--头视图内容-->
         <h4 align="center">
                   <span class="titlenamestyle">
                       学科：
                       <strong class="titleContentstyle">数学 </strong>
                   </span>
           <span class="titlenamestyle">
                       考试时间：
                       <strong class="titleContentstyle">2016-12-08 11:01:14 </strong>
                   </span>
           <span class="titlenamestyle">
                       监考教师：
                       <strong class="titleContentstyle">暂无 </strong>
                   </span>
           <span class="titlenamestyle">
                       总题数：
                       <strong class="titleContentstyle">{{this.dataarray.length}}题 </strong>
                   </span>
           <span class="titlenamestyle">
                       判卷老师：
                       <strong class="titleContentstyle">傅翀 </strong>
                   </span>
         </h4>

         <!--虚线-->
         <div style="border-bottom: 1px dashed #ecf1f9; margin: 20px 20px"></div>

         <span class="titlenamestyle">
                       客观部分：16分
                   </span>

         <div style="border-bottom: 1px solid #ecf1f9; margin: 20px 20px"></div>
       </div>

    </div>

</template>

<script>
    export default {
        name: 'hello',
        props:['dataarray'],
        data () {
            return {}
        },

        methods:{

            touchbtnone() {
            this.$emit('touch',"123","333")

            }

        }



    }
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>

    .titleViewstyle {


    }

    #titleshilinestyle {
        height: 50px;
      line-height: 50px;
        margin-bottom: 20px;
        border-bottom: 1px solid #ecf1f9;
    }

    .titleContentstyle {
        color: #636363;

    }

    .titlenamestyle {
        font-size: 18px;
        font-weight: normal;
        padding: 20px;
    }

</style>
