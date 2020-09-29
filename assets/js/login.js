$(function () {
  // 登录框 点击事件
  $("#link-reg").on("click", function () {
    // 点击登录按钮显示登录框 隐藏注册 框
    $(".login-box").hide();
    $(".reg-box").show();
  });
  // 注册框 点击事件
  $("#link-login").on("click", function () {
    $(".login-box").show();
    $(".reg-box").hide();
  });

  // 在layUI 内 获取 form 对象 只要引入 layUI.js文件 就可以获得 属性
  var form = layui.form;
  // 弹出提示信息 声明变量 
  var layer = layui.layer;
  // 通过form.verify（） 调用 自定义 form 属性
  //   form.verify({
  //     //数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]
  //     pwd: [/^[\S]{6,12}$/, "密码必须6到12位，且不能出现空格"],
  //   });

  form.verify({
    pwd: [/^[\S]{6,12}$/, "密码必须6到12位，且不能出现空格"],
    // 矫验两次密码是否一致
    repwd: function (value) {
      // 通过形参拿到确认密码框中的内容
      // 还需要拿到密码框中的内容
      // 然后进行一次等于的判断
      // 如果判断失败， 则return一个提示消息即可

      // 使用属性选择器
      var pwd = $(".reg-box [name=password]").val();
      if (pwd !== value) {
        return "两次密码不一致";
      }
    },
  });

  //  注册框 调用接口
  
  // 添加 submit 提交 事件
  $("#form_reg").on("submit", function (e) {
    e.preventDefault();
    // 优化代码  把传入的数据 单独定义 data
    var data = {
      username: $("#form_reg [name=username]").val(),
      password: $("#form_reg [name=password]").val(),
    };
    // 使用ajax post 请求方式
    $.post("/api/reguser", data, function (
      res
    ) {
      if (res.status !== 0) {
        // 把每次注册的 提示 信息 打印在 桌面 显示
        // return console.log(res.message);
        return layer.msg(res.message);
      }
      // console.log("注册成功");
      layer.msg("注册成功,请输入密码");
      //  模拟一个点击跳转事件
      $("#link-login").click();
    });
  });

  // 添加 登录 注册 按钮
  $("#form_login").submit(function(e) {
    e.preventDefault();
    //  Ajax 提交 数据
    $.ajax({
      url: "/api/login",
      method: "POST",
      // 快速获取 表单内容
      data: $(this).serialize(),
      success : function(res) {
        // console.log(res);
        if (res.status !== 0) {
          return layer.msg('登录失败');
        }
        layer.msg("登录成功");
        // 把返回的 token 值 本地存储 到 localStorage
        localStorage.setItem("token", res.token);
        // 跳转页面
      location.href = "index.html";
      }
    });
  });
});
