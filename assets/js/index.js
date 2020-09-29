$(function() {
// 调用 用户基本信息函数
 getUserInfo();
var layer = layui.layer;
//  退出 按钮绑定 事件
$("#btn_ogout").on('click',function() {
  //提示用户是否确认退出
  layer.confirm("确定退出登录", { icon: 3, title: "提示" }, function (index) {
    // 清空本地存储 中的token
    localStorage.removeItem("token");
    // 重新跳转到登陆页面
    location.href = "login.html";
    // 关闭 confimr 询问
    layer.close(index);
  });

   
 
});
})

// 获取 用户的基本信息
function getUserInfo() {
    $.ajax({
      method: "GET",
      url: "/my/userinfo",
      //   headers 就是请求配置对象
      //   headers: {
      //     Authorization : localStorage.getItem('token')||''
      //   },
      success: function (res) {
        //   console.log(res);
        if (res.status !== 0) {
          return layui.layer.msg("身份验证失败");
        }
        // 调用 头像 渲染 函数
        renderAuater(res.data);
      },
      // 不论成功还是失败， 最终都会调用 complete 回调函数
    //   complete: function (res) {
    //     //   console.log('执行了');
    //     console.log(res);
    //     // 在 complete 回调函数中， 可以使用 res.responseJSON 拿到服务器响应回来的数据
    //     if (
    //       res.responseJSON.status === 1 &&
    //       res.responseJSON.message === "身份认证失败！"
    //     ) {
    //       // 强制清空 token
    //       localStorage.removeItem("token");
    //       // 强制跳转到登录页面
    //       location.herf = "/login.html";
    //     }
    //   },
    });
}

// 封装头像渲染 函数
function renderAuater(user) {
    // 1.获取用户名
var name = user.nickname || user.username;
//2. 设置 欢迎de文本 
$("#welcome").html("欢迎&nbsp&nbspA1");
// 3.按需求渲染用户的头像
if (user.user_pic !== null) {
    // 3.1渲染图片头像
    $(".layui-nav-img").attr("src", user.user_pic).show();
    $(".text-avater").hide();
} else {
    // 3.2渲染 文本头像
    $(".layui-nav-img").hide();
    var first = name[0].toUpperCase();
    $(".text-avater").html(first).show();
}
}