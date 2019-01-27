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

  }
})