// pages/personal/personal.js
var http = require('../../http.js')
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    token: wx.getStorageSync('token'),
    info:{},
    host: app.host,
    doneBooks:[],
    doingBooks: [],
    recommendBooks: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(app.host)
  },
  //跳转首页
  goIndexMian: function(){
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../../pages/taskList/taskList?id=' + id
    })
  },
  //跳转完成列表
  gomissionDetail: function(e){
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../../pages/missionDetail/missionDetail?id=' + id
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
    var data = {};
    var that = this;
    data.token = this.data.token;
    http.postReq('/api/User/info', data, function (res) {
      if (res) {
        that.setData({
          info: res.data,
          doneBooks: res.data.my_books,
          doingBooks: res.data.jxz_books,
          recommendBooks: res.data.tj_books,
        })
      } else {
        console.log('xxx')
      }
      console.log(that.data.info)
      console.log(res)
    });
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