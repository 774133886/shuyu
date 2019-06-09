// pages/poster/poster.js
const util = require('../../utils/util.js')
const http = require('../../http.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    path: "",
    avatar: "",
    quan: "../../images/quan.png",
    maskHidden: false,
    name: "风云天clear",
    slogan:'7天get有趣的建筑园林知识, 从不同维度了解传统文化！',
    token: wx.getStorageSync('token'),
  },
  //获取输入框的值
  bindKeyInput: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  //点击提交按钮
  btnclick: function () {
    var text = this.data.inputValue
    wx.showToast({
      title: text,
      icon: 'none',
      duration: 2000
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    http.postReq('/api/Book/shareBook', { bid: options.id }, function (res) {
      if (res.code == 101) {
        that.setData({
          name: res.data.nickname,
          path: res.data.bpath,
          avatar: res.data.avatar,
        })

        // http.postReq('/api/User/getQrcode', function (res) {
        //   console.log(res.data)
        //   if (res.code == 101) {
        //     that.setData({
        //       name: res.data.nickname,
        //     })
        //     that.createNewImg();
        //   } else {
        //     wx.showToast({
        //       title: res.msg,
        //       icon: 'none'
        //     })
        //   }
        // })
        that.createNewImg();
      }else{
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })

  },
  
  //将canvas转换为图片保存到本地，然后将图片路径传给image图片的src
  createNewImg: function () {
    var that = this;
    var context = wx.createCanvasContext('mycanvas');
    context.setFillStyle("rgba(0,0,0,0)")
    context.fillRect(0, 0, 375, 585)
    var path = that.data.path;
    //将模板图片绘制到canvas,在开发工具中drawImage()函数有问题，不显示图片
    //不知道是什么原因，手机环境能正常显示
    context.drawImage(path, 0, 0, 375, 585);
    var path1 = that.data.touxiang;
    // console.log(path1, "path1")
    //将模板图片绘制到canvas,在开发工具中drawImage()函数有问题，不显示图片
    var path2 = that.data.avatar;
    var path3 = "../../files/postor_center_bg.png";
    var path4 = app.host + '/api/User/getQrcode?token=' + that.data.token;
    console.log(path4)
    //不知道是什么原因，手机环境能正常显示
    // context.save(); // 保存当前context的状态

    var name = that.data.name;
    //绘制名字
    context.setFontSize(18);
    context.setFillStyle('#ffffff');
    context.setTextAlign('center');
    context.fillText(name, 160, 55);
    context.stroke();
    //绘制标语
    // context.setFontSize(20);
    // context.setFillStyle('#ff6666');
    // context.setTextAlign('center');
    // context.fillText(that.data.slogan.split(',')[0]+',', 185, 190);
    // context.fillText(that.data.slogan.split(',')[1], 185, 215);
    // context.stroke();
    //绘制验证码背景
    // context.drawImage(path3, 38, 220, 300, 145);
    //绘制扫码二维码 
    context.drawImage(path4, 158, 488, 50, 50);
    // 绘制头像
    context.arc(62, 62, 30, 0, 2 * Math.PI) //画出圆
    context.strokeStyle = "rgba(0,0,0,0)";
    context.clip(); //裁剪上面的圆形
    context.drawImage(path2, 31, 31, 62, 62); // 在刚刚裁剪的园上画图
    context.stroke();
    
  

    context.draw();
    //将生成好的图片保存到本地，需要延迟一会，绘制期间耗时
    setTimeout(function () {
      wx.canvasToTempFilePath({
        canvasId: 'mycanvas',
        success: function (res) {
          var tempFilePath = res.tempFilePath;
          console.log(res)
          that.setData({
            imagePath: tempFilePath,
          });
        },
        fail: function (res) {
          console.log(res);
        }
      });
    }, 1000);
  },
  //点击保存到相册
  baocun: function () {
    var that = this;
    console.log("baocun", that.data.imagePath)
    wx.saveImageToPhotosAlbum({
      filePath: that.data.imagePath,
      success(res) {
        wx.showModal({
          content: '图片已保存到相册，快去分享到朋友圈吧~',
          showCancel: false,
          confirmText: '好的',
          confirmColor: '#333',
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定');
            }
          }, 
          fail: function (res) {
            console.log(11111)
          }
        })
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },
  //点击生成
  formSubmit: function (e) {
    var that = this;
    this.setData({
      maskHidden: false
    });
    wx.showToast({
      title: '装逼中...',
      icon: 'loading',
      duration: 1000
    });
    setTimeout(function () {
      wx.hideToast()
      
      that.setData({
        maskHidden: true
      });
    }, 1000)
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
    var that = this;
    // wx.getUserInfo({
    //   success: res => {
    //     console.log(res.userInfo, "huoqudao le ")
    //     this.setData({
    //       name: res.userInfo.nickName,
    //     })
    //     wx.downloadFile({
    //       url: res.userInfo.avatarUrl, //仅为示例，并非真实的资源
    //       success: function (res) {
    //         // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
    //         if (res.statusCode === 200) {
    //           console.log(res, "reererererer")
    //           that.setData({
    //             touxiang: res.tempFilePath
    //           })
    //         }
    //       }
    //     })
    //   }
    // })

   
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
    return {
      title: "这个是我分享出来的东西",
      success: function (res) {
        console.log(res, "转发成功")
      },
      fail: function (res) {
        console.log(res, "转发失败")
      }
    }
  }
})