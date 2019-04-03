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
    id: '',
    days: '',
    play: false,
    innerAudioContext: {},
    isSx: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    this.setData({
      id: options.id
    })
    
  },
  getDetail: function(idx){
    var that = this;
    http.postReq('/api/Article/info', { id: this.data.id},function(res){
      if(res.code == 101){
        that.setData({
          info: res.data
        });
        var list = that.data.info.yp;
        var innerAudioContext = that.data.innerAudioContext;
        if (typeof idx != 'undefined' && list[idx + 1] && that.data.isSx) {
          if (innerAudioContext.destroy) {
            innerAudioContext.destroy()
          }
          that.loadAudio(list[idx+1].file, idx+1);
          that.playAudio(idx + 1);
        } else if (idx == list.length-1){
          if (innerAudioContext.destroy) {
            innerAudioContext.destroy()
            that.setData({
              isSx: false
            })
          }
        }
        wx.setStorageSync('bookInfo', res.data);
      }else{
        wx.showToast({
          title: res.msg,
          icon: 'none'
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
    if (!this.isreaded() || (info.dt.name && !info.dt.flag) || (info.sp.name && !info.sp.flag)) {
      this.toast();
      return false;
    }
    http.postReq('/api/Clock/signInArticle', { aid: info.id }, function (res) {
      if (res.code == 101) {
        app.mtj.trackEvent('endread');
        that.getDetail();
        that.setData({
          signBoxShow: true,
          days: res.data
        })
      }
    })
  },
  closeMask: function(){
    this.setData({
      signBoxShow: false
    })
  },
  //播放
  playAudio: function (idx) {
    var innerAudioContext = this.data.innerAudioContext;
    var list = this.data.info.yp;
    list.forEach(function(item,index){
      if(index == idx){
        if (item.play) {
          innerAudioContext.pause()
        } else {
          innerAudioContext.play()
        }
      }
    })
  },
  //顺序播放
  goPlay: function(){
    var that = this;
    var list = this.data.info.yp;
    var aid = list[0].id;
    this.setData({
      isSx: true
    });
    that.loadAudio(list[0].file, 0);
    that.playAudio(0);
    // for(var i = 0;i < list.length;i++){
    //   if (!list[i].flag){
    //     aid = list[i].id
    //     return;
    //   }
    // }
    // wx.setStorageSync('bookInfo', this.data.info);
    // wx.navigateTo({
    //   url: '../read/read?id=' + aid + '&isList=' + 1
    // })
  },
  //加载音频
  loadAudio: function (src,idx) {
    var that = this;
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    const innerAudioContext = wx.createInnerAudioContext();
    // innerAudioContext.loop = true
    innerAudioContext.src = src;
    innerAudioContext.obeyMuteSwitch = false;
    wx.setInnerAudioOption({ obeyMuteSwitch: false });
    var info = this.data.info;
    var list = info.yp;
    innerAudioContext.onPlay(() => {
      console.log('开始播放')
      wx.hideLoading();
      list.forEach(function (item, index) {
        if (index == idx) {
          item.play = true
        }else{
          item.play = false
        }
      })
      that.setData({ info: info })
    })
    innerAudioContext.onPause(() => {
      console.log('暂停播放')
      list.forEach(function (item, index) {
        if (index == idx) {
          item.play = false
        }
      })
      that.setData({ info: info })
    })
    innerAudioContext.onEnded(() => {
      // list[idx].id
      http.postReq('/api/Yp/info', { id: list[idx].id }, function (res) {
        if (res.code == 101) {
          that.getDetail(idx);
        }
      })
    })
    innerAudioContext.onCanplay(() => {
      
    })
    innerAudioContext.onTimeUpdate((res) => {
      
    })
    innerAudioContext.onError((res) => {
      
    })
    this.setData({
      innerAudioContext: innerAudioContext
    })
  },
  goPlay2: function(e){
    var that = this;
    var idx = e.currentTarget.dataset.idx;
    var info = this.data.info;
    var list = info.yp;
    if (idx != 0 && !list[idx - 1].flag) {
      that.toast();
    } else {
      // list.forEach(function(item){
      //   item.play = false;
      // })
      // list[idx].play = true;
      // that.setData({
      //   info: info
      // })
      that.setData({
        isSx: false
      });
      var innerAudioContext = this.data.innerAudioContext;
      if (innerAudioContext.src && innerAudioContext.src == list[idx].file) {

      } else {
        if (innerAudioContext.destroy){
          innerAudioContext.destroy()
        }
        that.loadAudio(list[idx].file, idx);
      }
      
      that.playAudio(idx);
    }
  },
  //跳转阅读详情
  goDetail: function(e){
    var that = this;
    var idx = e.currentTarget.dataset.idx;
    var list = this.data.info.yp;
    console.log(e)
    if (idx != 0 && !list[idx-1].flag){
      that.toast();
    } else {
      
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
    
    if (!this.isreaded()){
      this.toast();
      return false;
    }
    var info = this.data.info;
    if(info.dt.flag){
      wx.navigateTo({
        url: '../answerResolution/answerResolution?aid=' + this.data.info.id
      })
    }else{
      wx.navigateTo({
        url: '../answer/answer?aid=' + this.data.info.id
      })
    }
  },
  //去课程
  goClass: function(){
    var info = this.data.info;
    if (!this.isreaded() || (info.dt.name && !info.dt.flag)) {
      this.toast();
      return false;
    }
    wx.navigateTo({
      url: '../weekClass/weekClass?aid=' + info.sp.id + '&dkid=' + this.data.info.id
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
    this.getDetail();
    app.mtj.trackEvent('startread');
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
        })
      },
      fail: function (res) {
        // 分享失败
        console.log(res)
      }
    }
  }
})