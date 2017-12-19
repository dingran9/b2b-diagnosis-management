<template>
  <div ref="editor"></div>
</template>

<script>
//  import '../../../static/lib/ueditor/ueditor.config'
//  import '../../../static/lib/ueditor/ueditor.all'
//  import '../../../static/lib/ueditor/lang/zh-cn/zh-cn'
  export default {
    data () {
      return {
        id: Math.random() * 10000 + 'ueditorId',
        editor:{}
      }
    },
    props: {
      value: {
        type: Object,
        default: {}
      },
      config: {
        type: Object,
        default: {}
      },
      defaulthHTML: null
    },
    watch: {
      value: 'change'
    },
    mounted () {
      this.$refs.editor.id = this.id
      this.editor = UE.getEditor(this.id, this.config)
      this.resetEditor()
    },
    methods: {
      change (n, o) {
        this.resetEditor()
      },
      resetEditor(){
        this.editor.ready(function f2 () {
          this.editor.setContent(this.value.optionValue)
          this.editor.addListener('contentChange', function () {
            const uid = this.editor.uid
            const wordCount = this.editor.getContentLength(true)
            const content = this.editor.getContent()
            const plainTxt = this.editor.getPlainTxt()
            this.$emit('ready', { uid: this.value.optionKey, wordCount: wordCount, content: content, plainTxt: plainTxt })
          }.bind(this))
          this.$emit('ready', {content: this.editor.getContent()})
        }.bind(this))
//      this.$nextTick(function f1 () {
//        // 保证 this.$el 已经插入文档
//
//      })
    }
    }
  }
</script>
<style>
  .el-form-item__content {
    line-height: 0;
  }
</style>
