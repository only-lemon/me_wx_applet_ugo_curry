<template>
  <!-- 搜索 -->
  <div class="search" :class="{focused: focused}">
    <!-- 搜索框 -->
    <div class="input-wrap" @click="goSearch" >
      <input type="text" :placeholder="placeholder" @input="searchResult"  v-model="searchKeyword" @confirm="saveSearchHistoryRecordAndSkipGoodsListPage" >
      <span class="cancle" @click.stop="cancleSearch">取消</span>
    </div>
    <!-- 搜索结果 -->
    <div class="content">
      <div class="title">搜索历史<span class="clear" @click="clearHistoryRecord"></span></div>
      <div class="history">
        <navigator :url="'/pages/list/main?query=' + searchHistoryRecordItem" v-for="(searchHistoryRecordItem,index) in searchHistoryRecordDataList" :key="index" >{{searchHistoryRecordItem}}</navigator>
        
      </div>
      <!-- 结果 -->
      <scroll-view scroll-y class="result" v-if="searchResultDataList.length">
        <navigator url="" v-for="searchResultItem in searchResultDataList" :key="searchResultItem.goods_id">{{searchResultItem.goods_name}}</navigator>
        
      </scroll-view>
    </div>
  </div>
</template>



<script>

  // 导入对 wx.request 的 Promise 封装版本
  import promiseRequest from "@/utility/package_promise_request"
  
  export default {

    data () {
      return {
        focused: false,
        placeholder: '',

        // 用户搜索关键字
        searchKeyword: "",

        // 搜索关键字结果数据
        searchResultDataList: [],

        // 搜索历史记录数据
        searchHistoryRecordDataList: mpvue.getStorageSync("history") || [],

        /**
         *      优化搜索请求  --->  加锁的逻辑有bug   --->   
         *          发现个问题  --->  在老师对优化搜索请求的逻辑上,,,加锁的逻辑上是有bug的,,,
         *          因为 当我快速输入ab的时候a的请求如果没结束的话,当我b准备去发请求的时候就发不出去,
         *          就被return掉了,,,但是  --->  问题来了,,,当a的请求结束了的话,,,我b也没法在自动去发请求了呀,,,
         *          代码又不能自己回来再判断一遍if(this.locked) return这个,,,对吧,,,应该是个bug,,,
         */

        // // 对本次请求加把锁,本次请求未完成下一次请求不要发
        // locked: false

      }
    },

    methods: {
      goSearch (ev) {
        this.focused = true;
        this.placeholder = '请输入您要搜索的内容';
        
        // 触发父组件自定义事件
        this.$emit('search', {
          pageHeight: mpvue.getSystemInfoSync().windowHeight
        })

        // 隐藏tabbar
        mpvue.hideTabBar()

      },
      cancleSearch () {
        this.focused = false;
        this.placeholder = '';

        // 清空用户搜索关键字
        this.searchKeyword = "";

        // 清空搜索关键字结果数据
        this.searchResultDataList = [];

        // 触发父组件自定义事件
        this.$emit('search', {
          pageHeight: 'auto'
        })

        // 显示tabbar
        mpvue.showTabBar()

      },

      // 用户在搜索框输入内容时,发起请求
      async searchResult () {

        if(!this.searchKeyword.trim()) return this.searchResultDataList = []

        // // 如果上一次请求请求还未完成,未结束,下一次请求不要发
        // if(this.locked) return

        // // 对本次请求加锁
        // this.locked = true

        const searchResultData = await promiseRequest({
          url : "/api/public/v1/goods/qsearch",
          data: {query: this.searchKeyword}
        })
        // console.log(searchResultData)
        this.searchResultDataList = searchResultData.message
        // console.log(searchResultData.message)

        // // 本次请求已完成,已结束的情况下,,,对本次请求解锁
        // this.locked = false

      },

      // 存储搜索历史记录  and  跳转到商品列表页方法
      saveSearchHistoryRecordAndSkipGoodsListPage () {

        this.searchHistoryRecordDataList.push(this.searchKeyword)

        // 将重复的单元删除
        this.searchHistoryRecordDataList = [...new Set(this.searchHistoryRecordDataList)];

        mpvue.setStorageSync("history",this.searchHistoryRecordDataList)

        // // 输入的关键字为空时,不能跳转
        // if(this.searchKeyword === '') return;

        // 跳转到商品列表
        mpvue.navigateTo({
          url: '/pages/list/main?query=' + this.searchKeyword
        })

      },

      // 清空历史记录方法
      clearHistoryRecord () {

        mpvue.removeStorageSync("history")
        this.searchHistoryRecordDataList = []

      }


    }
  }

</script>



<style lang="less" scoped>
  .search {
    display: flex;
    flex-direction: column;
    
    // 搜索框
    .input-wrap {
      display: flex;
      height: 100rpx;
      padding: 20rpx 30rpx;
      background-color: #ea4451;
      box-sizing: border-box;
      position: relative;

      &::before,
      &::after {
        height: 44rpx;
        line-height: 1;
        background-image: url(https://ugo2.oss-cn-hangzhou.aliyuncs.com/images/icon_search%402x.png);
        background-size: 32rpx;
        background-position: 6rpx center;
        background-repeat: no-repeat;

        position: absolute;
        top: 28rpx;
        z-index: 9;
      }

      &::before {
        content: '搜索';
        display: block;

        width: 100rpx;
        padding: 11rpx 0 10rpx 44rpx;
        box-sizing: border-box;
        color: #666;
        font-size: 24rpx;
        left: 325rpx;
      }

      &::after {
        display: none;
        content: '';
        width: 44rpx;
        left: 40rpx;
      }

      input {
        flex: 1;
        height: 60rpx;
        padding: 0 20rpx 0 64rpx;
        background-color: #fff;
        border-radius: 8rpx;
        font-size: 24rpx;
        color: #666;
      }

      span.cancle {
        display: none;
        width: 80rpx;
        text-align: right;
        line-height: 60rpx;
        font-size: 27rpx;
        color: #666;
      }
    }

    // 搜索结果
    .content {
      display: none;
      flex: 1;
      padding: 27rpx;
      background-color: #fff;
      position: relative;

      .title {
        font-size: 27rpx;
        line-height: 1;
        color: #333;
      }

      .clear {
        display: block;
        width: 27rpx;
        height: 27rpx;
        float: right;
        background-image: url(https://ugo2.oss-cn-hangzhou.aliyuncs.com/images/clear.png);
        background-size: cover;
      }

      .history {
        padding-top: 30rpx;

        navigator {
          display: inline-block;
          line-height: 1;
          padding: 15rpx 20rpx 12rpx;
          background-color: #ddd;
          font-size: 24rpx;
          margin-right: 20rpx;
          margin-bottom: 15rpx;
          color: #333;
        }
      }

      .result {
        // display: none;
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        background-color: #fff;

        navigator {
          line-height: 1;
          padding: 20rpx 30rpx;
          font-size: 24rpx;
          color: #666;
          border-bottom: 1px solid #eee;

          &:last-child {
            border-bottom: none;
          }
        }
      }
    }
    
    // 获得焦点状态
    &.focused {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      z-index: 9;

      .input-wrap {
        background-color: #eee;

        &::before {
          display: none;
        }

        &::after {
          display: block;
        }
      }

      span.cancle {
        display: block;
      }

      .content {
        display: block;
      }
    }
  }
</style>