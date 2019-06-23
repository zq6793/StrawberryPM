<template>
  <el-dialog
    title="专家通讯评议协议"
    :visible.sync="visible"
    center>
    <quill-editor
      v-model="describeInput"
      ref="myQuillEditor"
      :options="editorOption">
    </quill-editor>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancle">取 消</el-button>
      <el-button type="primary" @click="agree">同 意</el-button>
    </span>
  </el-dialog>
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
  props: {
    visible: Boolean,
  },
  data() {
    return {
      editorOption: {
        readOnly: true,
        modules: {
          toolbar: null,
        }
      },
      describeInput: `
<p class="p1">
  <span class="s1"><b>专家通讯评议协议</b></span><span class="s2"><b><br />
</b></span>
</p>
<p class="p2">
  <span class="s3"><b>甲方：西安汇文数据科技有限公司</b></span><span class="s4"><b><span class="Apple-converted-space">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</span></b></span>
</p>
<p class="p2">
  <span class="s3"><b>乙方：</b></span><span class="s4"><b><span class="Apple-converted-space">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; </span></b></span><span class="s3"><b>身份证号：</b></span>
</p>
<p class="p3">
  <span class="s4">甲方自研纸链</span><span class="s5">*</span><span class="s4">通讯评议管理送审平台，助力高校实现信息化论文管理及送审能力。根据乙方的学术能力及职称级别，甲方聘用乙方为兼职通讯评议专家，根据《中华人民共和国民法通则》、《中华人民共和国合同法》等有关规定，甲乙双方经平等协商一致，自愿签订本协议，共同遵守本协议所列条款。</span>
</p>
<p class="p4">
  <span class="s3"><b>一、乙方承担的劳务内容及要求</b></span>
</p>
<p class="p5">
  <span class="s6">1</span><span class="s4">、乙方根据甲方工作要求和安排，担任学位论文评审、导师遴选、项目评审等的通讯评议专家。</span>
</p>
<p class="p5">
  <span class="s6">2</span><span class="s4">、乙方需保证对评议内容的真实、客观、公正。</span>
</p>
<p class="p5">
  <span class="s6">3</span><span class="s4">、乙方需确保个人学术信息的准确，方便甲方更准确进行送审匹配。</span>
</p>
<p class="p5">
  <span class="s6">3</span><span class="s4">、乙方应自愿向甲方提供身份证及银行帐号信息，确保评审报酬顺利发放。</span>
</p>
<p class="p5">
  <span class="s6">6</span><span class="s4">、乙方对所评议的论文及相关材料信息需进行保密。</span>
</p>
<p class="p4">
  <span class="s3"><b>二、劳动报酬</b></span>
</p>
<p class="p5">
  <span class="s4">乙方在本协议有效期内的报酬，按评议篇次</span><span class="s6">/</span><span class="s4">份的计薪方式。</span>
</p>
<p class="p5">
  <span class="s6">1</span><span class="s4">、学位论文评审：硕士论文</span><span class="s7">260</span><span class="s4">元</span><span class="s6">/</span><span class="s4">篇次；博士论文</span><span class="s7">350</span><span class="s4">元</span><span class="s6">/</span><span class="s4">篇次。</span>
</p>
<p class="p5">
  <span class="s6">2</span><span class="s4">、导师资格遴选：硕士生导师</span><span class="s7">260</span><span class="s4">元</span><span class="s6">/</span><span class="s4">份；博士生导师</span><span class="s7">350</span><span class="s4">元</span><span class="s6">/</span><span class="s4">份。</span>
</p>
<p class="p5">
  <span class="s6">3</span><span class="s4">、优博论文培育推荐：</span><span class="s7">350</span><span class="s4">元</span><span class="s6">/</span><span class="s4">篇次。</span>
</p>
<p class="p5">
  <span class="s6">4</span><span class="s4">、项目评审（基金、创新、奖学金等）：</span><span class="s6">200</span><span class="s4">元</span><span class="s6">/</span><span class="s4">份。</span>
</p>
<p class="p5">
  <span class="s4">乙方所获以上报酬均按月由甲方进行进行支付，</span><span class="s8">相关个税的缴纳由甲方代为处理。</span><span class="s4">注：个人所得税率标准说明</span>
</p>
<p class="p6">
  <span class="s4">根据《中华人民共和国个人所得税法》，个人得到劳务报酬时需缴纳个税。以下是计算公式：</span>
</p>
<p class="p6">
  <span class="s4"><img src="https://paperchain.oss-cn-shenzhen.aliyuncs.com/resource/2019-03-21/5c93664534ae9871.png"/></span>
</p>
<p class="p7">
  <span class="s4"><span class="Apple-converted-space">&nbsp;</span></span>
</p>
<p class="p5">
  <span class="s4">以上协议一式两份，甲乙双方各持一份，自甲、乙双方签字、盖章之日起生效。协议期为一年，到期后如双方无异议，可顺延一年。</span>
</p>
<p class="p8">
  <span class="s4"><b></b></span>
</p>
<p class="p9">
  <span class="s4"><b></b></span>
</p>
<p class="p5">
  <span class="s4"><b>甲方：西安汇文数据科技有限公司</b></span><span class="s6"><b> <span class="Apple-converted-space">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; </span></b></span><span class="s4"><b>乙方：</b></span>
</p>
<p class="p10">
  <span class="s9"><b>（盖章）</b></span><span class="s4"><b> <span class="Apple-converted-space">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; </span></b></span><span class="s9"><b>（签字）</b></span>
</p>
<p class="p10">
  <span class="s9"><b>地址：</b></span><span class="s4"><b><span class="Apple-converted-space">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; </span></b></span><span class="s9"><b>地址：</b></span>
</p>
<p class="p10">
  <span class="s9"><b>电话：</b></span><span class="s4"><b><span class="Apple-converted-space">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; </span></b></span><span class="s9"><b>电话：</b></span>
</p>
<p class="p10">
  <span class="s9"><b>日期：  </b></span><span class="s4"><b><span class="Apple-converted-space">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; </span></b></span><span class="s9"><b>日期：  </b></span>
</p>
`,
    }
  },
  methods: {
    cancle () {
      this.$emit('cancle')
    },
    agree () {
      this.$emit('agree')
    },
  },
}
</script>
