<template>
  <section class="fx-pages-main add-activity">
    <!--工具条-->
    <el-row>
      <el-col :span="8" :offset="2">
        <div class="img" v-if="dial == 2">
        <img src="../../../assets/img/dial.jpg" width="80% " alt="">
        <p class="modeltit">{{addActivity.name}}</p>
        <p class="actitle">{{addActivity.slogan}}</p>
        <div class="actext">
          <p>1.活动有效时间：<el-input type="text" v-model="times" disabled></el-input></p>
          <p>2.请在个人中心优惠券查看奖品 </p>
          <p>3.活动说明：<span style="word-break:break-word;">{{addActivity.description}}</span></p>
        </div>
        </div>
        <div class="scratch" v-else-if="dial == 1">
        <img src="../../../assets/img/scratch.jpg" alt="">
        <p class="modeltit">{{addActivity.name}}</p>
        <div class="actext">
          <p>1.活动有效时间：<el-input type="text" v-model="times" disabled></el-input></p>
          <p>2.请在个人中心优惠券查看奖品 </p>
          <p>3.活动说明：<span style="word-break:break-word;">{{addActivity.description}}</span></p>
        </div>
        </div>
        <div class="attract" v-else-if="dial == 5">
        <img src="../../../assets/img/attract.jpg" ref="starImg" style="display:none">
        <canvas id="main" height="1300" width="720" style="width:360px;height:650px;"></canvas>
        </div>
      </el-col>
      <el-col :span="12">
             <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick" ref="active">
            <el-tab-pane label="基本信息" name="first">
              <el-form label-width="100px">
              <el-form-item label="活动名称" prop="name"  size="small">
                <el-col :span="6">
                <el-input size="small" v-model="addActivity.name" placeholder="请填写活动名称"></el-input>
                </el-col>
                <el-col :span="4" :offset="14">
                <p class="companion" @click="companionLink"> <i class="iconfont icon-ali-tishi">
                </i>操作指南</p>
                </el-col>
              </el-form-item>
              <br>
              <el-form-item label="活动口号" prop="slogan" v-if="dial == 2 ?true :false"  size="small">
                <el-input placeholder="请填写活动口号" style="width:420px" size="small" v-model="addActivity.slogan"></el-input>
              </el-form-item>
              <br v-if="dial == 2 ?true :false">
              <el-form-item label="活动时间" prop="start_time"  size="small">
                <el-col :span="8">
                <el-date-picker type="datetime" placeholder="请选择日期" @change="start_time" v-model="value1" :picker-options="pickerOptions0"></el-date-picker>
                </el-col>
                <el-col :span="2">
                  至
                </el-col>
                <el-col :span="8">
                  <el-date-picker type="datetime" placeholder="请选择日期" @change="end_time" v-model="value2" :picker-options="pickerOptions1"></el-date-picker>
                </el-col>
              </el-form-item>

              <el-form-item :label="dial != 5?'活动说明': '活动规则'" prop="description"  size="small">
                <el-input type="textarea" v-model="addActivity.description" :rows='4' placeholder="请输入活动说明" ref="rule"></el-input>
              </el-form-item>
              <el-form-item label="活动详情" prop="description" v-if="dial == 5"  size="small">
                <el-input type="textarea" v-model="addActivity.explain" :rows='4' placeholder="请输入活动详情"></el-input>
              </el-form-item>
              <el-form-item label="参与门店"  size="small" ref="store">
                <span class="ctitle">城市</span>
                <el-checkbox :indeterminate="cityIndete" v-model="checkAllCity" @change="checkAllCitys">全选</el-checkbox>
                <el-checkbox-group v-model="checkedCities" @change="checkedCitiesChange" class="city">
                  <el-checkbox v-for="city in cityList" :label="city" :key="city.input"></el-checkbox>
                </el-checkbox-group>
                <span class="ctitle">门店</span>
                <el-checkbox :indeterminate="stroeIndete" v-model="checkAllStore" @change="checkAllStores">全选</el-checkbox>
                <el-checkbox-group v-model="addActivity.store_id" @change="checkedStoresChange" class="storesty">
                  <el-checkbox v-for="item in storesList" :label="item.id" :key="item.id">{{item.name}}</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              <el-form-item label="" size="small">
              <el-button type="primary" class="add-btn" @click="submitOne" v-loading="listLoadingno" :disabled="isPushone">发布</el-button>
              </el-form-item>
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="活动设置" name="second" class="set">
              <el-form label-width="100px">
              <div v-if='viewyes'>
                <el-form-item label="参与用户">
                  <el-checkbox-group v-model="addActivity.customer" class="customer">
                    <el-checkbox v-for="item in customerList" :label="item.id" :key="item.id">{{item.label}}</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
                <br>
                <el-form-item label="抽奖次数">
                  <el-checkbox-group v-model="addActivity.limit" class="limit" :max="1">
                    <el-checkbox v-for="item in limitList" :label="item.id" :key="item.id">{{item.label}}</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
                <br>
                <el-form-item label="奖品设置"  class="pricetable">
                  <div class="daytables">
                    <table cellspacing="0" cellpadding="1">
                      <tr style="height: 50px;">
                        <th>奖品等级</th>
                        <th>奖品名称</th>
                        <th>奖品数量</th>
                      </tr>
                      <tr>
                        <td>一等奖</td>
                        <td>
                          <el-select v-model="addActivity.one_prize" placeholder="请选择" @change="searchCity">
                            <el-option v-for="item in priceList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                          </el-select>
                        </td>
                        <td>
                          <input type="text" class="number" v-model="addActivity.one_count">
                          <span class='sumnum'>{{sumJudgeo}}</span>
                        </td>
                      </tr>
                      <tr>
                        <td>二等奖</td>
                        <td>
                          <el-select v-model="addActivity.two_prize" placeholder="请选择" @change="searchCity">
                            <el-option v-for="item in priceList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                          </el-select>
                        </td>
                        <td>
                          <input type="text" class="number" v-model="addActivity.two_count">
                          <span class='sumnum'>{{sumJudgew}}</span>
                        </td>
                      </tr>
                      <tr>
                        <td>三等奖</td>
                        <td>
                          <el-select v-model="addActivity.three_prize" placeholder="请选择" @change="searchCity">
                            <el-option v-for="item in priceList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                          </el-select>
                        </td>
                        <td>
                          <input type="text" class="number" v-model="addActivity.three_count">
                          <span class='sumnum'>{{sumJudget}}</span>
                        </td>
                      </tr>
                    </table>
                  </div>
                </el-form-item>
                <br>
                <el-button type="primary" class="add-btns" @click="submitTwo" v-loading="listLoading" :disabled="isPushtwo">发布</el-button>
              </div>
              <div v-if='viewno' class="viewno">
                <div class="daytable daytableoldtwo" v-if="dial == 3">
                  <p>老用户奖品设置</p>
                  <table cellspacing="0" cellpadding="1">
                    <tr style="height: 50px;">
                      <th colspan="">合同时长</th>
                      <th colspan="">奖品名称</th>
                      <th colspan="">奖品数量</th>
                      <th colspan="">每人发放量</th>
                    </tr>
                    <tr>
                      <td>
                        <span>一季度（低于一季度无奖品发放）</span>
                      </td>
                      <td>
                        <el-select v-model="addActivityno.one_prize" placeholder="请选择" @change="searchCity" size="small">
                          <el-option v-for="item in priceList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                      </td>
                      <td>
                        <input type="text" class="number" v-model="addActivityno.one_count">
                      </td>
                      <td>
                        <input type="text" class="number" v-model="addActivityno.one_grant">
                        <span class="sumnum">{{oldsumJudgeo}}</span>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <span>半年（低于半年按一季度发放奖品）</span>
                      </td>
                      <td>
                        <el-select v-model="addActivityno.two_prize" placeholder="请选择" @change="searchCity" size="small">
                          <el-option v-for="item in priceList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                      </td>
                      <td>
                        <el-input type="text" class="number" v-model="addActivityno.two_count">
                        </el-input>
                      </td>
                      <td>
                        <el-input type="text" class="number" v-model="addActivityno.two_grant">
                        </el-input>
                        <span class="sumnum">{{oldsumJudgew}}</span>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <span>一年（低于一年按半年发放奖品）</span>
                      </td>
                      <td>
                        <el-select v-model="addActivityno.three_prize" placeholder="请选择" @change="searchCity" size="small">
                          <el-option v-for="item in priceList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                      </td>
                      <td>
                        <el-input type="text" class="number" v-model="addActivityno.three_count">
                        </el-input>
                      </td>
                      <td>
                        <el-input type="text" class="number" v-model="addActivityno.three_grant"></el-input>
                        <span class="sumnum">{{oldsumJudget}}</span>
                      </td>
                    </tr>
                  </table>
                </div>
                <div class="daytable daytableoldtwo daytableoldthr" v-if="dial == 4">
                  <p>奖品设置</p>
                  <table cellspacing="0" cellpadding="1" style="width: 100%;">
                    <tr style="height: 50px;">
                      <th colspan="">合同时长</th>
                      <th colspan="">奖品名称</th>
                      <th colspan="">奖品数量</th>
                      <th colspan="">每人发放量</th>
                    </tr>
                    <tr>
                      <td>
                        <span>一季度（低于一季度无奖品发放）</span>
                      </td>
                      <td>
                        <el-select v-model="addActivityno.one_prize" placeholder="请选择" @change="searchCity" size="small">
                          <el-option v-for="item in priceList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                      </td>
                      <td>
                        <el-input type="text" class="number" v-model="addActivityno.one_count">
                        </el-input>
                      </td>
                      <td>
                        <el-input type="text" class="number" v-model="addActivityno.one_grant">
                        </el-input>
                        <span class="sumnum">{{oldsumJudgeo}}</span>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <span>半年（低于半年按一季度发放奖品）</span>
                      </td>
                      <td>
                        <el-select v-model="addActivityno.two_prize" placeholder="请选择" @change="searchCity" size="small">
                          <el-option v-for="item in priceList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                      </td>
                      <td>
                        <el-input type="text" class="number" v-model="addActivityno.two_count">
                        </el-input>
                      </td>
                      <td>
                        <el-input type="text" class="number" v-model="addActivityno.two_grant">
                        </el-input>
                        <span class="sumnum">{{oldsumJudgew}}</span>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <span>一年（低于一年按半年发放奖品）</span>
                      </td>
                      <td>
                        <el-select v-model="addActivityno.three_prize" placeholder="请选择" @change="searchCity" size="small">
                          <el-option v-for="item in priceList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                      </td>
                      <td>
                        <el-input type="text" class="number" v-model="addActivityno.three_count">
                        </el-input>
                      </td>
                      <td>
                        <el-input type="text" class="number" v-model="addActivityno.three_grant">
                        </el-input>
                        <span class="sumnum">{{oldsumJudget}}</span>
                      </td>
                    </tr>
                  </table>
                </div>
                <div class="daytable attractinfo" v-if="dial == 5">
                  <p style="text">奖品设置</p>
                  <tr style="height: 50px;">
                    <th colspan="">吸粉数量</th>
                    <th colspan="">奖品名称</th>
                    <th colspan="">奖品数量</th>
                    <th colspan="">每人发放量</th>
                  </tr>
                  <tr v-for="item in prizes" :key="item.id">
                    <td>
                      <el-input type="text" class="number" v-model="item.limit">
                      </el-input>
                      <span>人以上</span>
                    </td>
                    <td>
                      <el-select v-model="item.coupontype_id" placeholder="请选择" @change="searchCity" size="small">
                        <el-option v-for="item in priceList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                      </el-select>
                    </td>
                    <td>
                      <el-input type="text" class="number" v-model="item.count">
                      </el-input>
                    </td>
                    <td>
                      <el-input type="text" class="number" v-model="item.single">
                      </el-input>
                      <span class="sumnum">{{item.sumJudgeo}}</span>
                    </td>
                  </tr>
                </div>
                <el-button type="primary" class="add-btnss" @click="submitno" v-loading="listLoading">发布</el-button>
              </div>
            </el-form>
            </el-tab-pane>
            <el-tab-pane label="分享设置" name="third" ref="share" style="display: none">
              <el-form label-width="100px">
              <el-form-item label="分享标题" prop="share_title" size="small">

                <el-input placeholder="请填写标题" size="small" v-model="addActivity.share_title"></el-input>
              </el-form-item>
              <el-form-item label="分享封面" prop="images" size="small">
                <el-upload :action="uploadUrl()" list-type="picture-card" :headers="headers" :on-preview="handlePictureCardPreview" :on-success="handleSuccess1" limit=1 name='image' ref="upload1" :disabled="isClickT" :on-progress="handleProgressT" :before-upload="beforeAvatarUploadT">
                  <img v-if="addActivity.images" :src="addActivity.images" class="avatar">
                  <el-button type="primary" v-loading="listLoadings" class="changeimg">更换图片</el-button>
                </el-upload>
                <span class="default" @click="defaultImg">恢复默认</span>
                <p class="text1">上传图片大小不能超过2MB</p>
              </el-form-item>
              <el-form-item label="分享描述" prop="share_des" size="small">
                <el-input type="textarea" v-model="addActivity.share_des" :rows='4' placeholder="请输入分享描述"></el-input>
              </el-form-item>
              <el-form-item label="" size="small">
              <el-button type="primary" class="add-img" @click="submiThree" v-loading="listLoading">发布</el-button>
            </el-form-item>
              </el-form>
            </el-tab-pane>
          </el-tabs>
      </el-col>
    </el-row>
  </section>
</template>
<script type="text/javascript">
import { getCityList, getStores, activityIni, addScratch, addTrntable, oldbeltNew, checkIn, getAttract, baseimageupload } from '@/api/api'
export default {
  data () {
    return {
      value1: '',
      value2: '',
      mainCtx: '',
      isPushone: true,
      isPushtwo: true,
      viewyes: true,
      viewno: false,
      pickerOptions0: {
        disabledDate: (time) => {
          if (this.value2 != '') {
            return time.getTime() < Date.now() - 8.64e7
          } else {
            return time.getTime() < Date.now() - 8.64e7
          }
        },
      },
      pickerOptions1: {
        disabledDate: (time) => {
          return time.getTime() < this.value1 - 8.64e7
        },
      },
      checkAllCity: false,
      cityIndete: true,
      checkedCities: [],
      cityList: [],
      city: '',
      checkAllStore: false,
      stroeIndete: true,
      dial: '',
      acts: [{
        name: '123',
        age: 0,
      }, {
        name: '333',
        age: 0,
      } ],
      baseimg: '',
      storesList: [],
      tabPosition: 'top',
      activeName: 'first',
      times: '',
      isClickT: false,
      addActivity: {
        name: '',
        start_time: '',
        end_time: '',
        description: '',
        store_id: [],
        customer: [],
        limit: [],
        one_prize: '',
        two_prize: '',
        three_prize: '',
        one_count: '',
        two_count: '',
        three_count: '',
        share_title: '',
        share_des: '',
        images: '',
        slogan: '',
        explain: '',
      },
      addActivityno: {
        one_prize: '',
        two_prize: '',
        three_prize: '',
        one_count: '',
        two_count: '',
        three_count: '',
        one_grant: '',
        two_grant: '',
        three_grant: '',

      },
      listLoadings: false,
      listLoading: false,
      customerList: [{
        id: 1,
        label: '新用户（首次关注用户）',
      },
      {
        id: 2,
        label: '已入住用户',
      },
      {
        id: 3,
        label: '已退房用户',
      },
      ],
      limitList: [{
        id: 1,
        label: '一人一次',
      },
      {
        id: 2,
        label: '一天一次',
      },
      {
        id: 3,
        label: '一天两次',
      },
      ],
      prizes: [{
        id: 1,
        count: '',
        single: '',
        coupontype_id: '',
        limit: '',
        sumJudgeo: '',
      },
      {
        id: 2,
        count: '',
        single: '',
        coupontype_id: '',
        limit: '',
        sumJudgeo: '',
      },
      {
        id: 3,
        count: '',
        single: '',
        coupontype_id: '',
        limit: '',
        sumJudgeo: '',
      },
      ],
      priceList: [],
      addActivityRs: {
        name: [{
          required: true,
          message: '请输入活动名称',
          trigger: 'blur',
        } ],
        start_time: [{
          required: true,
          message: '请选择开始时间',
          trigger: 'blur',
        } ],
        end_time: [{
          required: true,
          message: '请选择结束时间',
          trigger: 'blur',
        } ],
        description: [{
          required: true,
          message: '请输入活动说明',
          trigger: 'blur',
        } ],
        checkAllStore: [{
          required: true,
          message: '请选择门店',
          trigger: 'blur',
        } ],
        customer: [{
          required: true,
          message: '请选择参与用户',
          trigger: 'blur',
        } ],
        limit: [{
          required: true,
          message: '请选择抽奖次数',
          trigger: 'blur',
        } ],
        slogan: [{
          required: true,
          message: '请输入口号',
          trigger: 'blur',
        } ],
        one_prize: [{
          required: true,
          message: '请对奖品进行设置',
          trigger: 'blur',
        } ],
        share_title: [{
          required: true,
          message: '请输入分享标题',
          trigger: 'blur',
        } ],
        share_des: [{
          required: true,
          message: '请上传分享描述',
          trigger: 'blur',
        } ],
        images: [{
          required: true,
          message: '请上传分享封面',
          trigger: 'blur',
        } ],
      },
      sumJudgeo: '',
      sumJudgew: '',
      sumJudget: '',
      oldsumJudgeo: '',
      oldsumJudgew: '',
      oldsumJudget: '',
      listLoadingno: false,
    }
  },

  created () {
    this.getCity()
    this.getStoreInfo()
    this.getprice()
    this.dial = this.$route.query.id
  },
  mounted () {
    this.defaultImg()
    if (this.dial == '3' || this.dial == '4') {
      this.$refs.bigbox.style.paddingLeft = 20 + '%'
      this.$refs.active.$el.firstChild.firstChild.firstChild.style.paddingLeft = 20 + '%'
      this.viewyes = false
      this.viewno = true
    }
    if (this.dial != '5') {
      this.$refs.store.$el.style.display = 'block'
    } else {
      this.viewyes = false
      this.viewno = true
      this.mainCtx = document.getElementById('main').getContext('2d')
    }
  },
  updated () {
    if (this.dial == '3' || this.dial == '4' || this.dial == '5') {
      this.$refs.active.$el.firstChild.firstChild.firstChild.firstChild.lastChild.style.display = 'none'
    }
    if (this.dial == '5') {
      this.getCanvas()
    }
  },
  watch: {
    addActivity: {
      handler (newValue) {
        this.sumJudgeo = this.changeNum(newValue.one_count, this.sumJudgeo)
        this.sumJudgew = this.changeNum(newValue.two_count, this.sumJudgew)
        this.sumJudget = this.changeNum(newValue.three_count, this.sumJudget)
        this.publish(newValue)
      },
      deep: true,
      // 对奖品数量进行设置
    },
    addActivityno: {
      handler (newValue) {
        this.oldsumJudgeo = this.oldchangeNum(newValue.one_count, newValue.one_grant, this.oldsumJudgeo)
        this.oldsumJudgew = this.oldchangeNum(newValue.two_count, newValue.two_grant, this.oldsumJudgew)
        this.oldsumJudget = this.oldchangeNum(newValue.three_count, newValue.three_grant, this.oldsumJudget)
      },
      deep: true,
    },
    prizes: {
      handler (newValue) {
        newValue.forEach((item) => {
          if (item.id == 1) {
            item.sumJudgeo = this.oldchangeNum(item.count, item.single, item.sumJudgeo)
          } else if (item.id == 2) {
            item.sumJudgeo = this.oldchangeNum(item.count, item.single, item.sumJudgeo)
          } else {
            item.sumJudgeo = this.oldchangeNum(item.count, item.single, item.sumJudgeo)
          }
        })
      },
      deep: true,
    },
  },
  computed: {
    headers () {
      return {
        Token: sessionStorage.getItem('token'),
      }
    },
  },
  methods: {
    // ------------------------- 数量判断 ------------------------
    changeNum (num, sumJudge) {
      sumJudge = ''
      if (!isNaN(Number(num))) {
        if (num <= 0 && num != '') {
          sumJudge = '数量不能小于或者等于0'
        }
      } else {
        sumJudge = '数量必须为数字'
      }
      return sumJudge
    },
    oldchangeNum (num, limit, sumJudge) {
      sumJudge = ''
      if (isNaN(Number(num)) || isNaN(Number(limit))) {
        sumJudge = '数量必须为数字'
      } else {
        if (num <= 0 && num != '' || limit <= 0 && limit != '') {
          sumJudge = '数量不能小于或者等于0'
        } else {
          if (Number(num) < Number(limit)) {
            sumJudge = '每人发放量不能大于奖品数量'
          }
        }
      }
      return sumJudge
    },
    // ------------------------- 发布条件 -----------------------
    publish (newValue) {
      if (this.dial == '1') {
        if (!newValue.name || !newValue.start_time || !newValue.end_time || !newValue.description || newValue.store_id.length == 0) {
          this.isPushone = true
        } else {
          this.isPushone = false
        }
        if (!newValue.one_prize || !newValue.two_prize || !newValue.three_prize || !newValue.one_count || !newValue.two_count || !newValue.three_count || newValue.limit.length == 0 || newValue.customer.length == 0) {
          this.isPushtwo = true
        } else {
          this.isPushtwo = false
        }
      } else if (this.dial == '2') {
        if (!newValue.name || !newValue.slogan || !newValue.start_time || !newValue.end_time || !newValue.description || newValue.store_id.length == 0) {
          this.isPushone = true
        } else {
          this.isPushone = false
        }
        if (!newValue.one_prize || !newValue.two_prize || !newValue.three_prize || !newValue.one_count || !newValue.two_count || !newValue.three_count || newValue.limit.length == 0 || newValue.customer.length == 0) {
          this.isPushtwo = true
        } else {
          this.isPushtwo = false
        }
      } else if (this.dial == '3') {
        if (!newValue.name || !newValue.start_time || !newValue.end_time || !newValue.description || newValue.store_id.length == 0) {
          this.isPushone = true
        } else {
          this.isPushone = false
        }
      } else if (this.dial == '4') {
        if (!newValue.name || !newValue.start_time || !newValue.end_time || !newValue.description || newValue.store_id.length == 0) {
          this.isPushone = true
        } else {
          this.isPushone = false
        }
      } else if (this.dial == '5') {
        if (!newValue.name || !newValue.start_time || !newValue.end_time || !newValue.description || !newValue.explain) {
          this.isPushone = true
        } else {
          this.isPushone = false
        }
      }
    },
    // ------------------------- canvas ------------------------
    drawText (initHeight, txt) {
      let lines = txt.split('no')
      for (let j = 0; j < lines.length; j++) {
        this.mainCtx.fillText(lines[j], 80, initHeight + (j * 30))
      }
    },
    getCanvas () {
      // 获取画布对象
      // let maxWidth = this.mainCtx.canvas.width
      // let maxHeight = this.mainCtx.canvas.height
      let initHeightR = 764
      let initHeightE = 992
      this.mainCtx.clearRect(0, 0, 1000, 1000)
      let imgSrc = this.$refs.starImg
      this.mainCtx.drawImage(imgSrc, 0, 0, 720, 1300)
      this.mainCtx.font = 'bold 24px PingFangSC-Regular'
      this.mainCtx.fillStyle = '#000'
      this.mainCtx.fillText('活动规则：', 80, 720)
      this.mainCtx.fillText('活动详情：', 80, 958)
      this.mainCtx.font = '21px PingFangSC-Regular'
      this.mainCtx.fillStyle = '#343434'
      let ruel = this.addActivity.description.replace(/\n/g, 'no')
      let explain = this.addActivity.explain.replace(/\n/g, 'no')
      this.drawText(initHeightR, ruel)
      this.drawText(initHeightE, explain)
      this.mainCtx.font = '21px PingFangSC-Regular'
      this.mainCtx.fillText('活动截止时间  ' + this.addActivity.end_time.substr(0, 10), 80, 1134)
      this.mainCtx.fillStyle = '#000'
      this.mainCtx.fillText('最终解释权归火花时代投资管理有限公司所有', 80, 1170)
    },
    changeLine (maxWidth, initHeight, text) {
      let lineWidth = 0
      let lastSubStrIndex = 0
      for (let i = 0; i < text.length; i++) {
        lineWidth += this.mainCtx.measureText(text[i]).width
        if (lineWidth > maxWidth - 50) {
          this.mainCtx.fillText(text.substring(lastSubStrIndex, i), 40, initHeight) // 绘制截取部分
          initHeight += 20
          lineWidth = 0
          lastSubStrIndex = i
        }
        if (i == text.length - 1) {
          this.mainCtx.fillText(text.substring(lastSubStrIndex, i + 1), 40, initHeight)
        }
      }
    },
    uploadUrl () {
      return this.fxCfg.image_upload_url
    },
    handlePictureCardPreview () {
      this.dialogVisible = true
    },
    handleSuccess1 (res) {
      this.isClickT = false
      this.listLoadings = false
      this.$message('图片上传成功')
      this.addActivity.images = res.data.image_url
    },
    handleProgressT () {
      this.isClickT = true
      this.listLoadings = true
    },
    beforeAvatarUploadT (file) {
      this.$refs.upload1.$el.firstChild.style.display = 'none'
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG) {
        this.$message.error('上传头像图片只能是jpg、jpeg、png、gif 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    defaultImg () {
      if (this.dial == 1) {
        this.addActivity.images = this.fxCfg.active_osso || this.fxCfg.active_osso.active_cdno
      } else if (this.dial == 2) {
        this.addActivity.images = this.fxCfg.active_ossT || this.fxCfg.active_osso.active_cdnT
      }
    },
    // 跳转界面
    companionLink () {
      if (this.dial == '1') {
        window.open('https://shimo.im/docs/7puvfYrBr6obKdsB/')
      } else if (this.dial == '2') {
        window.open('https://shimo.im/docs/1BQ8FPSxGv01MR9e/')
      } else if (this.dial == '3') {
        window.open('https://shimo.im/docs/WUdOxcIPmBUovqnA/')
      } else if (this.dial == '4') {
        window.open('https://shimo.im/docs/rYmJ5up8Y6AIg6da/')
      }
    },
    // 选择开始日期
    start_time (val) {
      this.addActivity.start_time = val
      this.start_times = val.substr(0, 10)
    },
    // 选择截止日期
    end_time (val) {
      this.addActivity.end_time = val
      this.end_times = val.substr(0, 10)
      this.times = this.start_times + ' 到 ' + this.end_times
    },
    // 获取城市
    getCity () {
      let that = this
      let para = {}
      getCityList(para).then((res) => {
        let rescode = res.data.rescode
        let getData = res.data.data.cities
        let resmsg = res.data.resmsg
        that.func.portInit(rescode, resmsg, function () {
          getData.shift()
          that.cityList = getData
        })
      }).catch(function (err) {
        console.log(err)
      })
    },
    // 获取活动奖品
    getprice () {
      let that = this
      let para = {}
      activityIni(para).then((res) => {
        let rescode = res.data.rescode
        let getData = res.data.data
        let resmsg = res.data.resmsg
        that.func.portInit(rescode, resmsg, function () {
          that.priceList = getData.coupontype
        })
      }).catch(function (err) {
        console.log(err)
      })
    },
    /* 获取门店列表 */
    getStoreInfo () {
      let that = this
      let para = {
        city: that.city,
      }
      getStores(para).then((res) => {
        let rescode = res.data.rescode
        let resmsg = res.data.resmsg
        let getData = res.data.data
        that.func.portInit(rescode, resmsg, function () {
          that.storesList = getData
        })
      }).catch(function (err) {
        console.log(err)
      })
    },
    checkAllCitys () {
      let that = this
      if (that.checkAllCity) {
        that.checkedCities = that.cityList
      } else {
        that.checkedCities = []
      }
      that.city = that.checkedCities.toString()
      that.getStoreInfo()
      that.cityIndete = false
    },
    checkedCitiesChange (value) {
      let that = this
      let checkedCount = value.length
      that.checkAllCity = checkedCount === that.cityList.length
      that.cityIndete = checkedCount > 0 && checkedCount < that.cityList.length
      that.city = that.checkedCities.toString()
      that.getStoreInfo()
      // 在此处进行传递数据；
    },

    checkAllStores () {
      let that = this
      let id = []
      that.storesList.forEach((item) => {
        id.push(item.id)
      })
      if (that.checkAllStore) {
        that.addActivity.store_id = id
      } else {
        that.addActivity.store_id = []
      }
      that.stroeIndete = false
    },
    checkedStoresChange (value) {
      let that = this
      let checkedCount = value.length
      that.checkAllStore = checkedCount === that.storesList.length
      that.stroeIndete = checkedCount > 0 && checkedCount < that.storesList.length
    },
    /* 提交 */
    submitOne () {
      this.activeName = 'second'
    },
    pushbaseImg () {
      let that = this
      let para = {
        name: that.addActivity.name,
        start_time: that.addActivity.start_time,
        end_time: that.addActivity.end_time,
        rule: that.addActivity.description,
        description: that.addActivity.explain,
        prizes: that.prizes,
        image: that.baseimg,
      }
      that.func.emptyVul(para, function () {
        that.listLoading = false
      }, function () {
        getAttract(para).then((res) => {
          if (res.data.rescode == 0) {
            that.$message.success('发布成功')
            that.listLoading = false
            that.$router.push({
              path: '/activity',
            })
          }
        })
      })
    },
    submitTwo () {
      if (!this.addActivity.one_prize || !this.addActivity.two_prize || !this.addActivity.three_prize || !this.addActivity.one_count || !this.addActivity.two_count || !this.addActivity.three_count || this.addActivity.limit.length == 0 || this.addActivity.customer.length == 0) {
        this.$message({
          message: '请完整填写表单',
          type: 'error',
        })
      } else {
        this.activeName = 'third'
      }
    },
    submiThree () {
      let that = this
      that.$refs.addActivity.validate((valid) => {
        if (valid) {
          that.$confirm('活动发布后，活动无法再进行编辑，此操作不可逆，是否确认', '提示', { type: 'warning' }).then(() => {
            let para = Object.assign({}, that.addActivity)
            para.store_id = para.store_id.toString()
            para.customer = para.customer.toString()
            para.limit = para.limit.toString()
            if (that.dial == '2') {
              addTrntable(para).then((res) => {
                let rescode = res.data.rescode
                let resmsg = res.data.resmsg
                that.func.portInit(rescode, resmsg, function () {
                  that.$message({
                    message: '发布成功',
                    type: 'success',
                  })
                  that.$refs['addActivity'].resetFields()
                  that.$router.push({
                    path: '/activity',
                  })
                })
              }).catch(function (err) {
                console.log(err)
              })
            } else if (that.dial == '1') {
              addScratch(para).then((res) => {
                let rescode = res.data.rescode
                let resmsg = res.data.resmsg
                that.func.portInit(rescode, resmsg, function () {
                  that.$message({
                    message: '发布成功',
                    type: 'success',
                  })
                  that.$refs['addActivity'].resetFields()
                  that.$router.push({
                    path: '/activity',
                  })
                })
              }).catch(function (err) {
                console.log(err)
              })
            }
          }).catch(function () {
            that.$message({
              type: 'info',
              message: '已取消发布',
            })
          })
        }
      })
    },
    // 无小界面时的提交
    submitno () {
      // 想要让对象里面所有的都不是空 那么可以使用节流阀来控制
      let that = this
      that.listLoading = true
      if (this.dial == '3') {
        let para = Object.assign({}, that.addActivityno)
        para.name = that.addActivity.name
        para.start_time = that.addActivity.start_time
        para.end_time = that.addActivity.end_time
        para.store_id = that.addActivity.store_id.toString()
        para.description = that.addActivity.description
        that.func.emptyVul(para, function () {
          that.listLoading = false
        }, function () {
          that.$confirm('活动发布后，活动无法再进行编辑，此操作不可逆，是否确认', '提示', { type: 'warning' }).then(() => {
            oldbeltNew(para).then((res) => {
              let rescode = res.data.rescode
              let resmsg = res.data.resmsg
              that.func.portInit(rescode, resmsg, function () {
                that.$message({
                  message: '发布成功',
                  type: 'success',
                })
                that.$router.push({
                  path: '/activity',
                })
                that.listLoading = false
              })
            }).catch(function (err) {
              console.log(err)
            })
          }).catch(function () {
            that.$message({
              type: 'info',
              message: '已取消发布',
            })
          })
        })
      } else if (this.dial == '4') {
        let para = {
          name: that.addActivity.name,
          start_time: that.addActivity.start_time,
          end_time: that.addActivity.end_time,
          description: that.addActivity.description,
          store_id: that.addActivity.store_id,
          one_prize: that.addActivityno.one_prize,
          two_prize: that.addActivityno.two_prize,
          three_prize: that.addActivityno.three_prize,
          one_count: that.addActivityno.one_count,
          two_count: that.addActivityno.two_count,
          three_count: that.addActivityno.three_count,
          one_grant: that.addActivityno.one_grant,
          two_grant: that.addActivityno.two_grant,
          three_grant: that.addActivityno.three_grant,
        }
        para.store_id = para.store_id.toString()
        that.func.emptyVul(para, function () {
          that.listLoading = false
        }, function () {
          that.$confirm('活动发布后，活动无法再进行编辑，此操作不可逆，是否确认', '提示', { type: 'warning' }).then(() => {
            checkIn(para).then((res) => {
              let rescode = res.data.rescode
              let resmsg = res.data.resmsg
              that.func.portInit(rescode, resmsg, function () {
                that.$message({
                  message: '发布成功',
                  type: 'success',
                })
                that.$router.push({
                  path: '/activity',
                })
                that.listLoading = false
              })
            }).catch(function (err) {
              console.log(err)
            })
          }).catch(function () {
            that.$message({
              type: 'info',
              message: '已取消发布',
            })
          })
        })
      } else if (that.dial == '5') {
        let mycanvas = document.getElementById('main')
        let baseimg = mycanvas.toDataURL('image/jpg')
        let para = {
          base: baseimg,
        }
        that.$confirm('活动发布后，活动无法再进行编辑，此操作不可逆，是否确认', '提示', { type: 'warning' }).then(() => {
          baseimageupload(para).then((res) => {
            if (res.rescode == 0) {
              that.baseimg = res.data
              that.pushbaseImg()
            }
          })
        }).catch(function () {
          that.$message.info('已取消发布')
        })
      }
    },
  },
}
</script>
<style scoped="scoped">
.add-activity{
  padding-top:30px;
}
.add-activity .scratch {
  flex: 1;
  min-height:512px;
  width: 384px;
  overflow-y: scroll;
  position: relative;
}
.add-activity .scratch img {
    width: 100%;
}
.add-activity .actext {
    color: #5d4a53;
    position: absolute;
    margin-top: -196px;
    left: 22px;
    font-size: 14px;
    line-height: 30px;
}
</style>

