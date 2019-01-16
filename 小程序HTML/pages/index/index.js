// pages/index/index.js
const util = require('../../utils/util.js')
const http = require('../../http.js')
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    mask: false,
    mask2: false,
    shareMask: false,
    cType: 'car',
    scrollTop: 0,
    isLogin: true,
    user: '',
    list: [{},{},{},{},{},{}],
    activeIdx: 0,
    isIphone: false,
    firstIn: false
  },
  //swiper
  swiperChange: function(e){
    this.setData({
      activeIdx: e.detail.current
    })
  },
  //开启遮罩
  openMask: function(e){this.setData({mask: true,payBookId: e.currentTarget.dataset.id});},
  //关闭遮罩
  closeMask: function () {this.setData({mask: false})},
  //开启中断遮罩
  openMask2: function () {this.setData({mask2: true})},
  //关闭中断遮罩
  closeMask2: function () { this.setData({ mask2: false }) },
  //开启分享遮罩
  openShareMask: function () { this.setData({ shareMask: true, mask2: false }) },
  //关闭分享遮罩
  closeShareMask: function () { this.setData({ shareMask: false }) },
  //开启中断阅读选择
  choiceType: function(e){
    this.setData({
      cType: e.currentTarget.dataset.type
    })
  },
  //提示
  noTap: function(){
    wx.showToast({
      title: '这不是今天的任务哦~',
      icon: 'none'
    })
  },
  //开启中断阅读确认
  submitType: function(){
    var cType = this.data.cType;
    if(cType == 'wechat'){
      wx.navigateTo({
        url: '../taskList/taskList'
      })
    }else if(cType == 'car'){
      this.openShareMask()
    }
  },
  //阅读跳转
  goReadMain: function(){
    wx.navigateTo({
      url: '../taskList/taskList?id=1'
    })
  },
  //我的跳转
  goPersonal: function(){
    wx.navigateTo({
      url: '../personal/personal'
    })
  },
  //用户点击登录按钮
  userInfoHandler: function(e) {
    
    var that = this;
    wx.getSetting({
      success: function(res) {
        console.log(res.authSetting['scope.userInfo'])
        if (!res.authSetting['scope.userInfo']) {
          wx.showModal({
            title: '警告',
            content: '小程序需要您的授权进行登录，如果您拒绝，您将无法正常使用；后期如有需要可将小程序删除后重新搜索，重新授权方可使用。',
            cancelText: "不授权",
            confirmText: '授权',
            success(res) {
              if (res.confirm) {
                wx.openSetting({
                  success: function(res) {
                    if (!res.authSetting["scope.userInfo"]) {
                      //这里是授权成功之后 填写你重新获取数据的js
                      //参考:
                      
                    }else{
                      that.userLogin();
                    }
                  }
                })
              }
            }
          })
        } else {
          that.userLogin();
        }
      },
      fail:function(res){
        console.log('授权失败');
      }
    });
  },
  //用户登录
  userLogin: function(){
    var that = this;
    wx.login({
      success: function (res1) {
        if (res1.code) {
          wx.request({
            url: 'https://shuyu.qingshanyuwo.cn/api/Login/code2Session?code=' + res1.code,
            success: function (res2) {
              if (res2.data.openid) {
                wx.getUserInfo({
                  success: function (res3) {
                    wx.request({
                      url: 'https://shuyu.qingshanyuwo.cn/api/login/third_login',
                      data: {
                        nickname: res3.userInfo.nickName,
                        openid: res2.data.openid,
                        img: res3.userInfo.avatarUrl,
                        // pid: ''  //邀请人id
                      }, success: function (res4) {
                        wx.setStorageSync('token', res4.data.data.token);
                        that.setData({
                          isLogin: false,
                          firstIn: true
                        })
                        that.getlist();
                      }
                    })
                  }
                })
              }
            }
          })
        }
      }
    })
  },
  //用户是否授权
  loadUser: function () {
    var that = this;
    var token = wx.getStorageSync('token');
    wx.getSetting({
      success: function (res) {
        if (!res.authSetting['scope.userInfo']) {
          that.setData({
            isLogin: true
          })
        }else{
          if(!token){
            that.userLogin();
          }
          that.setData({
            isLogin: false
          })
        }
      }
    })
  },
  //getlist
  getlist: function(){
    var token = wx.getStorageSync('token');
    if(!token) return;
    var that = this;
    http.getReq('/api/Index/getBooks',function(res){
      that.setData({
        list: res.data.rows
      })
    })
  },
  //点击去付款
  goPay: function(){
    console.log(this.data.payBookId)
    var that = this;
    var bookId = this.data.payBookId;
    
    http.postReq('/api/Book/buy', {book_id: bookId},function(res){
      var data = res.data;
      console.log(data.nonceStr);
      // wx.requestPayment({
      //   timeStamp: String(data.timesTamp),
      //   nonceStr: data.nonceStr,
      //   package: data.package,
      //   signType: 'MD5',
      //   paySign: data.paySign,
      //   success(res) {
      //     wx.showToast({
      //       title: '支付成功',
      //       icon: 'none'
      //     });
      //     that.setData({
      //       mask: false
      //     });
      //     that.getlist();
      //   },
      //   fail(res) {
      //     console.log(res)
      //     wx.showToast({
      //       title: '支付失败',
      //       icon: 'none'
      //     })
      //   }
      // })
    })
  },
  //滚动位置
  listLocation: function (selectId) {
    var that = this;
    var active = wx.createSelectorQuery().select('#indexCtt').fields({
      dataset: true,
      size: true,
      scrollOffset: true,
      rect: true
    }, function (res) {
      var cttTop = res.top;
      var active2 = wx.createSelectorQuery().select('#' + selectId).fields({
        dataset: true,
        size: true,
        scrollOffset: true,
        rect: true
      }, function (res) {
        var itemTop = res.top - cttTop;
        that.setData({
          scrollTop: itemTop
        })
      }).exec()
    }).exec()
    
  },
  //获取手机号
  getPhoneNumber: function (e) {
    console.log(e.detail.iv);
    console.log(e.detail.encryptedData);
    // wx.login({
    //   success: res => {
    //     console.log(res.code);
    //     wx.request({
    //       url: 'https://你的解密地址',
    //       data: {
    //         'encryptedData': encodeURIComponent(e.detail.encryptedData),
    //         'iv': e.detail.iv,
    //         'code': res.code
    //       },
    //       method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    //       header: {
    //         'content-type': 'application/json'
    //       }, // 设置请求的 header
    //       success: function (res) {
    //         if (res.status == 1) {//我后台设置的返回值为1是正确
    //           //存入缓存即可
    //           wx.setStorageSync('phone', res.phone);
    //         }
    //       },
    //       fail: function (err) {
    //         console.log(err);
    //       }
    //     })
    //   }
    // })
  },
  //首次进入提示
  firstCome: function(){
    wx.setStorageSync("first", true);
    this.setData({
      firstIn: false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    
    this.loadUser();
    this.getlist();
    var that = this;
    //iphone 底部横线适配
    var iphones = ['iPhone X', 'unknown<iPhone11,2>', 'unknown<iPhone11,8>', 'unknown<iPhone11,4>','unknown<iPhone11,6>']
    wx.getSystemInfo({
      success: function (res) {
        //console.log(res.model)
        //console.log(res.language)//zh_CN(en)
        //console.log(res.model=="iPhone X")
        console.log(iphones.indexOf(res.model) > -1)
        if (iphones.indexOf(res.model) > -1) {
          that.setData({
            isIphone: true
          })
        }
      }
    })
    //判断首次进入提示滑动
    console.log(wx.getStorageSync("first"))
    if (wx.getStorageSync("first") == null || wx.getStorageSync("first") == ""){
      this.setData({
        firstIn: true
      })
    }else{
      this.setData({
        firstIn: false
      })
    }

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    
  },
  
  goRead:function(){
    
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.setData({
      pages: 1,
      totalPage: 1
    });
    this.load();
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})