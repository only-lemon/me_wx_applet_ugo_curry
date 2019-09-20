<template>
  <div>
    <!-- 搜索 -->
    <search></search>
    <!-- 分类 -->
    <div class="category" v-if="topCategoryDataList.length">
      <!-- 顶级分类 -->
      <ul class="sup">
        <scroll-view scroll-y>
          <li  :class="{active:topIndex === currentIndex}" @click="toggleSecondLevelCategoryData(topIndex)" v-for="(topCategoryItem,topIndex) in topCategoryDataList" :key="topCategoryItem.cat_id">{{topCategoryItem.cat_name}}</li>
         
        </scroll-view>
      </ul>
      <!-- 子级分类 -->
      <div class="sub">
        <scroll-view scroll-y>
          <!-- 封面图 -->
          <image src="/static/uploads/category.png" class="thumb"></image>
          <div class="children" v-for="secondLevelCategoryItem in secondLevelCategoryDataList.children" :key="secondLevelCategoryItem.cat_id">
            <div class="title" >{{secondLevelCategoryItem.cat_name}}</div>
            <!-- 品牌 -->
            <div class="brands" >
              <navigator url="" v-for="(secondLevelCategoryItemBrandItem,index_) in secondLevelCategoryItem.children" :key="index_">
                <image :src="secondLevelCategoryItemBrandItem.cat_icon"></image>
                <span>{{secondLevelCategoryItemBrandItem.cat_name}}</span>
              </navigator>
             
            </div>
          </div>
          
        </scroll-view>
      </div>
    </div>
  </div>
</template>



<script>

  import search from '@/components/search';

  // 导入对 wx.request 的 Promise 封装版本
  import promiseRequest from "@/utility/package_promise_request"


  export default {

    data () {
      return {

        // 侧边顶级分类数据
        topCategoryDataList: [],

        // 二级分类数据   --->   在计算属性里

        // 切换二级分类数据所用到的索引值
        currentIndex: 0

      }
    },

    methods: {
      
      // 获取分类页中的分类数据的方法
      async gainCategoryData () {
        const gainCategoryDataResult = await promiseRequest({
          url : "/api/public/v1/categories"
        })
        // console.log(gainCategoryDataResult)
        this.topCategoryDataList = gainCategoryDataResult.message
        // console.log(gainCategoryDataResult.message)


      },

      // 切换二级分类数据
      toggleSecondLevelCategoryData(topIndex){
        this.currentIndex = topIndex
      }

    },

    computed: {

      secondLevelCategoryDataList () {
        return this.topCategoryDataList.length && this.topCategoryDataList[this.currentIndex]
      }

    },
    
    components: {
      search
    },

    mounted () {
      
      // 页面一加载就需要请求回来的数据   --->   获取分类页分类数据
      this.gainCategoryData()
      
    }

  }
</script>





<style scoped lang="less">

  scroll-view {
    height: 100%;
  }

  .category {
    display: flex;
    width: 100%;
    position: absolute;
    top: 100rpx;
    bottom: 0;

    .sup {
      width: 196rpx;
      background-color: #f4f4f4;

      li {
        height: 100rpx;
        text-align: center;
        line-height: 100rpx;
        font-size: 27rpx;
        color: #333;
        border-bottom: 1rpx solid #eee;

        &:last-child {
          border-bottom: none;
        }
        
        &.active {
          background-color: #FFF;
          color: #ea4451;
          position: relative;

          &::before {
            content: '';
            display: block;
            width: 8rpx;
            height: 60rpx;
            transform: translateY(-50%);
            background-color: #ea4451;

            position: absolute;
            left: 0;
            top: 50%;
          }
        }
      }
    }

    .sub {
      flex: 1;
      padding: 20rpx 18rpx;

      .thumb {
        width: 100%;
        height: 180rpx;
      }

      .children {
        text-align: center;
        color: #333;

        .title {
          display: inline-block;
          margin: 40rpx 0 20rpx;
          font-size: 30rpx;

          &::before {
            content: '/';
            margin-right: 20rpx;
            color: #666;
          }

          &::after {
            content: '/';
            margin-left: 20rpx;
            color: #666;
          }
        }
      }

      .brands {
        display: flex;
        flex-wrap: wrap;

        navigator {
          width: 33%;
          margin-bottom: 20rpx;
        }

        image {
          width: 120rpx;
          height: 120rpx;
        }

        span {
          display: block;
          font-size: 24rpx;
        }
      }
    }
  }
</style>


