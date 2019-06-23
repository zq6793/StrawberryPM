<template>
  <section class="fx-pages-main list_device">
    <!--工具条-->
    <el-form :inline="true" class="fx-table-sort-head">
      <el-form-item size="small">
        <city-store-select :route-query="true" @set="refresh"></city-store-select>
      </el-form-item>
      <el-form-item prop="device_type" size="small">
        <device-type-select :route-query="true" @set="refresh"></device-type-select>
      </el-form-item>
      <el-form-item class="searchs" size="small">
        <text-search :route-query="true" :options="searchOptions" @set="refresh"></text-search>
      </el-form-item>
    </el-form>
    <!--列表-->
    <el-table :data="smartDevice" highlight-current-row style="width: 100%;" v-loading="listLoading" border tooltip-effect="dark">
      <el-table-column type="selection">
      </el-table-column>
      <!-- <el-table-column prop="id" label="设备ID">
      </el-table-column> -->
      <el-table-column prop="room.store.name" label="门店名称" width="220">
      </el-table-column>
      <el-table-column prop="room.number" label="房间号">
      </el-table-column>
      <el-table-column prop="supplier" label="供应商">
      </el-table-column>
      <el-table-column prop="type" label="设备类型">
      </el-table-column>
      <el-table-column label="详情" width="53">
        <template slot-scope="scope">
          <el-button type="text" @click="handleEdit(scope.$index, scope.row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <pagination-select :route-query="true" :total="total" @set="refresh"></pagination-select>
    </el-col>
  </section>
</template>
<script type="text/javascript">
import { CityStoreSelect, TextSearch, PaginationSelect } from '@/components/selects'
import { DeviceTypeSelect } from '@/components/apartment'
import { smartDevices } from '@/api/api'
export default {
  components: {
    CityStoreSelect,
    PaginationSelect,
    TextSearch,
    DeviceTypeSelect,
  },
  data() {
    return {
      room_number: '',
      smartDevice: [],
      total: 0,
      listLoading: false,
      searchOptions: [
        { label: '房间号', key: 'room_number' },
        // { label: '房型特点', key: 'search' },
      ],
    }
  },
  mounted() {
    this.getSmartDevices()
  },
  methods: {
    refresh () {
      this.getSmartDevices()
    },

    /* 获取智能设备管理列表 */
    getSmartDevices() {
      let that = this
      let para = this.queryOption()
      that.listLoading = true
      smartDevices(para).then((res) => {
        let rescode = res.data.rescode
        let resmsg = res.data.resmsg
        let getData = res.data.data
        for (let key in getData.list) {
          getData.list[key].type = that.deviceType(getData.list[key].type)
          getData.list[key].supplier = that.supplierTra(getData.list[key].supplier)
        }
        that.func.portInit(rescode, resmsg, function() {
          that.smartDevice = getData.list
          that.total = getData.count
          that.listLoading = false
        })
      }).catch(function(err) {
        console.log(err)
      })
    },
    // 门锁厂商转化
    supplierTra(supplier) {
      if (supplier == 'CJOY') {
        supplier = '超仪'
      } else if (supplier == 'DANBAY') {
        supplier = ' 蛋贝'
      } else if (supplier == 'YEEUU') {
        supplier = ' 云柚'
      } else {
        supplier = '未知'
      }
      return supplier
    },

    /* 设备类型转换 */
    deviceType(text) {
      switch (text) {
        case 'LOCK':
          text = '门锁'
          break
        case 'HOT_WATER_METER':
          text = '热水表'
          break
        case 'COLD_WATER_METER':
          text = '冷水表'
          break
        case 'ELECTRIC_METER':
          text = '电表'
          break
      }
      return text
    },

    /* 导出数据 */
    exportData() {

    },

    /* 详情 */
    handleEdit(index, row) {
      let that = this
      if (row.type === '门锁') {
        row.type = 'LOCK'
      } else if (row.type === '热水表') {
        row.type = 'HOT_WATER_METER'
      } else if (row.type === '冷水表') {
        row.type = 'COLD_WATER_METER'
      } else if (row.type === '电表') {
        row.type = 'ELECTRIC_METER'
      } else {}
      that.$router.push({
        path: '/detailspage',
        query: {
          id: row.id,
          type: row.type,
          number: row.room.number,
          room_id: row.room.id,
        },
      })
    },
  },
}

</script>
