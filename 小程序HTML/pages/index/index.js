// pages/index/index.js
const util = require('../../utils/util.js')
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: null, //bananer
    scroll_height: '',
    ACIndex: 1, //数量方式：1-昨天；2-前天
    iEnterCount: 0, //报名人数
    user: null,
    datas: null,
    bFun: false,
    sessionKey: '', //新用户sessionKey
    bNull: true, //当user未空时，需要根据code到微信服务器换取key和openid，这个值用于判断code是否为空，如果为空定时器将一直执行
    bLogin: false, //登录状态
    sOpenId: '', //用户的openid
    navList: null, //三个菜单
    yesterdayData: null, //获取用户昨天的排名数据
    yesterdayDataList: null, //昨天的排行
    dBonus:0.00,//总奖金
    pages: 1, //当前页码
    totalPage: 1, //总页数
    size: 20, //每页的数据量
    bNotMore: false,
    runData: [],
  },
  //加载用户信息
  loadUser: function() {
    var that = this;
    var user = wx.getStorageSync('user');
    if (user == null || user == "") {
      var getWxUser = setInterval(function() {
        if (that.data.bNull) {
          var code = wx.getStorageSync('code');
          if (code != null && code != "") {
            that.setData({
              bNull: false
            });
            var data = {
              sCode: code
            };
            app.request('JudgeUser', data, function(result) {
              if (result.data != null && result.data.sessionKey != undefined) {
                that.setData({
                  sessionKey: result.data.sessionKey
                });
                wx.setStorage({
                  key: 'sessionKey',
                  data: result.data.sessionKey,
                });
                if (result.success) {
                  app.globalData.bIsLogin = true;
                  var res = result.data.user;
                  app.globalData.userState = res.iState;
                  wx.setStorageSync("user", res);
                  that.setData({
                    user: res,
                    bLogin: true,
                    sOpenId: result.data.openid,
                    yesterdayData: result.data.yesterdayData
                  });
                } else {
                  that.setData({
                    sOpenId: result.data.openid,
                  });
                }
                that.getWeRun();
              }
            });
          }
        } else {
          clearInterval(getWxUser)
        }
      }, 500);
    } else {
      that.setData({
        user: user
      });
    }
  },
  //初始数据加载
  loadData: function() {
    var that = this;
    app.request('GetDefault', null, function(res) {
      res = res.data;
      that.setData({
        imgUrls: res.bananer,
        iEnterCount: res.iEnterCount,
        navList: res.nav,
        yesterdayData: res.yesterdayData,
        dBonus: res.dBonus
      });
      var user = wx.getStorageSync('user');
      app.globalData.userState = res.userState;
      if (user != null && user!="" && res.userState!=user.iState)
      {
        user.iState = res.userState;
        wx.setStorageSync("user", user);
        that.onShow();
      }
    });
    that.bindPageData();
    that.getWeRun();
  },
  //用户点击登录按钮
  userInfoHandler: function(e) {
    var that = this;
    wx.getSetting({
      success: function(res) {
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
                    if (!res.authSetting["scope.userInfo"] || !res.authSetting["scope.userLocation"]) {
                      //这里是授权成功之后 填写你重新获取数据的js
                      //参考:
                      that.getLogiCallback('', function() {
                        callback('')
                      })
                    }
                  }
                })
              }
            }
          })
        } else {
          var data = {
            encryptedData: e.detail.encryptedData,
            iv: e.detail.iv,
            sCode: wx.getStorageSync('code'),
            sOpenId: wx.getStorageSync('openid'),
          };
          app.request('GetWXUserInfo', data, function(res) {
            if (res.success) {
              app.globalData.bIsLogin = true;
              res = res.data;
              app.globalData.userState = res.user.iState;
              wx.setStorageSync("user", res.user);
              that.setData({
                bLogin: true,
                user: res.user,
                yesterdayData: res.yesterdayData
              });
              that.getWeRun();
            } else {
              app.alert('获取用户信息时出现错误，请稍后再试', that);
            }
          });
        }
      },
      fail:function(res){
        console.log('授权失败');
      }
    });

  },
  bindPageData: function() {
    var that = this;
    var pages = this.data.pages;
    var total = this.data.totalPage;
    var size = this.data.size;
    if (pages <= total) {
      app.request('GetYesterDayTops', {
        iPageIndex: pages,
        iPageSize: size,
        iType: that.data.ACIndex
      }, function(res) {
        var result = JSON.parse(res.data);
        if (parseInt(result.total) % size === 0) {
          total = parseInt(result.total) / size;
        } else {
          total = parseInt(parseInt(result.total) / size) + 1;
        }
        if (result.total > 0) {
          var list = [];
          if (pages == 1) {
            list = result.rows;
          } else {
            list = that.data.yesterdayDataList
            list = list.concat(result.rows)
          }
          that.setData({
            yesterdayDataList: list,
            pages: pages,
            totalPage: total
          });
        } else {
          that.setData({
            yesterdayDataList: null,
          })
        }
      }, true);
    } else {
      that.setData({
        bNotMore: true
      })
    }
  },
  //报名
  clickEnter: function(e) {
    wx.navigateTo({
      url: '/pages/apply/apply'
    })
  },
  //滑动吸顶
  scroll: function(e) {
    var that = this;
    that.setData({
      scroll_height: e.detail.scrollTop
    });
  },
  //选项卡
  selectTab: function(e) {
    var that = this;
    that.setData({
      ACIndex: e.currentTarget.dataset.tab,
    });
    that.bindPageData();
  },
  //点击进入bananer详情
  clickDetail: function(e) {
    if (e.currentTarget.dataset.linkid != '') {
      var id = e.currentTarget.dataset.id;
      wx.navigateTo({
        url: '/pages/articleDetail/articleDetail?id=' + id + '&iSource=1'
      });
    }
  },
  //点击进入主导航详情
  clickNavDetail: function(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/NavDetail/NavDetail?id=' + id
    })
  },
  //点击进入报名详情
  clickSignUpDtl: function(e) {
    wx.navigateTo({
      url: '/pages/signUpDtl/signUpDtl'
    })
  },
  //获取微信运动
  getWeRun: function() {
    var that = this;
    setTimeout(function() {

      console.log(app.globalData.bIsLogin)
      if (app.globalData.bIsLogin) {
        wx.login({
          success: function(resLogin) {
            if (resLogin.code) {
              wx.getWeRunData({
                success(resRun) {
                  const encryptedData = resRun;
                  var data = {
                    encryptedData: resRun.encryptedData,
                    iv: resRun.iv,
                    sOpenId: wx.getStorageSync('openid')
                  };
                  app.request('Decrypt', data, function(res) {
                    if (res.success) {
                      var runData = JSON.parse(res.data);
                      if (runData.stepInfoList) {
                        runData.stepInfoList = runData.stepInfoList.reverse();

                        for (var i in runData.stepInfoList) {
                          runData.stepInfoList[i].date = util.formatTime(new Date(runData.stepInfoList[i].timestamp * 1000));
                        }
                        data = {
                          runData: runData.stepInfoList
                        };
                        app.request('GetMemberEveryDayStep', data, function(res) {
                          console.log(res.success)
                        });
                      }
                    }
                  });
                }
              })
            } else {
              console.log('获取用户登录态失败！' + res.errMsg)
            }
          }
        });
      }
    }, 2000)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
   
  },
  goInfo: function() {
    wx.reLaunch({
      url: '../person/person'
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;
    that.loadUser();
    that.loadData();
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