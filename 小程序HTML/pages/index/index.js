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
    cType: 'car',
    scrollTop: 0,
    isLogin: true,
    user: '',
    list: [{},{},{},{},{},{}],
    activeIdx: 0,
    isIphone: false
  },
  //swiper
  swiperChange: function(e){
    this.setData({
      activeIdx: e.detail.current
    })
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
  //提示
  noTap: function(){
    wx.showToast({
      title: '这不是今天的任务哦~',
      icon: 'none'
    })
  },
  //开启中断阅读确认
  submitType: function(){
    var cType = this.data.cType;
    if(cType == 'wechat'){
      wx.navigateTo({
        url: '../taskList/taskList'
      })
    }else if(cType == 'car'){
      this.openShareMask()
    }
  },
  //阅读跳转
  goReadMain: function(){
    wx.navigateTo({
      url: '../taskList/taskList?id=1'
    })
  },
  //我的跳转
  goPersonal: function(){
    wx.navigateTo({
      url: '../personal/personal'
    })
  },
  //用户点击登录按钮
  userInfoHandler: function(e) {
    var that = this;
    wx.getSetting({
      success: function(res) {
        console.log(res.authSetting['scope.userInfo'])
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
                    if (!res.authSetting["scope.userInfo"]) {
                      //这里是授权成功之后 填写你重新获取数据的js
                      //参考:
                      
                      // that.getLogiCallback('', function() {
                      //   callback('')
                      // })
                    }else{
                      wx.setStorageSync("user", 1);
                      that.loadUser()
                    }
                  }
                })
              }
            }
          })
        } else {
          wx.setStorageSync("user", 1);
          // var data = {
          //   encryptedData: e.detail.encryptedData,
          //   iv: e.detail.iv,
          //   sCode: wx.getStorageSync('code'),
          //   sOpenId: wx.getStorageSync('openid'),
          // };
          // app.request('GetWXUserInfo', data, function(res) {
          //   if (res.success) {
          //     app.globalData.bIsLogin = true;
          //     res = res.data;
          //     app.globalData.userState = res.user.iState;
          //     wx.setStorageSync("user", res.user);
          //     that.setData({
          //       bLogin: true,
          //       user: res.user,
          //       yesterdayData: res.yesterdayData
          //     });
          //   } else {
          //     app.alert('获取用户信息时出现错误，请稍后再试', that);
          //   }
          // });
        }
        that.loadUser()
      },
      fail:function(res){
        console.log('授权失败');
      }
    });
  },
  //加载用户信息
  loadUser: function () {
    var that = this;
    var user = wx.getStorageSync('user');
    if (user == null || user == "") {
      var getWxUser = setInterval(function () {
        if (that.data.bNull) {
          var code = wx.getStorageSync('code');
          if (code != null && code != "") {
            that.setData({
              bNull: false
            });
            var data = {
              sCode: code
            };
            app.request('JudgeUser', data, function (result) {
              if (result.data != null && result.data.sessionKey != undefined) {
                that.setData({
                  sessionKey: result.data.sessionKey
                });
                wx.setStorage({
                  key: 'sessionKey',
                  data: result.data.sessionKey,
                });
                if (result.success) {
                  app.globalData.bIsLogin = true;
                  var res = result.data.user;
                  app.globalData.userState = res.iState;
                  wx.setStorageSync("user", res);
                  that.setData({
                    user: res,
                    bLogin: true,
                    sOpenId: result.data.openid,
                    yesterdayData: result.data.yesterdayData
                  });
                } else {
                  that.setData({
                    sOpenId: result.data.openid,
                  });
                }
                that.getWeRun();
              }
            });
          }
        } else {
          clearInterval(getWxUser)
        }
      }, 500);
    } else {
      that.setData({
        user: user,
        isLogin: false
      });
    }
  },
  //滚动位置
  listLocation: function (selectId) {
    var that = this;
    var active = wx.createSelectorQuery().select('#indexCtt').fields({
      dataset: true,
      size: true,
      scrollOffset: true,
      rect: true
    }, function (res) {
      var cttTop = res.top;
      var active2 = wx.createSelectorQuery().select('#' + selectId).fields({
        dataset: true,
        size: true,
        scrollOffset: true,
        rect: true
      }, function (res) {
        var itemTop = res.top - cttTop;
        that.setData({
          scrollTop: itemTop
        })
      }).exec()
    }).exec()
    
  },
  //获取手机号
  getPhoneNumber: function (e) {
    console.log(e.detail.iv);
    console.log(e.detail.encryptedData);
    // wx.login({
    //   success: res => {
    //     console.log(res.code);
    //     wx.request({
    //       url: 'https://你的解密地址',
    //       data: {
    //         'encryptedData': encodeURIComponent(e.detail.encryptedData),
    //         'iv': e.detail.iv,
    //         'code': res.code
    //       },
    //       method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    //       header: {
    //         'content-type': 'application/json'
    //       }, // 设置请求的 header
    //       success: function (res) {
    //         if (res.status == 1) {//我后台设置的返回值为1是正确
    //           //存入缓存即可
    //           wx.setStorageSync('phone', res.phone);
    //         }
    //       },
    //       fail: function (err) {
    //         console.log(err);
    //       }
    //     })
    //   }
    // })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    
    this.loadUser();

    var that = this;
    //iphone 底部横线适配
    var iphones = ['iPhone X', 'unknown<iPhone11,2>', 'unknown<iPhone11,8>', 'unknown<iPhone11,4>','unknown<iPhone11,6>']
    wx.getSystemInfo({
      success: function (res) {
        //console.log(res.model)
        //console.log(res.language)//zh_CN(en)
        //console.log(res.model=="iPhone X")
        console.log(iphones.indexOf(res.model) > -1)
        if (iphones.indexOf(res.model) > -1) {
          that.setData({
            isIphone: true
          })
        }
      }
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    
  },
  
  goRead:function(){
    
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