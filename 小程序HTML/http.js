var rootDocment = 'https://shuyu.qingshanyuwo.cn/';
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
  //console.log("header=="),
    //console.log(header)

  wx.request({
    url: rootDocment + url + '?token=' + token,
    method: 'get',
    header: header,
    success: function (res) {
      wx.hideLoading();
      return typeof cb == "function" && cb(res.data)
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
  //console.log("header=="),
    //console.log(header),
    if(!data){
      data={};
    }
    var member_id = wx.getStorageSync('member_id');
    var token = wx.getStorageSync('token');
    if (member_id){
      data.member_id = member_id;
    }
    if (token) {
      data.token = token;
    }
    console.log(data);
    wx.request({
      url: rootDocment + url,
      header: header,
      data: data,
      method: 'post',
      success: function (res) {
        wx.hideLoading();
        return typeof cb == "function" && cb(res.data)
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
