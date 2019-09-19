<template>
  <div :style="{height: pageHeight, overflow: 'hidden'}">
    <search @search="disableScroll"></search>
    <!-- 焦点图 -->
    <swiper class="banner" indicator-dots indicator-color="rgba(255, 255, 255, 0.6)" indicator-active-color="#fff">
      <swiper-item v-for="bannerItem in bannerDataList" :key="bannerItem.goods_id">
        <a href="/pages/goods/main">
          <img :src="bannerItem.image_src" />
        </a>
      </swiper-item>
     
    </swiper>
    <!-- 导航条 -->
    <div class="navs">
      <a href="" v-for="navigatorItem in mainNavigatorDataList" :key="navigatorItem.name">
        <img :src="navigatorItem.image_src" />
      </a>
     
    </div>
    <!-- 楼层 -->
    <div class="floors">
      <div class="floor" v-for="(floorItem,index) in floorDataList" :key="index">
        <div class="title" > 
          <img :src="floorItem.floor_title.image_src" />
        </div>
        <div class="items">
          <a href="/pages/list/main" v-for="(perFloorProductItem,index_) in floorItem.product_list" :key="index_">
            <img :src="perFloorProductItem.image_src" />
          </a>
          
        </div>
      </div>
     
    </div>
  </div>
</template>

<script>

  import search from '@/components/search'

  // 导入对 wx.request 的 Promise 封装版本
  import promiseRequest from "@/utility/package_promise_request"

  export default {

    // 监听用户下拉刷新操作
    async onPullDownRefresh () {

      // 当用户下拉操作时  --->   刷新数据
      
      // 页面一加载就需要请求回来的数据   --->   获取首页轮播图数据
      await this.gainIndexPageBannerData()

      // 页面一加载就需要请求回来的数据   --->   获取首页主导航数据
      await this.gainMainNavigatorData()

      // 页面一加载就需要请求回来的数据   --->   获取首页楼层数据
      await this.gainFloorData()

      // 终止下拉loading状态
      mpvue.stopPullDownRefresh()

    },

    data () {
      return {

        pageHeight: 'auto',

        // 首页轮播图数据
        bannerDataList: [],

        // 主导航数据
        mainNavigatorDataList: [],

        // 楼层数据
        floorDataList: []

      }
    },

    components: {
      search
    },
    
    methods: {
      disableScroll (ev) {
        this.pageHeight = ev.pageHeight + 'px';
      },

      // 获取首页轮播图数据方法
      async gainIndexPageBannerData () {
        const gainIndexPageBannerDataResult =  await promiseRequest({
          url:"/api/public/v1/home/swiperdata"
        })
        // console.log(gainIndexPageBannerDataResult)
        this.bannerDataList = gainIndexPageBannerDataResult.message
        // console.log(gainIndexPageBannerDataResult.message)
      },

      // 获取主导航数据
      async gainMainNavigatorData () {
        const gainMainNavigatorDataResult = await promiseRequest({
          url : "/api/public/v1/home/catitems"
        })
        // console.log(gainMainNavigatorDataResult)
        this.mainNavigatorDataList = gainMainNavigatorDataResult.message
        // console.log(gainMainNavigatorDataResult.message)

      },

      // 获取楼层数据
      async gainFloorData () {
        const gainFloorDataResult  = await promiseRequest({
          url : "/api/public/v1/home/floordata"
        })
        // console.log(gainFloorDataResult)
        this.floorDataList = gainFloorDataResult.message
        // console.log(gainFloorDataResult.message)
      }

    },

    mounted () {

      // 页面一加载就需要请求回来的数据   --->   获取首页轮播图数据
      this.gainIndexPageBannerData()

      // 页面一加载就需要请求回来的数据   --->   获取首页主导航数据
      this.gainMainNavigatorData()

      // 页面一加载就需要请求回来的数据   --->   获取首页楼层数据
      this.gainFloorData()


    }
  }
</script>

<style scoped lang="less">

  .banner {
    width: 100%;
    height: 340rpx;

    img {
      width: 100%;
      height: 340rpx;
    }
  }

  .navs {
    display: flex;
    justify-content: space-between;
    padding: 30rpx 44rpx;

    img {
      width: 128rpx;
      height: 140rpx;
    }
  }

  .floors {

    .title {
      width: 750rpx;
      height: 60rpx;
      padding-top: 20rpx;
      background-color: #f4f4f4;
    }

    .items {
      padding: 20rpx 16rpx;
      overflow: hidden;

      a {
        width: 232rpx;
        height: 188rpx;
        margin-right: 10rpx;
        margin-bottom: 10rpx;
        float: left;
      }

      a:nth-child(2n+1) {
        margin-right: 0;
      }

      a:first-child {
        height: 386rpx;
        margin-right: 10rpx;
      }
    }
  }

</style>
