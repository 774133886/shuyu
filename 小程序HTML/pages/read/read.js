// pages/read/read.js
const util = require('../../utils/util.js')
const http = require('../../http.js')
const app = getApp();



Page({

  /**
   * 页面的初始数据
   */
  data: {
    play: false,
    duration: '00:00',
    currentTime: '00:00',
    progress: '0%',
    info: {},
    isComplete: false,
    nextId: '',
    innerAudioContext: {},
    lookTime: 0
  },

  //播放
  playAudio: function(){
    var innerAudioContext = this.data.innerAudioContext;
    if(this.data.play){
      innerAudioContext.pause()
    }else{
      innerAudioContext.play()
    }
  },
  //判断是否最后一个
  isLast: function(){
    var bookInfo = wx.getStorageSync('bookInfo');
    var list = bookInfo.yp;
    var id = this.data.info.id;
    var that = this;
    for(var i = 0;i < list.length;i++){
      if (list[i].id == id) {
        if (i == list.length - 1 && !bookInfo.dt.flag){
          that.setData({
            isComplete: true
          })
        }else{
          that.setData({
            isComplete: false,
            nextId: list[i + 1].id
          })
        }
      } 
    }
  },
  //详情跳转
  goReadDetail: function(){
    wx.setStorageSync('yw', this.data.info.yw);
    wx.redirectTo({
      url: '../readDetail/readDetail'
    })
  },
  goReadDetail2: function () {
    var id = this.data.nextId;
    this.getAudio(id);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    this.getAudio(options.id);

  },
  //去答题
  goAnswer: function () {
    var info = wx.getStorageSync('bookInfo');
    if(!info.dt.name){
      wx.showToast({
        title: '该任务没有答题',
        icon: 'none'
      })
      return false;
    }
    if(info.dt.flag){
      wx.redirectTo({
        url: '../answerResolution/answerResolution?aid=' + info.id
      })
    }else{
      wx.redirectTo({
        url: '../answer/answer?aid=' + info.id
      })
    }
    
  },
  //获取音频
  getAudio: function(id){
    var that = this;
    
    http.postReq('/api/Yp/info', { id: id }, function (res) {
      if (res.code == 101) {
        that.loadAudio(res.data.file);
        var time = that.data.lookTime;
        if(time){
          var lookTime = app.getTime(time);
          //浏览时间
          app.mtj.trackEvent('tisklook', {
            article: res.data.name,
            time: lookTime
          });
        }
        that.setData({
          info: res.data,
          lookTime: app.getNow()
        });
        that.isLast();
      }
    })
  },
  //音频初始化
  loadAudio: function(src){
    var that = this;
    if (this.data.innerAudioContext.src){
      console.log(1243)
      this.data.innerAudioContext.destroy();
      this.setData({
        play: false,
        duration: '00:00',
        currentTime: '00:00',
        progress: '0%'
      })
    }
    const innerAudioContext = wx.createInnerAudioContext()
    // innerAudioContext.loop = true
    innerAudioContext.src = src;
    innerAudioContext.obeyMuteSwitch = false;
    innerAudioContext.onPlay(() => {
      console.log('开始播放')
      that.setData({ play: true })
    })
    innerAudioContext.onPause(() => {
      console.log('暂停播放')
      that.setData({ play: false })
    })
    var getDuration = setInterval(function () {
      var duration = innerAudioContext.duration
      if (duration > 0) {
        that.setData({
          duration: that.formatTime(duration)
        })
        console.log(duration);
        clearInterval(getDuration);
      }
    }, 500)
    innerAudioContext.onCanplay(() => {
      
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
    this.setData({
      innerAudioContext: innerAudioContext
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
    var innerAudioContext = this.data.innerAudioContext;
    innerAudioContext.destroy();
    var that = this;
    var time = that.data.lookTime;
    if (time) {
      var lookTime = app.getTime(time);
      //浏览时间
      app.mtj.trackEvent('tisklook', {
        article: that.info.name,
        time: lookTime
      });
    }
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