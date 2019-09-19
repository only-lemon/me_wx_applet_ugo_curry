/**
 * 
 * 
 *          因为在小程序中不能使用外部的发送请求的方法,所以只能使用原生的微信小程序发送请求的方法
 *          所以要进行promise的封装,,,防止回调地狱,,,并且把代码变成同步执行的逻辑
 * 
 * 
 * 
 */


export default function (configRequest) {

  // 处理默认参数
  var url = configRequest.url || ""
  var method = configRequest.method || "GET"
  var data = configRequest.data || {}

  // 配置基础路径
  url = 'https://www.zhengzhicheng.cn' + url;

  return new Promise((resolve,reject)=>{
    mpvue.request({
      url,
      method,
      data,
      success (responseResult) {
        resolve(responseResult.data)
      },
      fail () {
        reject()
      }
    })
  })
}