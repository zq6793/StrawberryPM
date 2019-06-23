<template>
  <section class="fx-pages-main selluse">

    <div class="content">
      <h3 class="content-tit">
        营销玩法
        <span class="content-tit-m">吸粉、老客带新客，提高下单转化率</span>
      </h3>
      <el-main>
        <el-row :gutter="24">
          <el-col :span="8" v-for="item in textone" :key="item.title" style="padding-left:28px">
            <div class="grid-content bg-purple boxtext" @click="addActive(item.id)">
              <div class="icons">
                <i :class="item.icon"></i>
              </div>
              <div class="info">
                <p>{{item.title}}</p>
                <p>{{item.explain}}</p>
              </div>
            </div>
          </el-col>
          <el-col :span="8" v-for="item in texttwo" :key="item.title" style="padding-left:28px">
            <div class="grid-content bg-purple boxtext" @click="addActive(item.id)">
              <div class="icons">
                <i :class="item.icon"></i>
              </div>
              <div class="info">
                <p>{{item.title}}</p>
                <p>{{item.explain}}</p>
              </div>
            </div>
          </el-col>
          <el-col :span="8" v-for="item in textthree" :key="item.title" style="padding-left:28px">
            <div class="grid-content bg-purple boxtext" @click="addActive(item.id)">
              <div class="icons">
                <i :class="item.icon"></i>
              </div>
              <div class="info">
                <p>{{item.title}}</p>
                <p>{{item.explain}}</p>
              </div>
            </div>
          </el-col>
        </el-row>
        <h3  class="content-tit">
          客群维护<span>让老顾客更多的重复消费，提高客单贡献</span>
        </h3>
        <el-row :gutter="24">
          <el-col :span="8" v-for="item in textfour" :key="item.title" style="padding-left:28px">
            <div class="grid-content bg-purple boxtext" @click="addActive(item.id)">
              <div class="iconss">
                <i :class="item.icon"></i>
              </div>
              <div class="info">
                <p>{{item.title}}</p>
                <p>{{item.explain}}</p>
              </div>
            </div>
          </el-col>
          <el-col :span="8" v-for="item in textfive" :key="item.title" style="padding-left:28px; margin-bottom:230px;">
            <div class="grid-content bg-purple boxtext" @click="addActive(item.id)">
              <div class="iconss">
                <i :class="item.icon"></i>
              </div>
              <div class="info">
                <p>{{item.title}}</p>
                <p>{{item.explain}}</p>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-main>
    </div>
  </section>
</template>
<script type="text/javascript">
// import { getCityList, getStoreList, listActivity, LowerActivity, activityCode } from "../../api/api";
export default {
  data () {
    return {
      textone: [{
        id: '2',
        icon: 'iconfont icon-ali-_4',
        title: '开心刮刮乐',
        explain: '通过刮卡实现抽奖的玩法',
      },
      {
        id: '1',
        icon: 'iconfont icon-ali-_5',
        title: '幸运大转盘',
        explain: '通过转盘式抽奖获得好礼',
      },
      {
        icon: 'iconfont icon-ali-_2',
        title: '幸运砸金蛋',
        explain: '砸出好礼，乐享优惠',
      },
      ],
      texttwo: [{
        id: 5,
        icon: 'iconfont icon-ali-_3',
        title: '吸粉',
        explain: '摇动手机，进行抽奖',
      },
      {
        icon: 'iconfont icon-ali-_1',
        title: '秒杀',
        explain: '限时秒杀，快速抢购',
      },
      {
        icon: 'iconfont icon-ali-_7',
        title: '优惠券',
        explain: '向客户发放优惠券',
      },
      ],
      textthree: [{
        id: '3',
        icon: 'iconfont icon-ali-_8',
        title: '老带新',
        explain: '老用户带新用户，吸粉促销',
      },
      {

        icon: 'iconfont icon-ali-_6',
        title: '拍卖',
        explain: '对闲置房源进行拍卖增加出租率',
      },
      {
        id: '4',
        icon: 'iconfont icon-ali-ruzhu',
        title: '入住送好礼',
        explain: '用户办理入住获得好礼',
      },
      ],
      textfour: [{
        icon: 'iconfont icon-ali-_10',
        title: '签到',
        explain: '每日签到，领取积分',
      },
      {
        icon: 'iconfont icon-ali-_9',
        title: '储蓄卡',
        explain: '满购充值送奖品',
      },
      {
        icon: 'iconfont icon-ali-_12',
        title: '会员卡',
        explain: '会员专属卡享受各种会员服务',
      },
      ],
      textfive: [{
        icon: 'iconfont icon-ali-_11',
        title: '评价',
        explain: '客户好评获好礼',
      },
      {
        icon: 'iconfont icon-ali-_13',
        title: '积分券',
        explain: '入住获积分抵现',
      },
      {
        icon: 'iconfont icon-ali-_14',
        title: '回访',
        explain: '定期回访询问收集问题',
      },
      ],

    }
  },
  mounted () {

  },
  methods: {
    addActive (id) {
      // 刮刮乐
      if (id == '1') {
        this.$router.push({
          path: '/addactivity',
          query: { id: 2 },
        })// 大转盘
      } else if (id == '2') {
        this.$router.push({
          path: '/addactivity',
          query: { id: 1 },
        })// 老带新
      } else if (id == '3') {
        this.$router.push({
          path: '/addactivity',
          query: { id: 3 },
        })// 入住送好礼
      } else if (id == '4') {
        this.$router.push({
          path: '/addactivity',
          query: { id: 4 },
        })//
      } else if (id == '5') {
        this.$router.push({
          path: '/addactivity',
          query: { id: 5 },
        })
      } else {
        this.$message({
          message: '此活动正在开发中',
          type: 'warning',
        })
      }
    },
  },
}
</script>
<style scoped>
  .selluse .content{
    padding: 24px;
    box-sizing: border-box;
}
.selluse .content .content-tit{
    color: #4a4a4a;
    font-size: 18px;
    height: 30px;
    line-height: 30px;
    margin-bottom: 20px;
}
.selluse .content .content-tit span {
    font-size: 14px;
    padding-left: 16px;
    color: #9d9d9d;
}
.selluse .boxtext {
    /*padding-left: 10px;*/
    background: #f7f7f7;
    display: flex;
    justify-content: space-around;
    height: 100px;
    min-width: 276px;
    margin-bottom: 40px;
    cursor: pointer;
}
.selluse .boxtext .icons, .selluse .boxtext .iconss {
    height: 70px;
    width: 70px;
    background: #6d53d6;
    margin-top: 16px;
}
.selluse .boxtext .icons .iconfont, .selluse .boxtext .iconss .iconfont {
    font-size: 50px;
    line-height: 70px;
    padding-left: 10px;
    color: #fff;
}
.selluse .boxtext .info {
    padding-top: 10px;
}
.selluse  .boxtext .info p {
    width: 190px;
    color: #6e6e6e;
    line-height: 20px;
}
.selluse .boxtext .info p:first-of-type {
    font-weight: 600;
    font-size: 16px;
    color: #4a4a4a;
    width: 154px;
    line-height: 30px;
}
</style>
