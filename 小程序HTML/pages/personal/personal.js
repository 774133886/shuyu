// pages/personal/personal.js
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
    http.postReq('/api/Answer/getQuestions?token=019d1a4a-8d59-4435-82ba-b30d4c133706&aid=2', data, function (res) {
      if (res) {

      } else {
        console.log('xxx')
      }
      console.log(that.data.info)
      console.log(res)
    });
  },
  //跳转首页
  goIndexMian: function(){
    wx.reLaunch({
      url: '../index/index'
    })
  },
  //跳转完成列表
  gomissionDetail: function(){
    wx.navigateTo({
      url: '../missionDetail/missionDetail'
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