<template>
  <div class="wrapper">
    <block v-if="cartGoods.length">
      <!-- 收货信息 -->
      <dl class="shipment">
        <block v-if="selectedAddressData">
          <dt>收货人: </dt>
          <dd class="meta">
            <span class="name">{{selectedAddressData.userName}}</span>
            <span class="phone">{{selectedAddressData.telNumber}}</span>
          </dd>
          <dt>收货地址:</dt>
          <dd>{{concatSelectedAddressDataInfo}}</dd>
        </block>
        <button type="primary" @click="selectAddress" v-else>选择收货地址</button>
      </dl>
      <!-- 购物车 -->
      <div class="carts">
        <div class="item">
          <!-- 店铺名称 -->
          <div class="shopname">优购生活馆</div>
          <div class="goods" v-for="(cartGoodsItem,index) in cartGoods" :key="cartGoodsItem.goods_id">
            <!-- 商品图片 -->
            <image class="pic" :src="cartGoodsItem.goods_small_logo"></image>
            <!-- 商品信息 -->
            <div class="meta">
              <p class="name">{{cartGoodsItem.goods_name}}</p>
              <p class="price"><span>￥</span>{{cartGoodsItem.goods_price}}<span>.00</span></p>
              <!-- 加减 -->
              <div class="amount">
                <span class="reduce" @click="changeNumber(-1,index)">-</span>
                <input type="number" :value="cartGoodsItem.goods_number" class="number">
                <span class="plus" @click="changeNumber(1,index)">+</span>
              </div>
            </div>
            <!-- 选框 -->
            <span class="checkbox" @click="toggle(index)">
              <icon type="success" size="20" :color="cartGoodsItem.goods_checked ? '#ea4451' : '#ccc'" ></icon>
            </span>
          </div>
        </div>
      </div>
      <!-- 其它 -->
      <div class="extra">
        <label class="checkall">
          <icon type="success" @click="checkAll" :color="((cartGoods.length === gainSelectedGoods.length) || checkAllOrCancelCheckAll) ? '#ea4451' : '#ccc'" size="20"></icon>
          全选
        </label>
        <div class="total">
          合计: <span>￥</span><label>{{amount}}</label><span>.00</span>
        </div>
        <div class="pay" @click="payment">结算({{gainSelectedGoods.length}})</div>
      </div>
    </block>
    <block v-else><div class="tips">我爱你三千遍~</div></block>
  </div>
</template>



<script>

  // 导入对 wx.request 的 Promise 封装版本
  import promiseRequest from "@/utility/package_promise_request"

  export default {

    onShow () {
      
      // 实时获取本地存储的数据
      this.cartGoods = mpvue.getStorageSync('carts') || [];

    },

    data () {
      return {

        // 用户选中的收获地址信息数据
        selectedAddressData: null,

        // 用户添加到购物车的数据
        cartGoods: mpvue.getStorageSync("carts") || [],

        // 全选与取消全选状态数据
        checkAllOrCancelCheckAll: true
        
      }
    },

    methods: {

      // 选择收获地址方法
      selectAddress () {
        mpvue.chooseAddress({
          success: (selectedAddressInfo) => {
            console.log(selectedAddressInfo)
            this.selectedAddressData = selectedAddressInfo
          }
        })
      },

      // 对购物车的数量进行加减操作的方法
      changeNumber (step,index) {
        
        // 最少购买一件
        if(step == -1 && this.cartGoods[index].goods_number <= 1) {
          return mpvue.showToast({title: '至少买一件'});
        }

        // 最多不能超过库存
        if(step == 1 && this.cartGoods[index].goods_number >= 10) {
          return mpvue.showToast({title: '不能超过库存'});
        }

        // 对索引值为 index 的商品 增减数量
        // console.log(index)
        this.cartGoods[index].goods_number += step;

      },

      // 切换购物车商品选中的状态
      toggle (index) {
        // console.log(11111)
        this.cartGoods[index].goods_checked = !this.cartGoods[index].goods_checked;
      },

       // 全选操作
      checkAll () {
        this.checkAllOrCancelCheckAll = !this.checkAllOrCancelCheckAll
        this.cartGoods.forEach((item)=>{
          item.goods_checked = this.checkAllOrCancelCheckAll
        })
      },

      // 结算功能方法
      payment () {

        // 检测是否登录（本地是否有 token）
        // if(!mpvue.getStorageSync('token')) {
        //   return mpvue.navigateTo({url: '/pages/author/main'});
        // }

        // 用户是否填写收货地址
        if(!this.concatSelectedAddressDataInfo) {
          return mpvue.showToast({title: '收货地址必填!'});
        }

        // 用户是否选中商品
        if(!this.gainSelectedGoods.length) {
          return mpvue.showToast({title: '至少买一件'});
        }

        // // 完成结算操作
        // const {message, meta} = await promiseRequest({
        //   url: '/api/public/v1/my/orders/create',
        //   method: 'post',
        //   // 登录令牌
        //   header: {Authorization: mpvue.getStorageSync('token')},
        //   data: {
        //     order_price: this.amount,
        //     consignee_addr: this.concatSelectedAddressDataInfo,
        //     goods: this.gainSelectedGoods
        //   }
        // })

        // // 创建订单成功
        // if(meta.status == 200) return mpvue.navigateTo({url: '/pages/order/main'});

      }

    },

    computed: {
      
      concatSelectedAddressDataInfo () {
        return this.selectedAddressData && (this.selectedAddressData.provinceName + 
                                                this.selectedAddressData.cityName + 
                                                    this.selectedAddressData.countyName + 
                                                        this.selectedAddressData.detailInfo)
      },

      // 提取出来在购物车中已勾选选中的商品
      gainSelectedGoods () {
        // console.log(222222)

        return this.cartGoods.filter((item)=>{
          return item.goods_checked
        })

      },

      // 判断选中的商品个数与购物车中商品的个数
      selectedGoodsISEqualCartGoods () {
        if(!(this.gainSelectedGoods.length === this.cartGoods.length)) 
          this.checkAllOrCancelCheckAll = false
        return this.gainSelectedGoods.length === this.cartGoods.length
      },

      // 解决bug   --->   bug是:  不好描述  就这样吧
      hello () {
        this.checkAllOrCancelCheckAll = this.selectedGoodsISEqualCartGoods
      },

      // 计算购物车金额
      amount () {
        let total = 0;
        this.gainSelectedGoods.forEach((item)=>{
          total += item.goods_number * item.goods_price
        })
        return total
      }

    }
    
  }
</script>



<style scoped lang="less">

  .tips {
    text-align: center;
    font-size: 40rpx;
    color: #666;
    margin-top: 200rpx;
  }

  .shipment {
    height: 100rpx;
    line-height: 2;
    padding: 30rpx 30rpx 40rpx 30rpx;
    font-size: 27rpx;
    color: #333;
    background-color: #fff;
    background-image: url(https://ugo2.oss-cn-hangzhou.aliyuncs.com/images/cart_border%402x.png);
    background-size: contain;
    background-repeat: no-repeat;
    background-position: bottom;

    dt {
      width: 140rpx;
      float: left;
      clear: both;
    }

    dd {
      padding-left: 160rpx;
    }

    .meta {
      padding-right: 50rpx;
    }

    span.phone {
      float: right;
    }
  }

  .carts {
    background-color: #f4f4f4;
    padding-bottom: 110rpx;
    overflow: hidden;

    .item {
      margin-top: 20rpx;
    }
    
    .shopname {
      padding: 30rpx;
      font-size: 30rpx;
      color: #333;
      background-color: #fff;
      border-top: 1rpx solid #eee;
      border-bottom: 1rpx solid #eee;
    }

    .goods {
      display: flex;
      padding: 30rpx 20rpx 30rpx 0;
      margin-left: 100rpx;
      border-bottom: 1rpx solid #eee;
      background-color: #fff;
  
      position: relative;

      span.checkbox {
        display: block;
        width: 101rpx;
        height: 100%;
        background-color: #fff;

        display: flex;
        justify-content: center;
        align-items: center;

        position: absolute;
        left: -100rpx;
        top: 0;
      }

      &:last-child {
        border-bottom: none;
      }

      .pic {
        width: 200rpx;
        height: 200rpx;
        margin-right: 30rpx;
      }

      .meta {
        flex: 1;
        font-size: 27rpx;
        color: #333;
        position: relative;
      }

      .name {
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }

      .price {
        position: absolute;
        bottom: 0;

        color: #ea4451;
        font-size: 33rpx;

        span {
          font-size: 22rpx;
        }
      }

      .amount {
        position: absolute;
        bottom: 0;
        right: 20rpx;

        height: 48rpx;
        text-align: center;
        border: 1rpx solid #ddd;
        border-radius: 8rpx;

        display: flex;
        align-items: center;

        span {
          display: block;
          width: 60rpx;
          line-height: 48rpx;
          font-size: 36rpx;
          color: #ddd;
          text-align: center;
        }

        input {
          width: 60rpx;
          height: 48rpx;
          min-height: 48rpx;
          font-size: 27rpx;
          border-left: 1rpx solid #ddd;
          border-right: 1rpx solid #ddd;
        }
      }
    }
  }

  .extra {
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 9;

    width: 750rpx;
    height: 96rpx;
    text-align: center;
    line-height: 96rpx;
    font-size: 36rpx;
    border-top: 1rpx solid #eee;
    background-color: #fff;
    color: #333;
    
    display: flex;

    .checkall {
      width: 140rpx;
      line-height: 1;
      margin-left: 25rpx;
      display: flex;
      align-items: center;

      icon {
        margin-right: 20rpx;
      }
    }

    .total {
      display: flex;
      justify-content: center;
      flex: 1;

      label, span {
        color: #ea4451;
        vertical-align: bottom;
        position: relative;
        bottom: -2rpx;
      }

      span {
        position: relative;
        bottom: -3rpx;
        font-size: 24rpx;

        &:first-child {
          margin-left: 10rpx;
        }
      }
    }

    .pay {
      width: 200rpx;
      background-color: #ea4451;
      color: #fff;
    }

  }
</style>

