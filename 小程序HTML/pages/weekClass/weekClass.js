// pages/weekClass/weekClass.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    signBoxShow:false,
    is_display:false,
    videoContext:'',
  },


  signBtn:function(){
    this.setData({
      signBoxShow: true
    })
  },
  closeMask: function () {
    // this.setData({
    //   signBoxShow: false
    // })
    wx.reLaunch({
      url: '../index/index'
    })
  },
  bindplay: function () {//开始播放按钮或者继续播放函数
    //this.data.VideoContext.requestFullScreen();
    this.setData({
      is_display: true
    });
    this.data.videoContext.play();

  },
  playVideo: function () {
    this.bindplay();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.videoContext = wx.createVideoContext('myVideo');
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
  onShareAppMessage: function (res) {
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