export default {
  pages: [
    'pages/index/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    color: "#666",
    selectedColor: "#1890ff",
    backgroundColor: "#fafafa",
    borderStyle: "black",
    list: [
      {
        pagePath: "pages/index/index",
        iconPath: "./assets/tabbar/home.svg",
        selectedIconPath: "./assets/tabbar/home-active.svg",
        text: "首页"
      },
      {
        pagePath: "pages/hotel/list",
        iconPath: "./assets/tabbar/hotel.svg",
        selectedIconPath: "./assets/tabbar/hotel-active.svg",
        text: "酒店"
      },
      {
        pagePath: "pages/order/list",
        iconPath: "./assets/tabbar/order.svg",
        selectedIconPath: "./assets/tabbar/order-active.svg",
        text: "订单"
      },
      {
        pagePath: "pages/user/index",
        iconPath: "./assets/tabbar/user.svg",
        selectedIconPath: "./assets/tabbar/user-active.svg",
        text: "我的"
      }
    ]
  },
  networkTimeout: {
    request: 10000,
    connectSocket: 10000,
    uploadFile: 10000,
    downloadFile: 10000
  },
  debug: false
}