<template>
  <div>
    <button type="primary" open-type="getUserInfo" @getuserinfo="getUserInfo">微信登录</button>
    </div>
</template>



<script>

  // 导入 apI   ---->  封装成promise版本的apI
  import getUserInfo from "@/utility/getuserinfo"
  import getSetting from "@/utility/getsetting"
  import getCode from "@/utility/getcode"
  import promiseRequest from "@/utility/package_promise_request"

  export default {

    async onLoad () {
      
      // 检测用户是否设置过授权信息
      const checkUserISInstant = await getSetting()
      if (checkUserISInstant.authSetting['scope.userInfo']) {
        // console.log(11111)

        // 用户已授权   --->  就要获得用户信息
        const gainUserInfo = await getUserInfo()
        console.log("--------------------用户已授权-------------------")
        console.log(gainUserInfo)
        console.log("--------------------用户已授权-------------------")

        // 进行登录   -->  需要向后端发送登录请求

        // 1. 先准备好参数   --> code   ---> 这一步应该封装的login登录方法中进行
        // const {code} = await getCode()

        // 发送请求进行登录
        this.login(gainUserInfo.encryptedData,gainUserInfo.iv,gainUserInfo.rawData,gainUserInfo.signature)

      }

    },

    methods: {
      
      // 当用户点击确定授权或者取消授权选项时触发的方法
      getUserInfo (event) {
        // console.log(22222)
        console.log(event)

        // 进行登录   -->  需要向后端发送登录请求
        this.login(event.target.encryptedData,event.target.iv,event.target.rawData,event.target.signature)

      },

      // 登录时所用到的请求的方法
      async login (encryptedData,iv,rawData,signature) {
        
        // 获取需要向后端传递的参数code
        const {code} = await getCode()

        // 发送登录请求
        const loginResult = await promiseRequest({
          url : "/api/public/v1/users/wxlogin",
          method : "POST",
          data: {
            code,
            encryptedData,
            iv,
            rawData,
            signature
          }
        })
        console.log(loginResult)

        /**
         * 注释说明:     此时我的本地服务器出现了一个小小的问题暂时无法解决 所以暂时无法获取
         *          到登录信息  等后面的视频中老师可能会有所讲解如何搭上后端服务器在本地跑起来
         *          我的其实已经跑起来了 只不过缺少一点点东西 我暂时没有找到原因
         *          等老师讲到如何跑起来之后我把问题解决掉就可以直接跑代码了
         * 
         *    so   在此我先把代码写全,,,否则到后面积累下来太多的话就不好弄了,,,
         */

        // 将登录状态(token)记录在本地
        // mpvue.setStorageSync('token', loginResult.message.token);
        // 返加上一步，继续操作
        // mpvue.navigateBack({delta: 1});

      }

    }
    
  }

</script>



<style lang="less" scoped>

  button {
      width: 640rpx;
      margin: 200rpx auto;
    }

</style>

