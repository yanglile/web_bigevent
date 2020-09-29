// 每次调用$.get() 或者 $.post() 或 $.ajax() 的时候就会调用ajaxPrefilter
// 在这个函数中， 可以拿到我们给的Ajax提供的配置对象
$.ajaxPrefilter(function(options) {
    // 在发送 真正的Ajax 请求之前， 统一拼接请求的根路径
    options.url = "http://ajax.frontend.itheima.net" + options.url;
    console.log(options.url);
})