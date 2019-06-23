<template>
  <div class="editors">
    <quill-editor
      v-model="describeInput"
      ref="myQuillEditor"
      :options="editorOption"
      @change="onEditorChange"
      placeholder = "ahha">
    </quill-editor>
  </div>
</template>
<script>
import { quillEditor } from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

export default {
  components: {
    quillEditor,
  },
  data () {
    return {
      describeInput: '',
      editorOption: {
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'], // toggled buttons
            ['blockquote', 'code-block' ],
            [{ color: [] }, { background: [] }],
            [{ font: [] }],
            [{ align: [] }],
            [{ size: ['small', false, 'large', 'huge' ] }],
          ],
        },
        formats: {
        },
      },
    }
  },
  props: ['describe' ],
  watch: {
    describe() {
      this.describeInput = this.describe
    },
  },
  methods: {
    onEditorChange () {
      // 内容改变事件
      this.$emit('editorValue', this.describeInput)
    },
  },
}
</script>
<style lang="scss" scoped>
.editors {
  .ql-editor {
    height: 400px;
  }
  .ql-editor.ql-blank::before {
    opacity: 0;
  }
}
</style>
