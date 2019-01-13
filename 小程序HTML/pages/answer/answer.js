// pages/answer/answer.js
var http = require('../../http.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var data = {};
    data.token = '019d1a4a-8d59-4435-82ba-b30d4c133706';
    data.aid = 2;
    http.postReq('/api/Answer/getQuestions', data, function (res) {
      if (res) {

      } else {
        console.log('xxx')
      }
      console.log(that.data.info)
      console.log(res)
    });
  },

  //提交
  formSubmit: function () {
    wx.navigateTo({
      url: '../answerResolution/answerResolution'
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