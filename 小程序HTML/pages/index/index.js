// pages/index/index.js
const util = require('../../utils/util.js')
const http = require('../../http.js')
const app = getApp();
var WxParse = require('../../wxParse/wxParse.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    mask: false,
    mask2: false,
    shareMask: false,
    isPhone: false,
    cType: 'car',
    scrollTop: 0,
    isLogin: false,
    user: '',
    list: [],
    activeIdx: 0,
    isIphone: false,
    firstIn: false,
    pid: '',
    content: '',
    tid: '',
    swiperIdx: 0,
    payBook: {},
    lookTime: 0,
    noData: false,
    p_show:false,
    iphoneId: '',
    systemInfo:{},
    isIos:false,
  },
  //swiper
  swiperChange: function(e){
    this.setData({
      activeIdx: e.detail.current
    });
    //每本书页面的访问量
    var book = this.data.list[e.detail.current];
    app.mtj.trackEvent('books', {
      book: book.name
    });
  },
  
  //开启遮罩
  openMask: function(e){
    var token = wx.getStorageSync('token');
    if(!token) {
      this.setData({
        isLogin:true
      })
      return
    };
    // 判断是否绑定手机号
    var phone = wx.getStorageSync('phone');
    if (phone == '' && this.data.p_show){
      this.setData({
        isPhone: true,
        payBook: e.currentTarget.dataset.item,
        content: e.currentTarget.dataset.content,
        lookTime: app.getNow()
      });
      return false;
    }
    var that = this;
    // 判断IOS
    if (this.data.isIos){
      // wx.showModal({
      //   title: '温馨提示',
      //   content: '小程序暂不支持开启阅读',
      //   confirmText:'好的',
      //   showCancel: false
      // })

      let bookid = e.currentTarget.dataset.bookid;
     
      // 新增免费
      wx.showModal({
        title: '提示',
        content: '确认开启本书籍？',
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
            console.log(bookid)
            that.open(bookid);
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })

      return false;
    }

    this.setData({
      mask: true,
      payBook: e.currentTarget.dataset.item,
      content: e.currentTarget.dataset.content,
      lookTime: app.getNow()
    });

    WxParse.wxParse('article', 'html', e.currentTarget.dataset.content, that, 5);
    this.clickBtn('一元挑战按钮');
  },
  //关闭遮罩
  closeMask: function () {
    this.setData({mask: false});
    var time = this.data.lookTime;
    var lookTime = app.getTime(time);
    this.setData({
      lookTime: 0
    });
    //浏览时间
    app.mtj.trackEvent('lookmask', {
      time: lookTime, 
    });
  },
  //开启中断遮罩
  openMask2: function (e) {
    this.setData({mask2: true})
  },
  //关闭中断遮罩
  closeMask2: function () { this.setData({ mask2: false }) },
  //开启分享遮罩
  openShareMask: function () { this.setData({ shareMask: true, mask2: false }) },
  //关闭分享遮罩
  closeShareMask: function () { 
    wx.navigateTo({
      url: '../poster/poster?id=' + this.data.list[this.data.activeIdx].id,
    })
    this.setData({ shareMask: false });
  },
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
  goReadMain: function(e){
    var item = e.currentTarget.dataset.item;
    var book = e.currentTarget.dataset.book;
    if(!book.buy){
      return false;
    }
    if(item.buy){
      this.setData({
        mask2: true,
        articleId: item.id,
        payBook: book,
      });
      return false;
    }
    if (item.read) {
      wx.navigateTo({
        url: '../taskList/taskList?id=' + item.id
      })
      if(item.today){
        this.clickBtn('今日任务按钮');
      }else{
        this.clickBtn('查看已阅读按钮');
      }
    }else{
      this.noTap();
    }
  },
  //我的跳转
  goPersonal: function(){
    var token = wx.getStorageSync('token');
    if(!token) {
      this.setData({
        isLogin:true
      })
      return
    };
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
          that.setData({
            isLogin: false,
            // firstIn: true
          })
          console.log(11111)
          // wx.showModal({
          //   title: '警告',
          //   content: '小程序需要您的授权进行登录，如果您拒绝，您将无法正常使用；后期如有需要可将小程序删除后重新搜索，重新授权方可使用。',
          //   cancelText: "不授权",
          //   confirmText: '授权',
          //   success(res) {
          //     if (res.confirm) {
          //       wx.openSetting({
          //         success: function(res) {
          //           if (!res.authSetting["scope.userInfo"]) {
          //             //这里是授权成功之后 填写你重新获取数据的js
          //             //参考:
          //             that.userLogin();
          //           }else{
          //             that.userLogin();
          //           }
          //         }
          //       })
          //     }
          //   }
          // })
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
    var pid = this.data.pid;
    wx.login({
      success: function (res1) {
        if (res1.code) {
          wx.request({
            url: 'https://shuyu.educhinstyle.cn/api/Login/code2Session?code=' + res1.code,
            success: function (res2) {
              if (res2.data.openid) {
                wx.setStorageSync('sskey', res2.data.session_key);
                wx.getUserInfo({
                  success: function (res3) {
                    wx.request({
                      url: 'https://shuyu.educhinstyle.cn/api/login/third_login',
                      data: {
                        nickname: res3.userInfo.nickName,
                        openid: res2.data.openid,
                        img: res3.userInfo.avatarUrl,
                        pid: pid  //邀请人id
                      }, success: function (res4) {
                        wx.setStorageSync('token', res4.data.data.token);
                        wx.setStorageSync('user', res4.data.data.info);
                        // 存入一个空手机号
                        wx.setStorageSync('phone', res4.data.data.info.mobile ? res4.data.data.info.mobile : '');
                        wx.setStorageSync("first", '');
                        that.setData({
                          isLogin: false,
                          // firstIn: true
                          // isPhone: true
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
        // console.log(res);
        if (!res.authSetting['scope.userInfo']) {
          that.setData({
            // isLogin: true
            firstIn: true,
          })
        } else {
          
          if(!token){
            that.userLogin();
          }
          that.setData({
            isLogin: false
          })
          console.log(2222)
        }
      }
    })
  },
  //getlist
  getlist: function(){
    // var token = wx.getStorageSync('token');
    // if(!token) return;
    var that = this;
    http.getReq('/api/Index/getBooks',function(res){
      // res.data.rows[0].articles[1].time = '2019.06.09'
      that.setData({
        list: res.data.rows,
        // 获取显示隐藏
        p_show: res.data.flag
      });
      if (res.data.rows.length == 0){
        that.setData({
          noData: true
        });
      }
      that.listLocation();
      console.log(res.data.rows);
      var book = that.data.list[0];
      if (book){
        app.mtj.trackEvent('books', {
          book: book.name
        });
      }
    })
  },
  //点击去付款
  goPay: function(){
    var that = this;
    var bookId = this.data.payBook.id;
    var time = this.data.lookTime;
    var lookTime = app.getTime(time);
    this.setData({
      lookTime: 0
    });
    //浏览时间
    app.mtj.trackEvent('lookmask', {
      time: lookTime,
    });
    wx.showLoading({
      title: '',
    })
    http.postReq('/api/Book/buy', {book_id: bookId},function(res){
      var data = res.data;
      that.wxPay(data,function(){
        //分享成功购买统计
        if (that.data.pid) {
          app.mtj.trackEvent('sharebuy', {
            user: pid,
          });
        }
        wx.hideLoading();
        wx.navigateTo({
          url: '../paySuccess/paySuccess?money=' + that.data.payBook.price
        });
      });
    })
  },
  //中断阅读支付
  goPay2: function(){
    var that = this;
    var bookId = this.data.articleId;
    var cType = this.data.cType;
    console.log(that.data.payBook)
    if (cType == 'wechat'){
      wx.showLoading({
        title: '',
      })
      http.postReq('/api/Article/buy', { aid: bookId }, function (res) {
        var data = res.data;
        that.wxPay(data,function(){
          wx.hideLoading();
          that.setData({
            mask2: false
          });
          wx.navigateTo({
            url: '../paySuccess/paySuccess?money=' + that.data.payBook.price
          });
        });
      })
    }else{
      http.postReq('/api/Article/coupon', { aid: bookId }, function (res) {
        if(res.code == 120){
          that.setData({
            shareMask: true,
            mask2: false
          });
        }
        else{
          that.setData({
            mask2: false
          });
          that.getlist();
        }
      })
    }
  },
  //付款
  wxPay: function(data,func){
    var that = this;
    wx.requestPayment({
      appId: data.appid,
      timeStamp: String(data.timeStamp),
      nonceStr: data.nonceStr,
      package: data.package,
      signType: 'MD5',
      paySign: data.paySign,
      success(res) {
        wx.showToast({
          title: '支付成功',
          icon: 'none'
        });
        that.setData({
          mask: false,
          mask2: false
        });
        that.getlist();
        typeof func == 'function' && func();
      },
      fail(res) {
        console.log(res)
        wx.showToast({
          title: '支付失败',
          icon: 'none'
        })
      }
    })
  },
  //滚动位置
  listLocation: function () {
    var that = this;
    var list = this.data.list;
    var tid = this.data.tid;
    if(!tid){
      return;
    }
    for(var i = 0;i < list.length;i++){
      if(list[i].id == tid){
        that.setData({
          swiperIdx: i
        })
      }
    }
    // var active = wx.createSelectorQuery().select('#indexCtt').fields({
    //   dataset: true,
    //   size: true,
    //   scrollOffset: true,
    //   rect: true
    // }, function (res) {
    //   var cttTop = res.top;
    //   var active2 = wx.createSelectorQuery().select('#' + selectId).fields({
    //     dataset: true,
    //     size: true,
    //     scrollOffset: true,
    //     rect: true
    //   }, function (res) {
    //     var itemTop = res.top - cttTop;
    //     that.setData({
    //       scrollTop: itemTop
    //     })
    //   }).exec()
    // }).exec()
    
  },
  //获取手机号
  getPhoneNumber: function (e) {
    // console.log(e.detail.iv);
    // console.log(e.detail.encryptedData);

    var that = this;

    wx.checkSession({
      success() {
        //session_key 未过期，并且在本生命周期一直有效
        wx.request({
          url: 'https://shuyu.educhinstyle.cn/api/Login/decode',
          data: {
            'encryptedData': e.detail.encryptedData,
            'iv': encodeURIComponent(e.detail.iv),
            'sessionKey': wx.getStorageSync('sskey')
          },
          method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          // header: {
          //   'content-type': 'application/json'
          // }, // 设置请求的 header
          success: function (res) {
            if (res.data.phoneNumber) {//我后台设置的返回值为1是正确

              http.postReq('/api/User/bindMobile', { 'mobile': res.data.phoneNumber }, function (res1) {
                if (res1.code == 101) {
                  that.setData({
                    isPhone: false,
                  });

                  //存入缓存即可
                  wx.setStorageSync('phone', res.data.phoneNumber);
                  // 判断IOS
                  if (this.data.isIos) {
                    // wx.showModal({
                    //   title: '温馨提示',
                    //   content: '小程序暂不支持开启阅读',
                    //   confirmText: '好的',
                    //   showCancel: false
                    // })
                    // return false;

                    
                  }
                  that.setData({
                    mask: true
                  });
                } else {
                  wx.showToast({
                    title: res1.msg,
                    icon: 'none'
                  })
                }
              })

            } else {
              // 还是关闭弹窗
              wx.showToast({
                title: '获取手机号失败',
                icon: 'none'
              });
              that.setData({
                isPhone: false,
              })
            }
            // 判断是否第一次进入
            if (wx.getStorageSync('first') == '') {
              that.setData({
                firstIn: true,
              });
            }
          },
          fail: function (err) {
            wx.showToast({
              title: err,
              icon: 'none'
            });
            console.log(err);
          }
        })
      },
      fail() {
        // session_key 已经失效，需要重新执行登录流程
        wx.showToast({
          title: '登录失效，重新登录',
          icon: 'none'
        });
        that.userLogin(); //重新登录
      }
    })
    
      
  },
  open(e){
    console.log(e)
    var that = this;
    var token = wx.getStorageSync('token');
    if (!token) return;
    var that = this;
    var data={};
    data.book_id=e;
    http.postReq('/api/Book/openBook', data, function (res) {
      // that.setData({
      //   list: res.data.rows,
      //   // 获取显示隐藏
      //   p_show: res.data.flag
      // });
      wx.showToast({
        title: res.msg,
        icon: 'none',
        success:function(){
          setTimeout(()=>{
            that.getlist();
          },1500)
        }
      });
      
    })
  },
  //首次进入提示
  firstCome: function(){
    wx.setStorageSync("first", true);
    this.setData({
      firstIn: false
    })
  },
  //按钮点击统计
  clickBtn: function(name){
    app.mtj.trackEvent('btns', {
      btn: name,
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    
    //获取要求人id
    if (options.pid || options.scene) {
      wx.setStorageSync('pid', options.pid || options.scene)
      that.setData({
        pid: options.pid || options.scene
      });
      that.userLogin();
    }else{
      wx.removeStorageSync('pid');
    }
    if (options.id) {
      that.setData({
        tid: options.id
      })
    }
    
    //判断首次进入提示滑动
    // console.log(wx.getStorageSync("token"))
    // if (wx.getStorageSync("first") == null || wx.getStorageSync("first") == ""){
    //   this.setData({
    //     firstIn: true
    //   })
    // }else{
    //   this.setData({
    //     firstIn: false
    //   })
    // }


    // 判断IOS
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          systemInfo: res,
        })
        console.log(res)
        // 判断ios
        // if (res.platform == "ios") {
        //   that.setData({
        //     isIos: true
        //   })
        //   console.log(that.data.isIos)
        // }
        that.setData({
          isIos: true
        })
        console.log(that.data.isIos)
      }
    })


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
  onShow: function (options) {
    var that = this;
    
    this.loadUser();
    this.getlist();
    http.postReq('/api/User/info', {}, function (res) {
      setTimeout(function () {
        that.getlist();
      }, 0);
    })
    var that = this;
    
    //iphone 底部横线适配
    var iphones = ['iPhone X', 'iPhone XR', 'iPhone XS', 'iPhone XS Max', 'iPhone11,8', 'iPhone11,2', 'iPhone11,4', 'iPhone11,6', 'unknown<iPhone11,2>', 'unknown<iPhone11,8>', 'unknown<iPhone11,4>', 'unknown<iPhone11,6>']
    wx.getSystemInfo({
      success: function (res) {
        //console.log(res.model)
        //console.log(res.language)//zh_CN(en)
        //console.log(res.model=="iPhone X")
        // console.log(iphones.indexOf(res.model) > -1)
        if (iphones.indexOf(res.model) > -1) {
          that.setData({
            isIphone: true
          })
        }
      }
    })
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
  onShareAppMessage: function(res) {
    var that = this;
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
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