var rootDocment = 'https://shuyu.educhinstyle.cn';
var header = {
  'Accept': 'application/json',
  'content-type': 'application/json',
  'Authorization': null,
}
function getReq(url, cb) {
  var token = wx.getStorageSync('token');
  if(!token){
    wx.showToast({
      icon: 'none',
      title: '重新登录',
    })
    return false;
  }
  wx.showLoading({
    title: '加载中',
  })
  wx.request({
    url: rootDocment + url + '?token=' + token,
    method: 'get',
    success: function (res) {
      wx.hideLoading();
      if (res.data.code == 401) {
        wx.login({
          success: function (res1) {
            if (res1.code) {
              wx.request({
                url: 'https://shuyu.educhinstyle.cn/api/Login/code2Session?code=' + res1.code,
                success: function (res2) {
                  if (res2.data.openid) {
                    wx.setStorageSync('sskey', res2.data.session_key);
                    wx.getUserInfo({
                      success: function (res3) {
                        var pid = wx.getStorageSync('pid');
                        wx.request({
                          url: 'https://shuyu.educhinstyle.cn/api/login/third_login',
                          data: {
                            nickname: res3.userInfo.nickName,
                            openid: res2.data.openid,
                            img: res3.userInfo.avatarUrl,
                            pid: (pid ? pid : '')  //邀请人id
                          }, success: function (res4) {
                            wx.setStorageSync('token', res4.data.data.token);
                            wx.setStorageSync('user', res4.data.data.info);
                            wx.setStorageSync('phone', res4.data.data.info.mobile ? res4.data.data.info.mobile : '');
                            getReq(url, cb);
                          }
                        })
                      }
                    })
                  }
                }
              })
            }
          }
        })
      }else{
        return typeof cb == "function" && cb(res.data)
      }
    },
    fail: function () {
      wx.hideLoading();
      wx.showModal({
        title: '网络错误',
        content: '网络出错，请刷新重试',
        showCancel: false
      })
      return typeof cb == "function" && cb(false)
    }
  })
}

function postReq(url, data, cb) {
  wx.showLoading({
    title: '加载中',
  })
    if(!data){
      data={};
    }
    var token = wx.getStorageSync('token');
    // console.log(data);
    wx.request({
      url: rootDocment + url + '?token=' + token,
      data: data,
      method: 'post',
      success: function (res) {
        wx.hideLoading();
        // console.log(res);
        if (res.data.code == 401) {
          wx.login({
            success: function (res1) {
              if (res1.code) {
                wx.request({
                  url: 'https://shuyu.educhinstyle.cn/api/Login/code2Session?code=' + res1.code,
                  success: function (res2) {
                    if (res2.data.openid) {
                      wx.setStorageSync('sskey', res2.data.session_key);
                      wx.getUserInfo({
                        success: function (res3) {
                          var pid = wx.getStorageSync('pid');
                          wx.request({
                            url: 'https://shuyu.educhinstyle.cn/api/login/third_login',
                            data: {
                              nickname: res3.userInfo.nickName,
                              openid: res2.data.openid,
                              img: res3.userInfo.avatarUrl,
                              pid: (pid?pid:'')  //邀请人id
                            }, success: function (res4) {
                              wx.setStorageSync('token', res4.data.data.token);
                              wx.setStorageSync('user', res4.data.data.info);
                              wx.setStorageSync('phone', res4.data.data.info.mobile ? res4.data.data.info.mobile : '');
                              postReq(url, data, cb);
                            }
                          })
                        }
                      })
                    }
                  }
                })
              }
            }
          })
        } else {
          return typeof cb == "function" && cb(res.data)
        }
      },
      fail: function () {
        wx.hideLoading();
        wx.showModal({
          title: '网络错误',
          content: '网络出错，请刷新重试',
          showCancel: false
        })
        return typeof cb == "function" && cb(false)
      }
    })

}
module.exports = {
  getReq: getReq,
  postReq: postReq,
  header: header,
}  
