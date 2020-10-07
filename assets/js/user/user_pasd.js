$(function () {
  var form = layui.form;
  form.verify({
    pwd: [/^[\S]{6,12}$/, "密码必须6到12位，且不能出现空格"],
    samePwd: function (value) {
      if (value === $("[name=oldPwd]").val()) {
        return "新密码不能和原密码一致";
      }
    },
    rePwd: function (value) {
      if (value !== $("[name=newPwd").val()) {
        return "和新密码不一致";
      }
    },
  });

  //   请求数据
  $(".layui-form").on("submit", function (e) {
    e.preventDefault();
    $.ajax({
      method: "POST",
      url: "/my/updatepwd",
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layui.layer.msg("更新密码失败！");
        }
        layui.layer.msg("更新密码成功！");
        $(".layui-form")[0].reset();
      },
    });
  });
});
