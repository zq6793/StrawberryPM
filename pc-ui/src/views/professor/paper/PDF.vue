<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="2">
        <div>'</div>
        <!-- <pdf
            v-for="i in numPages"
            :key="i"
            :src="src"
            :page="i"
          ></pdf> -->
      </el-col>
      <el-col :span="16" v-loading="loadingPDF">
        <pdf
          v-for="i in numPages"
          :key="i"
          :src="src"
          :page="i">
        </pdf>
      </el-col>
      <el-col :span="2">
        <el-button type="primary" class="open-review" @click="toReview">评阅</el-button>
        <!-- <el-popover
          type="primary"
          placement="right"
          width="800"
          trigger="click">
          <review :paper="info"></review>
          <el-button class="open-review" @click="toReview">评阅</el-button>
        </el-popover> -->
      </el-col>
    </el-row>
  </div>
</template>
<script>
import pdf from 'vue-pdf'
// import Review from './Review'
import { pPaperPDFURL, pPaperDetail } from '@/api/api'
export default {
  components: {
    pdf,
    // Review,
  },
  data() {
    return {
      src: '',
      numPages: 1,
      info: {},
      loadingPDF: true,
    }
  },
  computed: {
    paperId() {
      return this.$route.params.id
    },
    reviewId() {
      return this.$route.query.review_id
    },
    tplId() {
      return this.$route.query.tpl_id
    },
    pdfURL() {
      return {
        url: pPaperPDFURL(this.paperId),
        httpHeaders: {
          token: sessionStorage.getItem('token'),
        },
      }
    },
  },
  mounted() {
    let that = this
    that.src = pdf.createLoadingTask(that.pdfURL)
    that.src.then(p => {
      that.numPages = p.numPages
      that.loadingPDF = false
    })
    pPaperDetail(this.paperId).then((res) => {
      that.info = res
    }).catch((err) => {
      console.log('err', err)
    })
  },
  methods: {
    toReview() {
      this.$router.push({
        name: '论文评阅',
        params: {
          id: this.paperId,
        },
        query: {
          review_id: this.reviewId,
          tpl_id: this.tplId,
        },
      })
    },
  },
}

</script>
<style scoped>
.open-review {
  position: fixed;
}

</style>
