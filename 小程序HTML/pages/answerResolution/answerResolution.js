// pages/answer/answer.js
var http = require('../../http.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    answerList: [],
    answer: [],
    isvideo: false,
    signBoxShow: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var token = wx.getStorageSync('token');
    var that = this;
    this.setData({
      id: options.aid
    })
    var data = {};
    data.aid = that.data.id;
    http.postReq('/api/Answer/getQuestions', data, function (res) {
      if (res) {
        that.setData({
          answerList: res.data.rows
        })
        // // 正确率
        // var i = 0;
        // var len = that.data.answerList.length;
        // var info = wx.getStorageSync('bookInfo');
        // that.data.answerList.forEach(function (arr, index){
        //   console.log(index, arr)
        //   // 每题正确率
        //   if (arr.myanswer == arr.answer){
        //     i++;
        //     app.mtj.trackEvent('each_accuracy', {
        //       answername: arr.name,
        //       accuracy: 1,
        //     });
        //   }else{
        //     app.mtj.trackEvent('each_accuracy', {
        //       answername: arr.name,
        //       accuracy: 0,
        //     });
        //   }
        //   console.log(i);
          
        // })
        // // 章节正确率
        // app.mtj.trackEvent('article_accuracy', {
        //   article: info.name,
        //   accuracy: (i / len).toFixed(2), 
        // });
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

  //去课程
  goClass: function () {
    var info = wx.getStorageSync('bookInfo');
    if (info.sp.id){
      wx.navigateTo({
        url: '../weekClass/weekClass?aid=' + info.sp.id+'&dkid='+this.data.id
      })
    }else{
      wx.showToast({
        title: '没有趣解',
        icon: 'none'
      })
    }
    
  },
  // 打卡
  signBtn: function () {
    var that = this;
    var data = {};
    data.aid = that.data.id;
    http.postReq('/api/Clock/signInArticle', data, function (res) {
      if (res.code == 101) {
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
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (wx.getStorageSync('bookInfo')){
      this.setData({
        isvideo: wx.getStorageSync('bookInfo').sp.id ? true : false
      })
    }
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
  onShareAppMessage: function () {
    var that = this;
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    var user = wx.getStorageSync('user');
    return {
      title: '跟我一起重新认识一本书',
      path: '/pages/index/index?pid=' + user.id,
      imageUrl: '/files/icon_book.png',
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