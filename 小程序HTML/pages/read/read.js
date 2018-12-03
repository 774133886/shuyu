// pages/read/read.js

const innerAudioContext = wx.createInnerAudioContext()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    play: false,
    duration: '00:00',
    currentTime: '00:00',
    progress: '0%'
  },

  //播放
  playAudio: function(){
    if(this.data.play){
      innerAudioContext.pause()
    }else{
      innerAudioContext.play()
    }
  },
  //详情跳转
  goReadDetail: function(){
    wx.navigateTo({
      url: '../readDetail/readDetail'
    })
  },
  goReadDetail2: function () {
    wx.navigateTo({
      url: '../readDetail/readDetail?id=1'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    innerAudioContext.loop = true
    innerAudioContext.src = 'http://ting666.yymp3.com:86/new27/yuxi/4.mp3'
    
    innerAudioContext.onPlay(() => {
      console.log('开始播放')
      that.setData({ play: true })
    })
    innerAudioContext.onPause(() => {
      console.log('暂停播放')
      that.setData({ play: false })
    })
    console.log(innerAudioContext)
    innerAudioContext.onCanplay(() => {
      var getDuration = setInterval(function () {
        var duration = innerAudioContext.duration
        if(duration > 0){
          that.setData({
            duration: that.formatTime(duration)
          })
          console.log(duration);
          clearInterval(getDuration);
        }
      },500)
    })
    
    
    innerAudioContext.onTimeUpdate((res) => {
      var porg = this.data.progress;
      var duration = innerAudioContext.duration;
      var currentTime = innerAudioContext.currentTime;
      porg = currentTime / duration * 100 + '%'
      that.setData({
        currentTime: that.formatTime(currentTime),
        progress: porg
      })
      console.log(innerAudioContext.duration)
    })
    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })

  },

  //格式化时间
  formatTime: function(time){
    var hours = parseInt(time/60);
    var minute = parseInt(time%60);
    return (hours < 10 ? '0'+hours : hours)+':'+(minute < 10 ? '0'+minute : minute)
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