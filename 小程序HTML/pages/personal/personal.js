// pages/personal/personal.js
var http = require('../../http.js');
var startTime = Date.now();//启动时间
const app = getApp();
var WxParse = require('../../wxParse/wxParse.js')
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
    startTime:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(Date.now());
    this.setData({
      startTime: Date.now() //启动时间
    })
  },
  //跳转首页
  goIndexMian: function(e){
    var id = e.currentTarget.dataset.id;
    wx.reLaunch({
      url: '../../pages/index/index?id=' + (id ?  id : '')
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
        // 进行中
        let artilesA = res.data.jxz_books;
        if (artilesA.length){
          for (let i = 0; i < artilesA.length; i++) {
            WxParse.wxParse('content' + i, 'html', artilesA[i]['content'], that, 5);
            if (i === artilesA.length - 1) {
              WxParse.wxParseTemArray("artileList", 'content', artilesA.length, that)
            }
          }
          for (let i = 0; i < artilesA.length; i++) {
            artilesA[i].node = that.data.artileList[i]
          }
          that.setData({
            doingBooks: artilesA
          });
        }
        //为您推荐
        let artilesB = res.data.tj_books;
        console.log(artilesB.length)
        if (artilesB.length) {
          for (let i = 0; i < artilesB.length; i++) {
            WxParse.wxParse('content' + i, 'html', artilesB[i]['content'], that, 5);
            if (i === artilesB.length - 1) {
              WxParse.wxParseTemArray("artileListB", 'content', artilesB.length, that)
            }
          }
          for (let i = 0; i < artilesB.length; i++) {
            artilesB[i].node = that.data.artileListB[i]
          }
          that.setData({
            recommendBooks: artilesB
          });
         }
    
        
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
    // 停留时长
    // var shijiancha = Date.now() - this.data.startTime;
    // var days = shijiancha / 1000 / 60 / 60 / 24;
    // var daysRound = Math.floor(days);
    // var hours = shijiancha / 1000 / 60 / 60 - (24 * daysRound);
    // var hoursRound = Math.floor(hours);
    // var minutes = shijiancha / 1000 / 60 - (24 * 60 * daysRound) - (60 * hoursRound);
    // var minutesRound = Math.floor(minutes);
    // var seconds = shijiancha / 1000 - (24 * 60 * 60 * daysRound) - (60 * 60 * hoursRound) - (60 * minutesRound);
    // app.aldstat.sendEvent('个人主页停留时间', {
    //   "时间": Math.floor(hours) + '时' + Math.floor(minutes) + '分' + Math.floor(seconds)+'秒',
    // })
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