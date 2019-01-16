//app.js
var do_md5 = require('utils/md5.js');
// var host = "http://192.168.1.80:8011/";
// var host = "http://wenxue.iok.la/";
// var host = "https://ssxcx.server190.ehecd.com/";
var host = "https://shuyu.qingshanyuwo.cn/";
var aryFile = []; //上传文件成功后返回的服务器地址，如果执行一个新的上传时，需先设置为null
App({
  host: host,
  aryFile: aryFile,
  onLaunch: function() {
    console.log(host);
    var that = this;
    wx.checkSession({
      success: function() {
        var user = wx.getStorageSync('user');
        if (user != null && user != '') {
          that.globalData.bIsLogin = true;
        }
      },
      fail: function() {
        that.globalData.bIsLogin = false;
      }
    });
    // 登录
    // wx.login({
    //   success: res => {
    //     wx.setStorage({
    //       key: 'code',
    //       data: res.code,
    //     });
    //     var data = {
    //       sCode: res.code
    //     };
    //     that.request('GetWeKey', data, function(res) {
    //       if (res.success) {
    //         wx.setStorage({
    //           key: 'openid',
    //           data: res.data,
    //         });
    //       }
    //     });
    //   }
    // });
    // wx.getSetting({//引导用户允许微信获得你的公共信息，重新唤起微信运动授权
    //   success: function (res) {
    //     wx.openSetting({
    //       data: {
    //         "scope.werun": true
    //       },
    //       success: function (res) {
    //         that.setData({
    //           getWerun: true
    //         })
    //         wx.redirectTo({
    //           url: '/pages/start/start?id=userConsole',//跳到中转页面再跳回当前页面
    //         })
    //       }
    //     })
    //   }});
  },
  //调用服务器接口功能方法
  request: function(commandName, param, callBack, maskwin) {
    maskwin = (maskwin === true ? true : false);
    if (maskwin) {
      wx.showLoading({
        title: '数据加载中',
        mask: true
      });
    }

    if (param == null) {
      param = {};
    }
    var user = wx.getStorageSync('user');
    if (user != null && user != '') {
      if (user.iState == 2) {
        wx.showToast({
          title: '您的账号已被冻结，请与客服联系',
          duration: 1000 * 60 * 60 * 24,
          icon: "none",
          mask: true
        });
      }
      param.uMemberId = user.ID;
    };
    commandName = "AppService." + commandName;
    var data = {
      sCommandName: commandName,
      sInput: JSON.stringify(param)
    };
    // wx.request({
    //   method: 'POST',
    //   url: host + 'api/DoCommand',
    //   data: data,
    //   header: {
    //     'content-type': 'application/json'
    //   },
    //   success: function(res) {
    //     if (maskwin) {
    //       wx.hideLoading();
    //     }
    //     var result = res.data;
    //     if (!result.success) {
    //       if (result.data == -200) {
    //         user.iState = 2;
    //         wx.setStorageSync('user', user)
    //         wx.showToast({
    //           title: result.message,
    //           duration: 3000,
    //           mask: true,
    //           icon: "none"
    //         });
    //       } else if (result.data == -100) {
    //         wx.removeStorageSync('user');
    //         wx.showToast({
    //           title: '用户不存在，请退出等待15分钟后再进入',
    //           duration: 3000,
    //           mask: true,
    //           icon: "none"
    //         });
    //         setTimeout(function() {
    //           wx.navigateBack({
    //             delta: -5
    //           });
    //         }, 3000);
    //       }

    //     }
    //     typeof callBack == "function" && callBack(res.data);
    //   },
    //   fail: function(error) {
    //     console.log(error);
    //   },
    //   complete: function() {
    //     // if (true) {
    //     //   wx.hideLoading()
    //     // }
    //   }
    // })
  },
  globalData: {
    userInfo: null,
    refreshFlag: false,
    bIsLogin: false,
    userState: 0 //用户状态 1-正常；2-冻结
  },
  //跳转页面
  navigateTo: function(url) {
    wx.navigateTo({
      url: '/pages/' + url + '/' + url
    })
  },
  //验证手机号码
  checkMobile: function(phone) {
    var test = /^1[3,4,5,6,7,8,9]{1}[0-9]{1}[0-9]{8}$/;
    return test.test(phone);
  },
  //格式化日期
  dateFtt: function(date) {
    return date.replace(/T/g, ' ').split('.')[0]
  },
  //提示框
  alert: function(msg, that) {
    that.setData({
      msg: msg,
      show: true
    });
    setTimeout(function() {
      that.setData({
        show: false
      });
    }, 2000)
  },
  /**多张图片上传
   * url：上传服务器地址
   * file：图片集合
   * formData：请求的其他参数
   */
  uploadimg: function(url, file, formData) {
    var that = this;
    var i = file.i ? file.i : 0; //当前上传的哪张图片
    var success = file.success ? file.success : 0; //上传成功的个数
    var fail = file.fail ? file.fail : 0; //上传失败的个数
    wx.uploadFile({
      url: url,
      filePath: file[i],
      name: 'images', //这里根据自己的实际情况改
      formData: formData, //这里是上传图片时一起上传的数据
      success: (res) => {
        res = JSON.parse(res.data);
        if (res.success) {
          aryFile.push(res.data);
          success++; //图片上传成功，图片上传成功的变量+1
          //这里可能有BUG，失败也会执行这里,所以这里应该是后台返回过来的状态码为成功时，这里的success才+1
        }
      },
      fail: (res) => {
        fail++; //图片上传失败，图片上传失败的变量+1
        console.log('fail:' + i + "fail:" + fail);
      },
      complete: () => {
        console.log(i);
        i++; //这个图片执行完上传后，开始上传下一张
        if (i == file.length) { //当图片传完时，停止调用          
          console.log('执行完毕');
          console.log('成功：' + success + " 失败：" + fail);
        } else { //若图片还没有传完，则继续调用函数
          console.log(i);
          file.i = i;
          file.success = success;
          file.fail = fail;
          that.uploadimg(url, file, formData);
        }
      }
    })
  },
  //支付
  
  onError: function(msg) {
    console.log("onError:" + msg);
  }
});