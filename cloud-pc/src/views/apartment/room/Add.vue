<template>
  <section class="fx-pages-main newRoomInfo">
    <el-tabs type="card" @tab-click="handleClick">
      <el-tab-pane label="集中式">
        <el-form label-width="100px">
          <el-form-item label="所属城市">
            <el-select v-model="city" placeholder="请选择" size="small" @change="searchCity">
              <el-option v-for="item in cityList" :key="item" :label="item" :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="门店名称" class="select">
            <el-select v-model="addHome.store_id" placeholder="请选择" size="small" @change="searchName">
              <el-option v-for="item in storesList" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <div class="fx-head-s">房间信息</div>
 <!--          <el-col :span="24">
            <div class="addNum">
              <span @click="addNum">+</span>
            </div>
          </el-col> -->
          <div v-for="item in params" :key="item.input">
            <el-form-item label="楼栋名称" size="small">
              <el-col :span="6">
              <el-input placeholder="请填写楼栋名称" v-model="item.building_name"></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="楼层总高" size="small">
              <el-col :span="6">
              <el-input placeholder="请输入楼层总数，创建公寓后可对楼层进行编辑" v-model="item.layer_total"></el-input>
            </el-col>
            </el-form-item>
            <el-form-item label="层房间数" size="small">
              <el-col :span="6">
              <el-input placeholder="请输入每层房间数，创建公寓后可对每层房间数进行编辑" v-model="item.layer_room_number"></el-input>
            </el-col>
            </el-form-item>
          </div>
          <div class="fx-head-s">合同模板</div>
        <el-form-item label="长租" class="select">
          <el-select v-model="addHome.contract_template_long_id" placeholder="请选择" size="small">
            <el-option v-for="item in longList" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="短租" class="select">
          <el-select v-model="addHome.contract_template_short_id" placeholder="请选择" size="small">
            <el-option v-for="item in shortList" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="预定" class="select">
          <el-select v-model="addHome.contract_template_reserve_id" placeholder="请选择" size="small">
            <el-option v-for="item in reserveList" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
        <el-button type="primary" class="sub-btn" @click="submit" :loading="listLoading">确定
        </el-button>
      </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="分布式">
        <el-form ref="addHomes">
          <el-form-item label="所属城市">
            <el-select v-model="citySplice" placeholder="请选择" size="small" @change="searchCity">
              <el-option v-for="item in cityList" :key="item" :label="item" :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="门店名称" prop="store_id" class="select">
            <el-select v-model="addHomes.store_id" placeholder="请选择" size="small" @change="searchNameSplice">
              <el-option v-for="item in storesList" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="小区名称" prop="store_id" class="select">
            <el-select v-model="addHomes.community_id" placeholder="请选择" size="small">
              <el-option v-for="item in showCommunityList" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <strong class="size">房间信息</strong>
          <hr>
          <el-form-item class="houseSplice">
            <el-form-item label="总楼层" prop="layer_total">
              <el-input placeholder="总楼层" v-model="addHomes.layer_total"></el-input>
            </el-form-item>
            <el-form-item label="所在层" prop="layer">
              <el-input placeholder="所在层" v-model="addHomes.layer"></el-input>
            </el-form-item>
            <el-form-item label="楼栋" prop="building_name">
              <el-input placeholder="楼栋" v-model="addHomes.building_name"></el-input>
            </el-form-item>
            <el-form-item label="单元" prop="unit">
              <el-input placeholder="单元" v-model="addHomes.unit"></el-input>
            </el-form-item>
            <el-form-item label="房间号" prop="number" class="number">
              <el-input placeholder="房间号" v-model="addHomes.number"></el-input>
            </el-form-item>
          </el-form-item>
          <strong class="size">户型特点</strong>
          <hr>
          <el-form-item class="featureSplice">
            <el-form-item label="" prop="store_id" class="select">
              <el-select v-model="addHomes.room_number" placeholder="0室" size="small" @change="roomNum">
                <el-option v-for="item in room_number" :key="item.value" :label="item.label" :value="item.value" ref="roomNum">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="" prop="store_id" class="select">
              <el-select v-model="addHomes.hall_number" placeholder="0厅" size="small">
                <el-option v-for="item in hall_number" :key="item.value" :label="item.label" :value="item.value" ref="hall_number">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="" prop="store_id" class="select">
              <el-select v-model="addHomes.toilet_number" placeholder="0卫" size="small">
                <el-option v-for="item in toilet_number" :key="item.value" :label="item.label" :value="item.value" ref="toilet_number">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="" class="housenum">
              <el-input placeholder="大小" v-model="addHomes.area"></el-input>
              <span>m²</em></span>
            </el-form-item>
            <el-form-item label="朝向" prop="store_id" class="housedir">
              <el-select v-model="addHomes.toward" placeholder="请选择" size="small">
                <el-option v-for="item in room_toward" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form-item>
          <strong class="size">房间配置</strong>
          <hr>
          <el-form-item class="templateSplice">
            <el-form-item class="houseplace" v-show="isShow1">
              <el-form-item label="房间号">
                <el-input placeholder="房间号" v-model="paramsSplice1.the_room_number"></el-input>
              </el-form-item>
              <el-form-item label="面积">
                <el-input placeholder="面积" v-model="paramsSplice1.room_area"></el-input>
                <span>m²</em></span>
              </el-form-item>
              <el-form-item label="房间类型" prop="store_id" class="houseson">
                <el-select v-model="paramsSplice1.room_feature" placeholder="请选择" size="small">
                  <el-option v-for="item in room_feature" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <span class="facility" @click="dialogFormVisible1 = true">配套设施</span>
              <span class="iconfont icon-ali-duihao2 iconcolor" v-if='isShowicon1'></span>
              <span class="iconfont icon-ali-cuowu iconcolorc" v-else></span>
              <el-dialog title="" :visible.sync="dialogFormVisible1" width="30%" center>
                <el-checkbox-group class="checkBox" v-model="facility1" ref='facility1'>
                  <el-col :span="3">
                    <el-checkbox label="WIFI"></el-checkbox>
                  </el-col>
                  <el-col :span="3">
                    <el-checkbox label="独卫"></el-checkbox>
                  </el-col>
                  <el-col :span="3">
                    <el-checkbox label="沙发"></el-checkbox>
                  </el-col>
                  <el-col :span="3">
                    <el-checkbox label="衣橱"></el-checkbox>
                  </el-col>
                  <el-col :span="3">
                    <el-checkbox label="独立厨房"></el-checkbox>
                  </el-col>
                  <el-col :span="3">
                    <el-checkbox label="空调"></el-checkbox>
                  </el-col>
                  <el-col :span="3">
                    <el-checkbox label="电视"></el-checkbox>
                  </el-col>
                  <el-col :span="3">
                    <el-checkbox label="微波炉"></el-checkbox>
                  </el-col>
                  <el-col :span="3">
                    <el-checkbox label="大床"></el-checkbox>
                  </el-col>
                  <el-col :span="3">
                    <el-checkbox label="桌椅"></el-checkbox>
                  </el-col>
                  <el-col :span="3">
                    <el-checkbox label="飘窗"></el-checkbox>
                  </el-col>
                  <el-col :span="3">
                    <el-checkbox label="冰箱"></el-checkbox>
                  </el-col>
                  <el-col :span="3">
                    <el-checkbox label="烘干机"></el-checkbox>
                  </el-col>
                  <el-col :span="3">
                    <el-checkbox label="电梯"></el-checkbox>
                  </el-col>
                  <el-col :span="3">
                    <el-checkbox label="独立阳台"></el-checkbox>
                  </el-col>
                  <el-col :span="3">
                    <el-checkbox label="智能门锁"></el-checkbox>
                  </el-col>
                </el-checkbox-group>
                <span slot="footer" class="dialog-footer">
                  <el-button type="primary" @click="dialogFormVisibleone">确 定</el-button>
                   <el-button @click="dialogFormVisible1 = false">返 回</el-button>
               </span>
              </el-dialog>
            </el-form-item>
            <br>
            <el-form-item class="houseplace" v-show="isShow2">
              <el-form-item label="房间号">
                <el-input placeholder="房间号" v-model="paramsSplice2.the_room_number"></el-input>
              </el-form-item>
              <el-form-item label="面积">
                <el-input placeholder="面积" v-model="paramsSplice2.room_area"></el-input>
                <span>m²</em></span>
              </el-form-item>
              <el-form-item label="房间类型" prop="store_id" class="houseson">
                <el-select v-model="paramsSplice2.room_feature" placeholder="请选择" size="small">
                  <el-option v-for="item in room_feature" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <span class="facility" @click="dialogFormVisible2 = true">配套设施</span>
              <span class="iconfont icon-ali-duihao2 iconcolor" v-if='isShowicon2'></span>
              <span class="iconfont icon-ali-cuowu iconcolorc" v-else></span>
              <el-dialog title="" :visible.sync="dialogFormVisible2" width="30%" center>
                <el-checkbox-group class="checkBox" v-model="facility2" ref='facility2'>
                  <el-col :span="3">
                    <el-checkbox label="WIFI"></el-checkbox>
                  </el-col>
                  <el-col :span="3">
                    <el-checkbox label="独卫"></el-checkbox>
                  </el-col>
                  <el-col :span="3">
                    <el-checkbox label="沙发"></el-checkbox>
                  </el-col>
                  <el-col :span="3">
                    <el-checkbox label="衣橱"></el-checkbox>
                  </el-col>
                  <el-col :span="3">
                    <el-checkbox label="独立厨房"></el-checkbox>
                  </el-col>
                  <el-col :span="3">
                    <el-checkbox label="空调"></el-checkbox>
                  </el-col>
                  <el-col :span="3">
                    <el-checkbox label="电视"></el-checkbox>
                  </el-col>
                  <el-col :span="3">
                    <el-checkbox label="微波炉"></el-checkbox>
                  </el-col>
                  <el-col :span="3">
                    <el-checkbox label="大床"></el-checkbox>
                  </el-col>
                  <el-col :span="3">
                    <el-checkbox label="桌椅"></el-checkbox>
                  </el-col>
                  <el-col :span="3">
                    <el-checkbox label="飘窗"></el-checkbox>
                  </el-col>
                  <el-col :span="3">
                    <el-checkbox label="冰箱"></el-checkbox>
                  </el-col>
                  <el-col :span="3">
                    <el-checkbox label="烘干机"></el-checkbox>
                  </el-col>
                  <el-col :span="3">
                    <el-checkbox label="电梯"></el-checkbox>
                  </el-col>
                  <el-col :span="3">
                    <el-checkbox label="独立阳台"></el-checkbox>
                  </el-col>
                  <el-col :span="3">
                    <el-checkbox label="智能门锁"></el-checkbox>
                  </el-col>
                </el-checkbox-group>
                <span slot="footer" class="dialog-footer">
                  <el-button type="primary" @click="dialogFormVisibleTwo">确 定</el-button>
                   <el-button @click="dialogFormVisible2 = false">返 回</el-button>
               </span>
              </el-dialog>
            </el-form-item>
            <br>
            <el-form-item class="houseplace" v-show="isShow3">
              <el-form-item label="房间号">
                <el-input placeholder="房间号" v-model="paramsSplice3.the_room_number"></el-input>
              </el-form-item>
              <el-form-item label="面积">
                <el-input placeholder="面积" v-model="paramsSplice3.room_area"></el-input>
                <span>m²</em></span>
              </el-form-item>
              <el-form-item label="房间类型" prop="store_id" class="houseson">
                <el-select v-model="paramsSplice3.room_feature" placeholder="请选择" size="small">
                  <el-option v-for="item in room_feature" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <span class="facility" @click="dialogFormVisible3 = true">配套设施</span>
              <span class="iconfont icon-ali-duihao2 iconcolor" v-if='isShowicon3'></span>
              <span class="iconfont icon-ali-cuowu iconcolorc" v-else></span>
              <el-dialog title="" :visible.sync="dialogFormVisible3" width="30%" center>
                <el-checkbox-group class="checkBox" v-model="facility3" ref='facility3'>
                  <el-col :span="3">
                    <el-checkbox label="WIFI"></el-checkbox>
                  </el-col>
                  <el-col :span="3">
                    <el-checkbox label="独卫"></el-checkbox>
                  </el-col>
                  <el-col :span="3">
                    <el-checkbox label="沙发"></el-checkbox>
                  </el-col>
                  <el-col :span="3">
                    <el-checkbox label="衣橱"></el-checkbox>
                  </el-col>
                  <el-col :span="3">
                    <el-checkbox label="独立厨房"></el-checkbox>
                  </el-col>
                  <el-col :span="3">
                    <el-checkbox label="空调"></el-checkbox>
                  </el-col>
                  <el-col :span="3">
                    <el-checkbox label="电视"></el-checkbox>
                  </el-col>
                  <el-col :span="3">
                    <el-checkbox label="微波炉"></el-checkbox>
                  </el-col>
                  <el-col :span="3">
                    <el-checkbox label="大床"></el-checkbox>
                  </el-col>
                  <el-col :span="3">
                    <el-checkbox label="桌椅"></el-checkbox>
                  </el-col>
                  <el-col :span="3">
                    <el-checkbox label="飘窗"></el-checkbox>
                  </el-col>
                  <el-col :span="3">
                    <el-checkbox label="冰箱"></el-checkbox>
                  </el-col>
                  <el-col :span="3">
                    <el-checkbox label="烘干机"></el-checkbox>
                  </el-col>
                  <el-col :span="3">
                    <el-checkbox label="电梯"></el-checkbox>
                  </el-col>
                  <el-col :span="3">
                    <el-checkbox label="独立阳台"></el-checkbox>
                  </el-col>
                  <el-col :span="3">
                    <el-checkbox label="智能门锁"></el-checkbox>
                  </el-col>
                </el-checkbox-group>
                <span slot="footer" class="dialog-footer">

                  <el-button type="primary" @click="dialogFormVisibleTre">确 定</el-button>
                  <el-button @click="dialogFormVisible3 = false">返 回</el-button>
               </span>
              </el-dialog>
            </el-form-item>
          </el-form-item>
          <strong class="size">房型展示</strong>
          <hr>
          <el-form-item label="" class="shangchaun">
            <el-upload :action="uploadUrl()" list-type="picture-card" :headers="headers" :on-preview="handlePictureCardPreview" :on-success="handleSuccess" name='image' :before-upload="beforeAvatarUpload" :on-remove="handleRemove" :on-progress="handleProgress" :disabled="isClick">
              <i class="el-icon-plus"></i>
              <span class="imgPosition">上传图片</span>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="addHomes.images" alt="">
            </el-dialog>
          </el-form-item>
          <p class="size1">（温馨提示：最多能上传5张图片，每张大小不能超过2M，分辨率建议为750*420，支持jpg/jpeg/png格式图片）</p>
          <el-button type="primary" class="sub-btn" @click="submits" :loading="listLoading">确定</el-button>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </section>
</template>
<script>
import { getCityList, getStoreList, showCommunity, showTemplate, addunion, addDot } from '@/api/api'
export default {
  data () {
    return {
      input: '',
      isClick: false,
      listLoading: false,
      sels: [],
      num: 0,
      page: 1,
      total: 0,
      storeValue: '',
      city: '',
      communit: '',
      storesList: [],
      dialogVisible: false,
      cityList: [],
      showbuilding: '',
      buildingList: [],
      showCommunityList: [],
      storeList: [],
      citySplice: '',
      label: '',
      longList: [],
      shortList: [],
      reserveList: [],
      facility1: [],
      facility2: [],
      facility3: [],
      checkedList1: {},
      checkedList2: {},
      checkedList3: {},
      isShow1: true,
      isShow2: true,
      isShow3: true,
      dialogFormVisible1: false,
      dialogFormVisible2: false,
      dialogFormVisible3: false,
      isShowicon1: false,
      isShowicon2: false,
      isShowicon3: false,
      formLabelWidth: '120px',
      addHome: {
        store_id: '',
        contract_template_long_id: '',
        contract_template_short_id: '',
        contract_template_reserve_id: '',
        buildings: [],
      },
      params: [{
        building_name: '',
        layer_total: '',
        layer_room_number: '',
      } ],
      addHomes: {
        store_id: '',
        community_id: '',
        building_name: '',
        unit: '',
        layer: '',
        layer_total: '',
        number: '',
        room_number: '',
        hall_number: '',
        toilet_number: '',
        area: '',
        images: [],
        contract_template_long_id: '',
        contract_template_short_id: '',
        contract_template_reserve_id: '',
        rooms: [],
        toward: '',
      },
      paramsSplice1: {
        the_room_number: '',
        room_area: '',
        room_feature: '',
        room_provides: '',
      },
      paramsSplice2: {
        the_room_number: '',
        room_area: '',
        room_feature: '',
        room_provides: '',
      },
      paramsSplice3: {
        the_room_number: '',
        room_area: '',
        room_feature: '',
        room_provides: '',
      },
      room_number: [{
        value: 1,
        label: '1室',
      }, {
        value: 2,
        label: '2室',
      }, {
        value: 3,
        label: '3室',
      } ],
      hall_number: [{
        value: 0,
        label: '0厅',
      }, {
        value: 1,
        label: '1厅',
      }, {
        value: 2,
        label: '2厅',
      } ],
      toilet_number: [{
        value: 1,
        label: '1卫',
      }, {
        value: 2,
        label: '2卫',
      }, {
        value: 3,
        label: '3卫',
      } ],
      room_toward: [{
        value: 'E',
        label: '东',
      }, {
        value: 'W',
        label: '西',
      }, {
        value: 'S',
        label: '南',
      },
      {
        value: 'N',
        label: '北',
      },
      {
        value: 'EW',
        label: '东西',
      },
      {
        value: 'SN',
        label: '南北',
      },

      ],
      room_feature: [{
        value: 'M',
        label: '主卧',
      }, {
        value: 'S',
        label: '次卧',
      }, {
        value: 'MT',
        label: '独卫主卧',
      } ],
    }
  },
  computed: {
    headers () {
      return {
        'Token': sessionStorage.getItem('token'),
      }
    },
  },
  mounted () {
    this.getCity()
  },

  methods: {
    uploadUrl () {
      return this.fxCfg.image_upload_url
    },

    handleRemove (file) {
      this.addHomes.images.forEach((item, i) => {
        if (item == file.response.data.image_url) {
          this.addHomes.images.splice(i, 1)
        }
      })
    },

    handleSuccess (res) {
      this.isClick = false
      this.$message('图片上传成功')
      if (this.addHomes.images.length < 5) {
        this.addHomes.images.push(res.data.image_url)
      }
    },

    handleProgress () {
      this.isClick = true
    },

    // 对上传图片进行规定
    beforeAvatarUpload (file) {
      const isJPG = file.type == 'image/jpeg' || file.type == 'image/png'
      const isLt2M = file.size / 1023 / 1023 < 2
      const imageLength = this.addHomes.images.length < 5
      if (!isJPG) {
        this.$message.error('上传头像图片只能是jpg、jpeg、png 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      if (!imageLength) {
        this.$message.error('最多上传图片5张')
        return false
      }
      return isJPG && isLt2M && imageLength
    },

    handleClick (tab) {
      if (tab.label == '集中式') {
        this.label = tab.label
      } else {
        this.label = tab.label
      }
    },
    /* 获取城市 */
    getCity () {
      let that = this
      let para = {
        page: that.page,
      }
      getCityList(para).then((res) => {
        let rescode = res.data.rescode
        let resmsg = res.data.resmsg
        let getData = res.data.data.cities
        getData[0] = '请选择'
        that.func.portInit(rescode, resmsg, function () {
          that.cityList = getData
        })
      }).catch(function (err) {
        console.log(err)
      })
    },

    /* 获取门店名称 */
    getStoreList () {
      let that = this
      let para = {
        city: that.city,
      }
      if (that.label == '分布式') {
        para.city = that.citySplice
      }
      getStoreList(para).then((res) => {
        let rescode = res.data.rescode
        let resmsg = res.data.resmsg
        let getData = res.data.data.stores
        getData.unshift({
          store_id: '',
          name: '请选择',
        })
        that.func.portInit(rescode, resmsg, function () {
          that.storesList = getData
        })
      }).catch(function (err) {
        console.log(err)
      })
    },
    searchCity () {
      let that = this
      that.addHome.store_id = ''
      let para = {
        city: that.city,
      }
      if (that.label == '分布式') {
        para.city = that.citySplice
      }
      that.getStoreList()
    },
    // 长租
    getLong () {
      let that = this
      let para = {
        rent_type: 'LONG',
        // store_id: that.addHome.store_id,
      }
      showTemplate(para).then((res) => {
        let rescode = res.data.rescode
        let resmsg = res.data.resmsg
        let getData = res.data.data
        getData.template.unshift({
          id: '',
          name: '请选择',
        })
        that.func.portInit(rescode, resmsg, function () {
          that.longList = getData.template
        })
      }).catch(function (err) {
        console.log(err)
      })
    },
    // 短租
    getshort () {
      let that = this
      let para = {
        rent_type: 'SHORT ',
        // store_id: that.addHome.store_id,
      }
      showTemplate(para).then((res) => {
        let rescode = res.data.rescode
        let resmsg = res.data.resmsg
        let getData = res.data.data
        getData.template.unshift({
          id: '',
          name: '请选择',
        })
        that.func.portInit(rescode, resmsg, function () {
          that.shortList = getData.template
        })
      }).catch(function (err) {
        console.log(err)
      })
    },
    // 预定
    getreserve () {
      let that = this
      let para = {
        rent_type: 'RESERVE ',
        // store_id: that.addHome.store_id,
      }
      showTemplate(para).then((res) => {
        let rescode = res.data.rescode
        let resmsg = res.data.resmsg
        let getData = res.data.data
        getData.template.unshift({
          id: '',
          name: '请选择',
        })
        that.func.portInit(rescode, resmsg, function () {
          that.reserveList = getData.template
        })
      }).catch(function (err) {
        console.log(err)
      })
    },

    // ---------------------------- 集中式 ------------------------------
    // 每一次点击按钮都会添加新的楼
    addNum () {
      this.params.push({
        building_name: '',
        layer_total: '',
        layer_room_number: '',
      })
    },
    searchName () {
      // 选择门店id后可以调用 合同模板
      let that = this
      that.getLong()
      that.getshort()
      that.getreserve()
    },
    submit () {
      let that = this
      that.addHome.buildings = that.params
      that.$confirm('确认提交吗？', '提示', {}).then(() => {
        that.listLoading = true
        let para = Object.assign({}, that.addHome)
        addunion(para).then((res) => {
          that.listLoading = false
          let rescode = res.data.rescode
          let resmsg = res.data.resmsg
          that.func.portInit(rescode, resmsg, function () {
            that.$message({
              message: '提交成功',
              type: 'success',
            })
            that.$router.push({
              path: '/roommanage',
            })
          })
        }).catch(function (err) {
          console.log(err)
        })
      }).catch(function () {
        that.listLoading = false
        that.$message({
          type: 'info',
          message: '已取消提交',
        })
      })
    },

    handlePictureCardPreview () {
      this.dialogVisible = true
    },

    searchNameSplice () {
      let that = this
      let para = {
        store_id: that.addHomes.store_id,
      }
      that.listLoading = true
      showCommunity(para).then((res) => {
        let rescode = res.data.rescode
        let resmsg = res.data.resmsg
        let getData = res.data.data
        getData.community.unshift({
          id: '',
          name: '请选择',
        })
        that.func.portInit(rescode, resmsg, function () {
          that.showCommunityList = getData.community
          that.listLoading = false
        })
      }).catch(function (err) {
        console.log(err)
      })
    },
    // 确定下面的房间个数
    roomNum () {
      if (this.addHomes.room_number == 1) {
        this.isShow2 = false
        this.isShow3 = false
      } else if (this.addHomes.room_number == 2) {
        this.isShow1 = true
        this.isShow2 = true
        this.isShow3 = false
      } else {
        this.isShow1 = true
        this.isShow2 = true
        this.isShow3 = true
      }
    },
    dialogFormVisibleone () {
      if (this.facility1.length != 0) {
        this.dialogFormVisible1 = false
        this.isShowicon1 = true
      } else {
        this.$message.error('您未选择配套设施')
        this.isShowicon1 = false
        this.dialogFormVisible1 = false
      }
    },
    dialogFormVisibleTwo () {
      if (this.facility2.length != 0) {
        this.dialogFormVisible2 = false
        this.isShowicon2 = true
      } else {
        this.$message.error('您未选择配套设施')
        this.isShowicon2 = false
        this.dialogFormVisible2 = false
      }
    },
    dialogFormVisibleTre () {
      if (this.facility3.length != 0) {
        this.dialogFormVisible3 = false
        this.isShowicon3 = true
      } else {
        this.$message.error('您未选择配套设施')
        this.isShowicon3 = false
        this.dialogFormVisible3 = false
      }
    },
    facilityo () {
      if (this.$refs.facility1 == undefined) {
        this.$message.error('请选择配套设施')
      } else {
        let facility1 = this.$refs.facility1.$el.children
        for (let i = 0; i < facility1.length; i++) {
          if (facility1[i].firstChild.firstChild.className.indexOf('is-checked') != -1) {
            let valueChecked = facility1[i].firstChild.firstChild.lastChild.value
            this.checkedList1[valueChecked] = '1'
          } else {
            let value = facility1[i].firstChild.firstChild.lastChild.value
            this.checkedList1[value] = '0'
          }
        }
        this.paramsSplice1.room_provides = JSON.stringify(this.checkedList1)
        this.addHomes.rooms.push(this.paramsSplice1)
      }
    },
    facilityt () {
      if (this.$refs.facility2 == undefined || this.$refs.facility1 == undefined) {
        this.$message.error('请选择配套设施')
      } else {
        let facility2 = this.$refs.facility2.$el.children
        for (let i = 0; i < facility2.length; i++) {
          if (facility2[i].firstChild.firstChild.className.indexOf('is-checked') != -1) {
            let valueChecked = facility2[i].firstChild.firstChild.lastChild.value
            this.checkedList2[valueChecked] = '1'
          } else {
            let value = facility2[i].firstChild.firstChild.lastChild.value
            this.checkedList2[value] = '0'
          }
        }
        this.paramsSplice2.room_provides = JSON.stringify(this.checkedList2)
        this.addHomes.rooms.push(this.paramsSplice2)
      }
    },
    facilitys () {
      if (this.$refs.facility3 == undefined || this.$refs.facility2 == undefined || this.$refs.facility1 == undefined) {
        this.$message.error('请选择配套设施')
      } else {
        let facility3 = this.$refs.facility3.$el.children
        for (let i = 0; i < facility3.length; i++) {
          if (facility3[i].firstChild.firstChild.className.indexOf('is-checked') != -1) {
            let valueChecked = facility3[i].firstChild.firstChild.lastChild.value
            this.checkedList3[valueChecked] = '1'
          } else {
            let value = facility3[i].firstChild.firstChild.lastChild.value
            this.checkedList3[value] = '0'
          }
        }
        this.paramsSplice3.room_provides = JSON.stringify(this.checkedList3)
        this.addHomes.rooms.push(this.paramsSplice3)
      }
    },

    submits () {
      let that = this
      // 根据房间数量的不同,所需要的配套设施也就不同
      if (that.addHomes.room_number == 1) {
        that.facilityo()
      } else if (that.addHomes.room_number == 2) {
        if (this.$refs.facility2 !== undefined) {
          that.facilityo()
        }
        that.facilityt()
      } else {
        if (this.$refs.facility3 !== undefined && this.$refs.facility2 !== undefined) {
          that.facilityo()
        }
        if (this.$refs.facility3 !== undefined) {
          that.facilityt()
        }
        that.facilitys()
      }
      let para = Object.assign({}, that.addHomes)
      if (Number(para.layer_total) < Number(para.layer)) {
        that.$message.error('所在层不能大于总层数')
      } else if (isNaN(Number(para.layer_total)) || isNaN(Number(para.layer))) {
        that.$message.error('层数必须是数字')
      } else {
        if (that.addHomes.rooms.length !== 0) {
          that.$confirm('确认提交吗？', '提示', {}).then(() => {
            that.listLoading = true
            addDot(para).then((res) => {
              that.listLoading = false
              let rescode = res.data.rescode
              if (rescode == 0) {
                that.$message({
                  message: '提交成功',
                  type: 'success',
                })
                that.$refs['addHomes'].resetFields()
                that.$router.push({
                  path: '/roommanage',
                })
              }
            }).catch(function (err) {
              console.log(err)
            })
          }).catch(function () {
            that.listLoading = false
            that.$message({
              type: 'info',
              message: '已取消提交',
            })
          })
        }
      }
    },
  },

}
</script>
