
<template>
  <div>
    <!-- 筛选 -->
    <div class="filter">
      <span class="active">综合</span>
      <span>销量</span>
      <span>价格</span>
    </div>
    <!-- 商品列表 -->
    <scroll-view class="goods" scroll-y @scrolltolower="gainMoreGoodsData">
      <div class="item" v-for="searchGoodsResultItem in searchGoodsResultDataList" :key="searchGoodsResultItem.cat_id">
        <!-- 商品图片 -->
        <image class="pic" :src="searchGoodsResultItem.goods_small_logo"></image>
        <!-- 商品信息 -->
        <div class="meta">
          <p class="name">{{searchGoodsResultItem.goods_name}}</p>
          <p class="price"><span>￥</span>{{searchGoodsResultItem.goods_price}}<span>.00</span></p>
        </div>
      </div>
      <div class="tip" v-show="!searchGoodsResultDataList.length">没有找到相关的数据~</div>
     
    </scroll-view>
  </div>
</template>


<script>

  // 导入对 wx.request 的 Promise 封装版本
  import promiseRequest from "@/utility/package_promise_request"

  export default {

    // 获得地址参数通过 onLoad 实现
    async onLoad (query) {
      // console.log(11111)
      // console.log(query)

      // 将地址参数赋值给初始数据
      this.query = query;

      // 配置页码相关参数
      query.pagenum = this.pagenum;
      query.pagesize = this.pagesize;

      // 根据址中参数，查询查应的商品列表
      const gainGoodsDataResult = await promiseRequest({
        url: '/api/public/v1/goods/search',
        data: query
      })

      // console.log(message);
      // 更新数据
      this.searchGoodsResultDataList = gainGoodsDataResult.message.goods;

      // 记录后端搜索的此商品数据总共有多少条
      this.total = gainGoodsDataResult.message.total;

    },
    
    data () {
      return {

        // 搜索结果商品列表
        searchGoodsResultDataList: [],

        // 当前第几页
        pagenum: 1,

        // 每页取几条数据
        pagesize: 5,

        // 提取出来查询参数
        query: null,

        // 当前搜索的商品总共多少条
        total: 0,

      }
    },

    methods: {

      // 用户上拉加载更多数据
      async gainMoreGoodsData () {

        // 没有更多数据,终止请求
        if(this.searchGoodsResultDataList.length === this.total) return

        // 配置页码相关参数
        this.query.pagenum = ++this.pagenum
        this.query.pagesize = this.pagesize
        
        // 请求更多数据
        const gainMoreGoodsDataResult = await promiseRequest({
          url: '/api/public/v1/goods/search',
          data: this.query
        })
        this.searchGoodsResultDataList = this.searchGoodsResultDataList.concat(gainMoreGoodsDataResult.message.goods)

      },

    }

  }
</script>



<style scoped lang="less">

  .tip {
    text-align: center;
    margin-top: 120rpx;
    font-size: 36rpx;
    color: #666;
  }

  .filter {
    display: flex;
    height: 96rpx;
    line-height: 96rpx;
    border-bottom: 1rpx solid #ddd;

    span {
      flex: 1;
      text-align: center;
      font-size: 30rpx;
      color: #333;

      &.active {
        color: #ea4451;
      }
    }
  }
  
  .goods {
    position: absolute;
    width: 100%;
    top: 97rpx;
    bottom: 0;
  }

  .item {
    display: flex;
    padding: 30rpx 20rpx 30rpx 0;
    margin-left: 20rpx;
    border-bottom: 1rpx solid #eee;

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
  }

</style>

