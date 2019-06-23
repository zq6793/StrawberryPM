
import { storeType, storeStatus, contractType, deviceType, roomNumber, hallNumber, cookNumber, toiletNumber, directionNumber, roomFeature, deviceStatus } from './apartment'
import { vacancyDays, adjPriceType, visitType, visitStatus, contractStatus, cardType } from './operate'
import { waterElectType, waterElectStatus, feeTypes, expenseStatusOption, payWays, billPayStatus, withdrawType } from './finance'
import { staffJobStatus } from './jurisdiction'
import { activeType, preferentialMethod, preferentialuseRange } from './marketing'
import { serviceTypeOptions, serviceStatusOptions } from './service'
import { holdBySelf, seasonChoose, proprietorPayStatus } from './proprietor'
import { shelfStatus } from './mall'


// 房源 apartment
export const storeTypeList = storeType /* 门店类型 */
export const storeStatusList = storeStatus /* 门店状态 */
export const contractTypeList = contractType /* 合同模板类型 */
export const deviceTypeList = deviceType /* 设备类型 */
export const deviceSatusList = deviceStatus /* 设备状态 */

// 运营 operate
export const vacancyDaysList = vacancyDays /* 空置天数 */
export const adjPriceTypeList = adjPriceType /* 调价类型 */
export const visitTypeList = visitType /* 来访类型 */
export const visitStatusList = visitStatus /* 来访状态转换 */
export const contractStatusList = contractStatus /* 合同状态 */
export const cardTypeList = cardType /* 住户证件类型 */

// 财务 finance
export const waterTypeList = waterElectType /* 水电类型 */
export const waterStatusList = waterElectStatus /* 水电状态 */
export const feeTypeList = feeTypes /* 费用类型 */
export const expenseStatusList = expenseStatusOption /* 下拉菜单支付状态 */
export const payWayList = payWays /* 支付方式 */
export const payStatusList = billPayStatus /* 支付状态页面展示 */
export const withdrawTypeList = withdrawType /* 退房类型 */

// 权限 jurisdiction
export const staffJobStatusList = staffJobStatus /* 员工在职状态 */

// 营销 marketing
export const activeTypeList = activeType /* 活动类型 */
export const preferentialMethodList = preferentialMethod /* 优惠方式 */
export const useRangeList = preferentialuseRange /* 优惠使用范围 */

// 服务 service
export const serviceTypeList = serviceTypeOptions /* 下拉菜单服务类型 */
export const serviceStatusList = serviceStatusOptions /* 下拉菜单服务订单处理情况 */

// 商城 mall
export const shelfStatusList = shelfStatus /* 下拉菜单是否上架 */

// 小业主 proprietor
export const holdBySelfList = holdBySelf /* 是否本人持有 */
export const seasonChooseList = seasonChoose /* 选择季度 */
export const proprietorPayStatusList = proprietorPayStatus /* 支付状态 */

// 房型面积 户型特点
export const roomNumberList = roomNumber /* 户型特点 室 */
export const hallNumberList = hallNumber /* 户型特点 厅 */
export const cookNumberList = cookNumber /* 户型特点 厨 */
export const toiletNumberList = toiletNumber /* 户型特点 卫 */
export const directionList = directionNumber /* 户型特点 朝向 */
export const roomFeatureList = roomFeature /* 房间类型 */
