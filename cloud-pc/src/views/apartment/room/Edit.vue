<template>
  <section class="fx-pages-main editHome-type">
    <!--工具条-->
    <el-form v-loading="listLoading" label-width="100px">
      <span class="info-upload-titles">房间信息</span>
      <el-form-item label="地址:">
        {{room.province}}{{room.city}}{{room.district}}{{room.store_name}}
      </el-form-item>
      <el-form-item label="">
        <el-col :span="3">
          户型:{{room.room_type}}
        </el-col>
        <el-col :span="3">
          面积:{{room.area}}
        </el-col>
        <el-col :span="3">
          朝向:{{room.toward}}
        </el-col>
        <el-col :span="3">
          所在楼层:{{room.layer}}
        </el-col>
        <el-col :span="3">
          标准租金:{{room.rent_price}}
        </el-col>
        <el-col :span="3">
          物业费：{{room.property_price}}
        </el-col>
        <el-col :span="6">
          描述{{room.description}}
        </el-col>
      </el-form-item>
    <span class="info-upload-titles">配套设施</span>
    <el-form-item label="" class="facility">
        <el-checkbox-group class="checkBox" v-model="facility" ref='temdata'>
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
      </el-form-item>
      <br>
      <el-button type="primary" class="sub-btn" @click="submits" v-loading="listLoading">确定</el-button>
    </el-form>
  </section>
</template>
<script type="text/javascript">
import { getRoom, editRoom } from '@/api/api'
export default {
  data () {
    return {
      room_id: '',
      longList: [],
      listLoading: false,
      shortList: [],
      reserveList: [],
      facility: [],
      room: {
        roomtype: {},
        store: {},
        community: {},
        house: {},
      },
      roomList: {
        room_id: '',
        provides: {},
      },
    }
  },
  created () {
    this.room_id = this.$route.query.room_id
    this.getUnion()
  },
  mounted () {

  },
  methods: {
    // 查看房间
    getUnion () {
      let that = this

      that.listLoading = true
      getRoom(that.room_id).then(res => {
        that.listLoading = false
        // res.room.description = JSON.parse(res.description);

        that.room = res
        that.room.toward = that.towardT(res.toward)
      }).catch(err => {
        console.log(err)
      })
      // getUnion(para).then((res) => {
      //   if(res.data.rescode == 0) {
      //     let getData = res.data.data.room
      //     if(getData.roomtype != null) {
      //       getData.roomtype.toward = that.towardT(getData.roomtype.toward);
      //     } else {
      //       getData.roomtype = {}
      //     }
      //     getData.feature = that.func.featureTra(getData.feature);
      //     getData.provides = JSON.parse(getData.provides);
      //     for(let key in getData.provides) {
      //       if(getData.provides[key] == "1") {
      //         that.facility.push(key);
      //       }
      //     }
      //     that.room = getData;
      //     that.listLoading = false;
      //   }
      // });
    },
    // 房间朝向的转化
    towardT (toward) {
      if (toward == 'E') {
        toward = '东'
      } else if (toward == 'W') {
        toward = '西'
      } else if (toward == 'S') {
        toward = '南'
      } else if (toward == 'N') {
        toward = '北'
      } else if (toward == 'EW') {
        toward = '东西'
      } else if (toward == 'SN') {
        toward = '南北'
      }
      return toward
    },
    // 提交房间编辑
    submits () {
      let that = this
      that.$confirm('确认提交吗？', '提示', {}).then(() => {
        that.addLoading = true
        // 对房型设施进行定义
        let temdata = that.$refs.temdata.$el.children
        for (let i = 0; i < temdata.length; i++) {
          if (temdata[i].firstChild.firstChild.className.indexOf('is-checked') != -1) {
            let valueChecked = temdata[i].firstChild.firstChild.lastChild.value
            that.roomList.provides[valueChecked] = '1'
          } else {
            let value = temdata[i].firstChild.firstChild.lastChild.value
            that.roomList.provides[value] = '0'
          }
        }
        let provides = ''
        let id = that.room_id
        provides = JSON.stringify(that.roomList.provides)
        let para = Object.assign({}, that.roomList)
        para.room_id = that.room_id
        para.provides = provides
        editRoom(id, para).then(res => {
          that.addLoading = false
          that.$message({
            message: '提交成功',
            type: 'success',
          })
          that.$router.push({
            path: '/roommanage',
          })
        }).catch(err => {
          console.log(err)
        })
        // submitUnion(para).then((res) => {
        //   that.addLoading = false;
        //   let rescode = res.data.rescode,
        //     resmsg = res.data.resmsg;
        //   that.func.portInit(rescode, resmsg, function() {
        //     that.$message({
        //       message: '提交成功',
        //       type: 'success'
        //     });
        //     that.$router.push({
        //       path: '/roommanage'
        //     })
        //   })
        // }).catch(function(err) {
        //   console.log(err)
        // });
      }).catch(() => {
        that.addLoading = false
        this.$message({
          type: 'info',
          message: '已取消提交',
        })
      })
    },
  },
}
</script>
