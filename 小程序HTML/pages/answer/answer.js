// pages/answer/answer.js
var http = require('../../http.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
	id:'',
	answerList:[],
  answer: [],
  answerTime: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
	var token = wx.getStorageSync('token');
    var that = this;
    this.setData({
      id: options.aid,
      answerTime: app.getNow()
    }) 
    var data = {};
    data.token = token;
    data.aid = that.data.id;
    http.postReq('/api/Answer/getQuestions', data, function (res) {
      if (res) {
        that.setData({
          answerList: res.data.rows
        }) 
        var answer = that.data.answer
        for (let i = 0; i < that.data.answerList.length; i++) {
          answer.push({ "id": "", "answer": "" })
          answer[i].id = that.data.answerList[i].id
        }
        that.setData({
          answer: answer
        }) 
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 2000
        })
      }
 
      console.log(res)
    });
  },
  //选择此项
  chooseThis: function (e) {
    var that = this;
    var idx = e.currentTarget.dataset.idx;
    var index = e.currentTarget.dataset.index;
    var choice = e.currentTarget.dataset.name;
    var answer = that.data.answer;
    var answerList = that.data.answerList;
    
    answer[index].answer = choice;
    answerList[index].questions.forEach(function(i,j){
      i.selected = false;
    })
    answerList[index].questions[idx].selected = true;
    console.log(answerList);
    that.setData({
      answer: answer,
      answerList: answerList
    }) 
  },
  //提交
  formSubmit: function () {
    let that = this;
    var answer = that.data.answer
    for (let i = 0; i < answer.length; i++) {
      if (answer[i].answer==''){
        wx.showToast({
          title: '答题未完成,请补全选项',
          icon: 'none',
          duration: 2000
        })
        return false;
      }
    }
    var data = {};
    data.answer = JSON.stringify(answer) ;
    data.aid = that.data.id;
    console.log(data);
    // var data = JSON.stringify(data);
    // console.log(typeof (data))
    http.postReq('/api/Answer/submit', data, function (res) {
      if (res) {
        console.log(111)
        var time = that.data.answerTime;
        var answerTime = app.getTime(time);
        var info = wx.getStorageSync('bookInfo');
        that.setData({
          answerTime: 0
        });
        //答题时间
        app.mtj.trackEvent('answertime', {
          article: info.name,
          time: answerTime,
        });
       
        // 正确率
        var i = 0;
        var len = res.data.rows.length;
        var info = wx.getStorageSync('bookInfo');
        res.data.rows.forEach(function (arr, index) {
          console.log(index, arr)
          // 每题正确率
          if (arr.myanswer == arr.answer) {
            i++;
            app.mtj.trackEvent('each_accuracy', {
              answername: arr.name,
              accuracy: 1,
            });
          } else {
            app.mtj.trackEvent('each_accuracy', {
              answername: arr.name,
              accuracy: 0,
            });
          }
          console.log(i);

        })
        // 章节正确率
        app.mtj.trackEvent('article_accuracy', {
          article: info.name,
          accuracy: +(i / len).toFixed(2),
        });
        // 跳转解析
        wx.redirectTo({
          url: '../answerResolution/answerResolution?aid=' + that.data.id
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 2000
        })
      }
    });
    
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