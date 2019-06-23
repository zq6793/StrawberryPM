<template>
<div class="editors">
     <quill-editor
      v-model="describe"
      ref="myQuillEditor"
      :options="editorOption"
      @change="onEditorChange"
      placeholder = "ahha">
    </quill-editor>
    </div>
</template>
<script>
import { quillEditor } from 'vue-quill-editor'
export default {
  data () {
    return {
      describe: '',
      editorOption: {
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike' ], // toggled buttons
            ['blockquote', 'code-block' ],
            [{ color: [] }, { background: [] } ],
            [{ font: [] } ],
            [{ align: [] } ],
            [{ size: ['small', false, 'large', 'huge' ] } ],
          ],
        },
      },
    }
  },
  props: ['describe' ],
  created () {
    this.describe = this.describe
  },
  methods: {
    onEditorChange () {
      // 内容改变事件
      this.$emit('editorValue', this.describe)
    },
  },
}
</script>
<style lang="scss"  scoped="scoped">
.editors {
  .ql-editor {
    height: 400px;
  }
  .ql-editor.ql-blank::before {
    opacity: 0;
  }
}
</style>
