// pages/taskList/taskList.js
const util = require('../../utils/util.js')
const http = require('../../http.js')
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    signBoxShow: false,
    info: {},
    id: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    this.setData({
      id: options.id
    })
    
  },
  getDetail: function(id){
    var that = this;
    http.postReq('/api/Article/info', { id: 6},function(res){
      if(res.code == 101){
        that.setData({
          info: res.data
        })
      }
    })
  },
  //打卡
  clockIn: function(){
    var that = this;
    var info = this.data.info;
    if (info.dk){
      return false;
    }
    if (!this.isreaded() || (info.dt.name && !info.dt.flag) || (info.sp && !info.sp.flag)) {
      this.toast();
      return false;
    }
    this.setData({
      signBoxShow: true
    })
  },
  closeMask: function(){
    this.setData({
      signBoxShow: false
    })
  },
  //跳转阅读详情
  goDetail: function(e){
    var that = this;
    var idx = e.currentTarget.dataset.idx;
    var list = this.data.info.yp;
    console.log(e)
    if (idx != 0 && !list[idx-1].flag){
      that.toast();
    }else{
      wx.navigateTo({
        url: '../read/read?id=' + list[idx].id
      })
    }
    
  },
  //提示
  toast: function(){
    wx.showToast({
      title: '为了更好的阅读效果，请先完成之前的内容',
      icon: 'none',
      duration: 2000
    })
  },
  //判断阅读是否完成
  isreaded: function(){
    var list = this.data.info.yp;
    var count = 0;
    for(var i = 0;i < list.length;i++){
      if(list[i].flag){
        count++
      }
    }
    if(count == list.length){
      return true;
    }else{
      return false;
    }
  },
  //去答题
  goAnswer: function(e){
    
    // if (!this.isreaded()){
    //   this.toast();
    //   return false;
    // }
    wx.navigateTo({
      url: '../answer/answer?aid=' + this.data.info.id
    })
  },
  //去课程
  goClass: function(){
    var info = this.data.info;
    if (!this.isreaded() || (info.dt.name && !info.dt.flag)) {
      this.toast();
      return false;
    }
    wx.navigateTo({
      url: '../weekClass/weekClass?aid=' + this.data.info.id
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
    
    this.getDetail(this.data.id)
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