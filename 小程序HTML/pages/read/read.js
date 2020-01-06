// pages/read/read.js
const util = require('../../utils/util.js')
const http = require('../../http.js')
const app = getApp()
var WxParse = require('../../wxParse/wxParse.js')



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
    lookTime: 0,
    scrollTop: 0,
    isList: false,
    isPlay: false,
    isLoadAudio: false,
    isdati: false,
    isqujie: false,
    isdk: false,
    signBoxShow: false,
    optionsId: '',
    days: ''
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
        if (i == list.length - 1){
          that.setData({
            isComplete: true
          })
        }else{
          that.setData({
            isComplete: false,
            nextId: list[i + 1] ? list[i + 1].id : ''
          })
        }
      } 
    }
    if (this.data.isComplete && bookInfo.dt.name){
      this.setData({
        isdati: true
      })
    }else{
      this.setData({
        isdati: false
      })
    }
    if (this.data.isComplete && bookInfo.sp.length != 0) {
      this.setData({
        isqujie: true
      })
    } else {
      this.setData({
        isqujie: false
      })
    }
    if (this.data.isComplete && bookInfo.dk) {
      this.setData({
        isdk: true
      })
    } else {
      this.setData({
        isdk: false
      })
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
    if (options.isList){
      that.setData({
        isList: options.isList
      })
    }
    
    if (options.isPlay) {
      that.setData({
        isPlay: options.isPlay
      })
    }
    this.setData({
      optionsId: options.id
    });
    this.getAudio(options.id);

  },
  //去答题
  goAnswer: function () {
    var info = wx.getStorageSync('bookInfo');
    // if(!info.dt.name){
    //   wx.showToast({
    //     title: '该任务没有答题',
    //     icon: 'none'
    //   })
    //   return false;
    // }
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
  goAnswer2: function () {
    var info = wx.getStorageSync('bookInfo');
    wx.redirectTo({
      url: '../weekClass/weekClass?aid=' + info.id
    })
  },
  goAnswer3: function () {
    var info = wx.getStorageSync('bookInfo');
    var that = this;
    http.postReq('/api/Clock/signInArticle', { aid: info.id }, function (res) {
      if (res.code == 101) {
        app.mtj.trackEvent('endread');
        that.setData({
          signBoxShow: true,
          days: res.data
        })
      }
    })
  },
  closeMask:function(){
    this.setData({
      signBoxShow: false
    });
    this.getAudio(this.data.optionsId);
  },
  goAnswer4: function () {
    wx.navigateBack({})
  },
  //获取音频
  getAudio: function(id){
    var that = this;
    
    http.postReq('/api/Yp/info', { id: id }, function (res) {
      if (res.code == 101) {
        if (res.data.file){
          that.loadAudio(res.data.file);
        }else{
          that.setData({
            isLoadAudio: false
          })
        }
        
        var time = that.data.lookTime;
        if(time){
          var lookTime = app.getTime(time);
          //浏览时间
          
          app.mtj.trackEvent('tisklook', {
            article: res.data.name,
            time: lookTime,
          });
        }
        that.setData({
          info: res.data,
          lookTime: app.getNow(),
          scrollTop: 0
        });
        WxParse.wxParse('article', 'html', that.data.info.content, that, 5);
        that.isLast();
      }
    })
  },
  //音频初始化
  loadAudio: function(src){
    var that = this;
    if (this.data.innerAudioContext.src){
      this.data.innerAudioContext.destroy();
      this.setData({
        play: false,
        duration: '00:00',
        currentTime: '00:00',
        progress: '0%'
      })
    }
    const innerAudioContext = wx.createInnerAudioContext();
    // innerAudioContext.loop = true
    innerAudioContext.src = src;
    innerAudioContext.obeyMuteSwitch = false;
    wx.setInnerAudioOption({ obeyMuteSwitch: false});
    setTimeout(function(){
      if (that.data.isList) {
        innerAudioContext.play();
        innerAudioContext.onEnded(() => {
          var id = that.data.nextId;
          that.getAudio(id);
          innerAudioContext.offEnded();
        })
      }
      if (that.data.isPlay) {
        innerAudioContext.play();
        that.setData({ isPlay: false })
      }
    },0)
    
    innerAudioContext.onPlay(() => {
      console.log('开始播放')
      that.setData({ play: true })
    })
    innerAudioContext.onPause(() => {
      console.log('暂停播放')
      that.setData({ play: false })
    })
    innerAudioContext.onEnded(() => {
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
      that.setData({
        isLoadAudio: true
      })
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
    if (innerAudioContext.destroy){
      innerAudioContext.destroy();
    }
    var that = this;
    var time = that.data.lookTime;
    console.log(that)
    if (time) {
      var lookTime = app.getTime(time);
      //浏览时间
      app.mtj.trackEvent('tisklook', {
        article: that.data.info.name,
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
    var that = this;
    // if (res.from === 'button') {
    //   // 来自页面内转发按钮
    //   console.log(res.target)
    // }
    var user = wx.getStorageSync('user');
    return {
      title: '跟我一起重新认识一本书',
      path: '/pages/index/index?pid=' + user.id,
      imageUrl: '/files/share.jpg',
      success: (res) => {    // 成功后要做的事情
        //console.log(res.shareTickets[0])
        // console.log
        that.setData({
          signBoxShow: false
        });
        that.getAudio(options.id);
      },
      fail: function (res) {
        // 分享失败
        console.log(res)
      }
    }
  }
})