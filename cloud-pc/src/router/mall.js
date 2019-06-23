import Home from '@/views/Home.vue'

/* 商城 */
// 分类
import ClassIficationList from '@/views/mall/classification/List.vue' /* 商品分类 */
import ClassificationAdd from '@/views/mall/classification/Add.vue' /* 添加分类 */

// 商品
import ShopList from '@/views/mall/shop/List.vue' /* 商品管理 */
import ShopAdd from '@/views/mall/shop/Add.vue' /* 添加商品 */
import ShopEdit from '@/views/mall/shop/Edit.vue' /* 编辑商品 */
import ShopOrder from '@/views/mall/shop/Order.vue' /* 商品订单 */

// 商品轮播
import RotationList from '@/views/mall/rotation/List.vue' /* 商品轮播 */
import RotationAdd from '@/views/mall/rotation/Add.vue' /* 添加商品轮播 */

// 商品支付
import paymentRecord from '@/views/mall/payment/Record.vue' /* 商品支付记录 */


export default {
  path: '/',
  component: Home,
  name: '商城',
  iconCls: 'iconfont icon-ali-shangcheng',
  children: [
    { path: '/classification',
      component: ClassIficationList,
      name: '商品分类',
      meta: {
        desc: '商品分类：您可以创建不同类型的商品，如生活日用品、家用电器、家纺等，并可设置该类型的商品是否在住户的微信公众号中的商城中是否显示或显示顺序。',
      },
    },
    { path: '/addclassification',
      component: ClassificationAdd,
      name: '添加商品分类',
      hidden: true,
      meta: {
        desc: '商品分类：您可以创建不同类型的商品，如生活日用品、家用电器、家纺等，并可设置该类型的商品是否在住户的微信公众号中的商城中是否显示或显示顺序。',
      }
    },
    { path: '/administration',
      component: ShopList,
      name: '商品管理',
      meta: {
        desc: '商品：您可以创建各式各样的商品，并设置商品的价格、库存、上架状况，创建好的商品会展示在住户的微信公众号中的商城菜单里。',
      }
    },
    { path: '/addshop',
      component: ShopAdd,
      name: '添加商品',
      hidden: true,
      meta: {
        desc: '商品：您可以创建各式各样的商品，并设置商品的价格、库存、上架状况，创建好的商品会展示在住户的微信公众号中的商城菜单里。',
      }
    },
    { path: '/editshop',
      component: ShopEdit,
      name: '编辑商品',
      hidden: true,
      meta: {
        desc: '商品：您可以创建各式各样的商品，并设置商品的价格、库存、上架状况，创建好的商品会展示在住户的微信公众号中的商城菜单里。',
      }
    },
    { path: '/commodityorder',
      component: ShopOrder,
      name: '商品订单',
      meta: {
        desc: '商品订单：您可以查看所有的商品订单，了解购买商品的住户信息、支付状态以及商品的配送状态。',
      }
    },
    { path: '/rotation',
      component: RotationList,
      name: '商品轮播',
    },
    { path: '/addRotation',
      component: RotationAdd,
      name: '添加轮播',
      hidden: 'true'
    },
    { path: '/paymentRecord',
      component: paymentRecord,
      name: '商品支付记录'
    },
  ]
}
