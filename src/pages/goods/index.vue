<template>
  <div class="wrapper" v-if="currentGoodsDetailData">
    <!-- 商品图片 -->
    <swiper class="pics" indicator-dots indicator-color="rgba(255, 255, 255, 0.6)" indicator-active-color="#fff">
      <swiper-item v-for="(item,index) in currentGoodsDetailData.pics" :key="index" >
        <image :src="item.pics_big"></image>
      </swiper-item>
    </swiper>
    <!-- 基本信息 -->
    <div class="meta">
      <p class="price">￥{{currentGoodsDetailData.goods_price}}</p>
      <p class="name">{{currentGoodsDetailData.goods_name}}</p>
      <p class="shipment">快递: 免运费</p>
      <span class="collect">收藏</span>
    </div>
    <!-- 商品详情 -->
    <div class="detail">
      <rich-text :nodes="currentGoodsDetailData.goods_introduce" >

              <!-- <div v-html="goods.goods_introduce"></div> -->
        
      </rich-text>
    </div>
    <!-- 操作 -->
    <div class="action">
      <button open-type="contact">联系客服</button>
      <span class="cart" @click="goCart">购物车</span>
      <span class="add" @click="addCart">加入购物车</span>
      <span class="buy">立即购买</span>
    </div>
  </div>
</template>


<script>

  // 导入对 wx.request 的 Promise 封装版本
  import promiseRequest from "@/utility/package_promise_request"

  // 导入使用promise进行封装的延时函数   --->   promise封装异步代码  --->  配合async await使其能变成同步的效果 
  import sleep from "@/utility/sleep"

  export default {

    // 拿到当前页面参数 商品的ID值
    onLoad (query) {
      
      // 获取当前商品详情
      this.gainCurrentGoodsDetail(query.id)

    },

    data () {
      return {
        
        // 当前商品详情数据对象
        currentGoodsDetailData: null,

        // 初始购物车数据
        carts: mpvue.getStorageSync('carts') || []

      }
    },

    methods: {

      // 获取当前商品详情数据的方法
      async gainCurrentGoodsDetail (goodsId) {
        const gainCurrentGoodsDetailResult = await promiseRequest({
          url : "/api/public/v1/goods/detail",
          data : {goods_id: goodsId}
        })
        // console.log(gainCurrentGoodsDetailResult)
        this.currentGoodsDetailData = gainCurrentGoodsDetailResult.message
        // console.log(gainCurrentGoodsDetailResult.message)

      },

      // 添加购物车
      async addCart () {
        
        // 提取商品相关信息
        const {
          goods_id,
          goods_price,
          goods_name,
          goods_small_logo
        } = this.currentGoodsDetailData

        // 遍历查找购物车中是否存在某商品
        let flag = false;
        this.carts.forEach((val) => {
          if(val.goods_id == goods_id) {

            // 购物车中已存在某个商品
            flag = true;
            val.goods_number += 1;
            return;

          }
        })

        // 添加到本地购物车的数据
        if(!flag) {
          this.carts.push({
            goods_id,
            goods_price,
            goods_name,
            goods_small_logo,
            goods_number: 1,
            goods_checked: true
          });
        }

        // 存入本地
        mpvue.setStorageSync('carts', this.carts);

        // 提示信息
        mpvue.showToast({title: '加入成功!'});

        // 让程序睡一会~
        await sleep(3000)

        console.log("I love you three thousand times...")
        console.log("我爱你三千遍~")
        console.log("I love you three thousand times...")

      },

      // 去购物车
      goCart () {

        // 小程序中如果要跳转的页面为 配置中的 tabBar
        // 那么只能通过 wx.switchTab 实现
        mpvue.switchTab({
          url: '/pages/cart/main'
        })
        
      }

    },

  }
</script>



<style scoped lang="less">

  .wrapper {
    margin-bottom: 100rpx;
    background-color: #f4f4f4;
  }

  .pics {
    height: 720rpx;
  }
  
  .meta {
    height: 270rpx;
    line-height: 1;
    padding: 30rpx 180rpx 30rpx 20rpx;
    box-sizing: border-box;
    background-color: #fff;
    position: relative;

    .price {
      font-size: 36rpx;
      color: #ea4451;
      margin-bottom: 30rpx;
    }

    .name {
      color: #333;
      line-height: 1.4;
      font-size: 33rpx;

      // 多行文本之显示省略号...
      overflow: hidden;
      text-overflow: ellipsis;

      display: -webkit-box;
      -webkit-line-clamp: 2; //行数
      -webkit-box-orient: vertical;
    }

    .shipment {
      font-size: 27rpx;
      color: #999;
      position: absolute;
      bottom: 30rpx;
    }

    .collect {
      width: 140rpx;
      height: 88rpx;
      text-align: center;
      padding-top: 50rpx;
      box-sizing: border-box;
      border-left: 1rpx solid #ddd;
      font-size: 22rpx;
      color: #999;

      position: absolute;
      right: 20rpx;
      top: 91rpx;
    }
  }

  .detail image {
    width: 100%;
    height: 480rpx;
    margin-top: 20rpx;
  }

  .action {
    width: 100%;
    height: 98rpx;
    background-color: #fff;

    position: fixed;
    left: 0;
    bottom: 0;

    display: flex;

    span {
      display: block;
    }

    .add, .buy {
      width: 210rpx;
      text-align: center;
      line-height: 98rpx;
      font-size: 27rpx;
      color: #fff;
    }

    .add {
      background-color: #f4b73f;
    }

    .buy {
      background-color: #ea4451;
    }

    button {
      padding: 0;
      border-radius: 0;
      background-color: #fff;

      &::after {
        border: none;
      }
    }

    button, .cart {
      flex: 1;
      line-height: 1;
      color: #989898;
      font-size: 24rpx;
      box-sizing: border-box;
      padding-top: 56rpx;                         
    }
  }

</style>

