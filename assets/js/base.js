// 每次调用$.get() 或者 $.post() 或 $.ajax() 的时候就会调用ajaxPrefilter
// 在这个函数中， 可以拿到我们给的Ajax提供的配置对象
$.ajaxPrefilter(function (options) {
  // 在发送 真正的Ajax 请求之前， 统一拼接请求的根路径
  options.url = "http://ajax.frontend.itheima.net" + options.url;
  // console.log(options.url);
  // 统一为有权限的接口，设置 headers 请求接头
  if (options.url.indexOf("/my") !== -1) {
    options.headers = {
      Authorization: localStorage.getItem("token") || "",
    };
  }

  //   全局统一 挂载 complete 函数
  options.complete = function (res) {
    //   console.log('执行了');
    // console.log(res);
    // 在 complete 回调函数中， 可以使用 res.responseJSON 拿到服务器响应回来的数据
    // console.log(res.responseJSON.status);
    if (
      res.responseJSON.status === 1 &&
      res.responseJSON.message === "身份认证失败！"
    ) {
      // 强制清空 token
      localStorage.removeItem("token");
      // 强制跳转到登录页面
      location.herf = "/login.html";
    }
  };
});
