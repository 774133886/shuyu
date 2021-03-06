// pages/weekClass/weekClass.js
var http = require('../../http.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    signBoxShow:false,
    is_display:false,
    videoContext:'',
    info:{},
    days: '',
    isclick:false,
    videoTime:0,
  },

  // 打卡
  signBtn:function(){
    var that = this;
    var data = {};
    data.aid = that.data.dkid;
    http.postReq('/api/Clock/signInArticle', data, function (res) {
      if (res.code==101) {
        app.mtj.trackEvent('endread');
        that.setData({
          signBoxShow: true,
          days: res.data
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 2000
        })
      }
    });
    
  },
  closeMask: function () {
    // this.setData({
    //   signBoxShow: false
    // })
    wx.reLaunch({
      url: '../index/index'
    })
  },
  bindplay: function () {//开始播放按钮或者继续播放函数
    //this.data.VideoContext.requestFullScreen();
    this.setData({
      is_display: true
    });
    this.data.videoContext.play();

  },
  playVideo: function () {
    this.bindplay();

    // 点击率
    var info = wx.getStorageSync('bookInfo');
    app.mtj.trackEvent('videoclick', {
      article: info.name,
      isclick: 1,
    });
    this.setData({
      isclick: true
    });
    // 点击量
    app.mtj.trackEvent('videoclicknum', {
      article: info.name
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.videoContext = wx.createVideoContext('myVideo');

    // 获取数据
    var token = wx.getStorageSync('token');
    var that = this;
    this.setData({
      id: options.aid,
      dkid: options.dkid,
      videoTime: app.getNow()
    })
    var data = {};
    data.id = that.data.id;
    http.postReq('/api/Sp/info', data, function (res) {
      if (res) {
        that.setData({
          info: res.data
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 2000
        })
      }

      console.log(res)
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    // 点击率
    if (!this.data.isclick) {
      var info = wx.getStorageSync('bookInfo');
      app.mtj.trackEvent('videoclick', {
        article: info.name,
        isclick: 0,
      });
    }
    //视频任务完成时间
    var time = this.data.videoTime;
    var videoTime = app.getTime(time);
    var info = wx.getStorageSync('bookInfo');
    this.setData({
      videoTime: 0
    });

    app.mtj.trackEvent('videotime', {
      article: info.name,
      time: videoTime,
    });
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    var that = this;
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    var user = wx.getStorageSync('user');
    return {
      title: '跟我一起重新认识一本书',
      path: '/pages/index/index?pid=' + user.id,
      imageUrl: '/files/share.jpg',
      success: (res) => {    // 成功后要做的事情
        //console.log(res.shareTickets[0])
        // console.log
        that.setData({
          signBoxShow: false
        })
      },
      fail: function (res) {
        // 分享失败
        console.log(res)
      }
    }
    
  }
})