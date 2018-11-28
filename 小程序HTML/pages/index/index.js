// pages/index/index.js
const util = require('../../utils/util.js')
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    mask: false,
    mask2: false,
    shareMask: false,
    cType: 'car'
  },
  //开启遮罩
  openMask: function(){this.setData({mask: true})},
  //关闭遮罩
  closeMask: function () {this.setData({mask: false})},
  //开启中断遮罩
  openMask2: function () {this.setData({mask2: true})},
  //关闭中断遮罩
  closeMask2: function () { this.setData({ mask2: false }) },
  //开启分享遮罩
  openShareMask: function () { this.setData({ shareMask: true, mask2: false }) },
  //关闭分享遮罩
  closeShareMask: function () { this.setData({ shareMask: false }) },
  //开启中断阅读选择
  choiceType: function(e){
    this.setData({
      cType: e.currentTarget.dataset.type
    })
  },
  //开启中断阅读确认
  submitType: function(){
    var cType = this.data.cType;
    if(cType == 'wechat'){

    }else if(cType == 'car'){
      this.openShareMask()
    }
  },
  //用户点击登录按钮
  userInfoHandler: function(e) {
    var that = this;
    wx.getSetting({
      success: function(res) {
        if (!res.authSetting['scope.userInfo']) {
          wx.showModal({
            title: '警告',
            content: '小程序需要您的授权进行登录，如果您拒绝，您将无法正常使用；后期如有需要可将小程序删除后重新搜索，重新授权方可使用。',
            cancelText: "不授权",
            confirmText: '授权',
            success(res) {
              if (res.confirm) {
                wx.openSetting({
                  success: function(res) {
                    if (!res.authSetting["scope.userInfo"] || !res.authSetting["scope.userLocation"]) {
                      //这里是授权成功之后 填写你重新获取数据的js
                      //参考:
                      that.getLogiCallback('', function() {
                        callback('')
                      })
                    }
                  }
                })
              }
            }
          })
        } else {
          var data = {
            encryptedData: e.detail.encryptedData,
            iv: e.detail.iv,
            sCode: wx.getStorageSync('code'),
            sOpenId: wx.getStorageSync('openid'),
          };
          app.request('GetWXUserInfo', data, function(res) {
            if (res.success) {
              app.globalData.bIsLogin = true;
              res = res.data;
              app.globalData.userState = res.user.iState;
              wx.setStorageSync("user", res.user);
              that.setData({
                bLogin: true,
                user: res.user,
                yesterdayData: res.yesterdayData
              });
              that.getWeRun();
            } else {
              app.alert('获取用户信息时出现错误，请稍后再试', that);
            }
          });
        }
      },
      fail:function(res){
        console.log('授权失败');
      }
    });

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
   
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.setData({
      pages: 1,
      totalPage: 1
    });
    this.load();
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})