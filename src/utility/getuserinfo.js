

export default function () {

  return new Promise((resolve,reject) => {

    mpvue.getUserInfo({
      success (userInfo) {
        resolve(userInfo)
      }
    })

  })

}