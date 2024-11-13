// frontend/miniprogram/pages/login/login.js
Page({
  data: {
    // 存储登录状态或用户信息的变量
  },

  // 处理获取手机号的事件
  getPhoneNumber(e) {
    if (e.detail.errMsg === "getPhoneNumber:ok") {
      const { encryptedData, iv } = e.detail;

      // 调用后端登录接口
      wx.request({
        url: "http://localhost:9990/api/login", // 后端接口地址
        method: "POST",
        data: {
          code: wx.getStorageSync("code"), // 获取之前存储的code
          encryptedData: encryptedData,
          iv: iv,
        },
        header: {
          "Content-Type": "application/json",
        },
        success: (res) => {
          if (res.data.success) {
            // 登录成功，保存Token
            wx.setStorageSync("token", res.data.token);
            wx.showToast({ title: "登录成功", icon: "success" });
            // 跳转到主页
            wx.navigateTo({ url: "/pages/home/home" });
          } else {
            wx.showToast({ title: res.data.message, icon: "none" });
          }
        },
        fail: () => {
          wx.showToast({ title: "请求失败，请重试", icon: "none" });
        },
      });
    } else {
      wx.showToast({ title: "授权失败", icon: "none" });
    }
  },

  onLoad() {
    // 调用 wx.login 获取 code
    wx.login({
      success: (res) => {
        if (res.code) {
          // 存储 code 以备后续使用
          wx.setStorageSync("code", res.code);
        } else {
          wx.showToast({ title: "登录失败，请重试", icon: "none" });
        }
      },
      fail: () => {
        wx.showToast({ title: "登录失败，请重试", icon: "none" });
      },
    });
  },
});
