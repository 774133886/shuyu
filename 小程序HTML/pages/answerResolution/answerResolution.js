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
    wx.navigateTo({
      url: '../weekClass/weekClass?aid=' + this.data.id
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