// pages/taskList/taskList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isComplete: false,
    signBoxShow: false
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
  //打卡
  clockIn: function(){
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
    if (e.currentTarget.dataset.last == 1){
      wx.showToast({
        title: '为了更好的阅读效果，请先完成之前的内容',
        icon: 'none',
        duration: 2000
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
    var that = this;
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '跟我一起重新认识一本书',
      path: '/pages/index/index',
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