<template>
  <section class="fx-pages-main">
    <div class="fillcontain">
      <el-dropdown @command="handleDashBoard">
        <div class="el-dropdown-link">
          <div class="label">城市：</div>
          <el-input v-model="cityValue" :placeholder="cityValue"></el-input>
          <i class="el-icon-arrow-down el-icon--right"></i>
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="item in options" v-text="item.value" :command="item.label" :key="item.value">
            {{item.name}}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-dropdown>
        <div class="el-dropdown-link">
          <div class="label">公寓：</div>
          <el-input v-model="apartmentValue" :placeholder="apartmentValue"></el-input>
          <i class="el-icon-arrow-down el-icon--right"></i>
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="item in apartmentOptions" v-text="item.value" :command="item.label" :key="item.value">
            {{item.name}}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-row :gutter="20" class="room-tip">
        <el-col :span="4">
          <div class="grid-content bg-purple">
            空闲房间数：12
          </div>
        </el-col>
        <el-col :span="4">
          <div class="grid-content bg-purple">
            预约房间数：85
          </div>
        </el-col>
        <el-col :span="4">
          <div class="grid-content bg-purple">
            已出租房间数：985
          </div>
        </el-col>
        <el-col :span="4">
          <div class="grid-content bg-purple">
            欠费房间数：12
          </div>
        </el-col>
        <el-col :span="4">
          <div class="grid-content bg-purple">
            申请退房房间数：52
          </div>
        </el-col>
        <el-col :span="4">
          <div class="grid-content bg-purple">
          </div>
        </el-col>
      </el-row>

      <el-row :gutter="20" class="room-status">
        <el-col :span="6">
          <div class="grid-content bg-purple">
            <span>已租</span>
            <span class="status yello"></span>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple">
            <span>空闲</span>
            <span class="status white"></span>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple">
            <span>申请退房</span>
            <span class="status blue"></span>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple">
            <span>欠费</span>
            <span class="status red"></span>
          </div>
        </el-col>
      </el-row>

      <!-- 显示房间详情 -->
      <el-popover ref="popover" placement="right" width="800" trigger="click">
        <el-table :data="gridData">
          <el-table-column width="150" property="date" label="日期"></el-table-column>
          <el-table-column width="100" property="name" label="姓名"></el-table-column>
          <el-table-column width="300" property="address" label="地址"></el-table-column>
        </el-table>
      </el-popover>
      <div class="table_container">
        <table border="1" cellspacing="0" cellpadding="0" style="width: 100%">
          <tr v-for="first in tableData" track-by="$index">
            <th>{{first.floor}}层</th>
            <td v-for="second in first.arr">
              <el-button v-popover:popover>{{second.number}}</el-button>
            </td>
          </tr>
        </table>
        <div class="Pagination" style="text-align: center;margin-top: 10px;">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-size="20"
            layout="total, prev, pager, next" :total="count">
          </el-pagination>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  data () {
    return {
      tableData: [{
        floor: '11',
        arr: [{
          id: 1101,
          number: 1101,
          tag: '已租',
        }, {
          id: 1102,
          number: 1102,
          tag: '欠费',
        }, {
          id: 1103,
          number: 1103,
          tag: '申请退房',
        } ],
      }, {
        floor: '12',
        arr: [{
          id: 1201,
          number: 1201,
          tag: '申请退房',
        }, {
          id: 1302,
          number: 1302,
          tag: '欠费',
        }, {
          id: 1203,
          number: 1203,
          tag: '申请退房',
        } ],
      }, {
        floor: '13',
        arr: [{
          id: 1301,
          number: 1301,
          tag: '申请退房',
        }, {
          id: 1302,
          number: 1302,
          tag: '欠费',
        }, {
          id: 1303,
          number: 1303,
          tag: '申请退房',
        } ],
      }, {
        floor: '14',
        arr: [{
          id: 1401,
          number: 1401,
          tag: '欠费',
        }, {
          id: 1402,
          number: 1402,
          tag: '欠费',
        }, {
          id: 1403,
          number: 1403,
          tag: '已租',
        } ],
      } ],
      options: [{
        value: '请选择',
        label: '请选择',
      }, {
        value: '上海市',
        label: '上海市',
      }, {
        value: '杭州市',
        label: '杭州市',
      }, {
        value: '深圳市',
        label: '深圳市',
      } ],
      cityValue: '请选择',
      apartmentOptions: [],
      apartmentValue: '请选择',
      currentRow: null,
      offset: 0,
      limit: 20,
      count: 0,
      currentPage: 1,
      gridData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄',
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄',
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄',
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄',
      } ],
    }
  },

  components: {

  },

  created () {
    this.initData()
  },

  methods: {
    async initData () {
      try {
        const countData = await getUserCount()
        if (countData.status == 1) {
          this.count = countData.count
        } else {
          throw new Error('获取数据失败')
        }
        // this.getUsers();
      } catch (err) {
        console.log('获取数据失败', err)
      }
    },

    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`)
    },

    handleCurrentChange (val) {
      this.currentPage = val
      this.offset = (val - 1) * this.limit
      // this.getUsers()
    },
    // async getUsers(){
    //     const Users = await getUserList({offset: this.offset, limit: this.limit});
    //     this.tableData = [];
    //     Users.forEach(item => {
    //         const tableData = {};
    //         tableData.username = item.username;
    //         tableData.registe_time = item.registe_time;
    //         tableData.city = item.city;
    //         this.tableData.push(tableData);
    //     })
    // },

    handleDashBoard (e) { /* 选择城市 */
      this.cityValue = e
    },
  },
}
</script>
