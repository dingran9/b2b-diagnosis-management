<template>
  <section class="addtoMyStorage">
    <el-dialog title="提示" :visible.sync="computeVisible" >
      确认删除 <span style="color:red">{{propData.paperName}}</span> 吗?
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelPopup">取 消</el-button>
        <el-button type="primary" @click="$emit('delete')">确 定</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>

  export default {
    props: ["visible","propData"],
    components: {},
    data() {
      return {
        data: {},
        form: {
          title: '',
          desc: ''
        },
        value: ""
      }
    },
    mounted() {

    },
    methods: {
      cancelPopup() {
        console.log(1);
        this.$emit('update:visible', false);
      }
    },
    computed: {
      computeVisible:{
        get(){
          return this.visible;
        },
        set(val){
          this.$emit('update:visible', val);
        }
      }
    },
    filters: {}

  }
</script>

<style lang="scss">
  .addtoMyStorage {
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
        padding:{
          top:100px;
        }
        height: 200px;

      }
      .el-dialog__footer {
        height: 0px;
        text-align: center;
        padding: 0;
        button {
          width: 140px;
          height: 40px;
          border-radius: 20px;
          background: #B3B3B3;
          border: none;
          color: #fff;
        }
        button:nth-last-child(1) {
          margin-left: 50px;
          background: #1fd094;
        }
      }
    }
  }
</style>
