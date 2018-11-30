// pages/taskList/taskList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isComplete: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.id){
      this.setData({
        isComplete: true
      })
    }
  },
  //跳转阅读详情
  goDetail: function(e){
    if (e.currentTarget.dataset.last == 1){
      wx.navigateTo({
        url: '../readDetail/readDetail?id=1'
      })
    }else{
      wx.navigateTo({
        url: '../read/read'
      })
    }
    
  },
  //去答题
  goAnswer: function(e){
    wx.navigateTo({
      url: '../answer/answer'
    })
  },
  //去课程
  goClass: function(){
    wx.navigateTo({
      url: '../weekClass/weekClass'
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