$(function () {
  // initArtCateList()
  // // 获取文章分类的列表
  // function initArtCateList() {
  //     $.ajax({
  //         type: "GET",
  //         url: "/my/article/cates",
  //         success: function (res) {
  //             console.log(res);
  //             // template('tpl-table',res)
  //             template('tpl-table', res)
  //         }
  //     });
  // }
  var layer = layui.layer;
  var form = layui.form;
  initArtCateList();

  // 获取文章分类的列表
  function initArtCateList() {
    $.ajax({
      method: "GET",
      url: "/my/article/cates",
      success: function (res) {
        // var htmlStr = template('tpl-table', res)
        // $('tbody').html(htmlStr)
        var htmlStr = template("tpl-table", res);
        // console.log(res);
        $("table").html(htmlStr);
      },
    });
  }

  // 给添加类型 添加 点击事件
  var indexAdd = null;
  $("#btnAddCate").on("click", function () {
    indexAdd = layer.open({
      title: "添加文章分类",
      type: 1,
      area: ["500px", "250px"],
      content: $("#dalog-add").html(),
    });
  });

  // 使用 事件委托 submit 获取的数据请求
  $("body").on("submit", "#form-add", function (e) {
    e.preventDefault();
    // console.log("ok");

    $.ajax({
      type: "POST",
      url: "/my/article/addcates",
      data: $(this).serialize(),
      success: function (res) {
        console.log(res);

        if (res.status !== 0) {
          return layer.msg("新增分类失败！");
        }
        initArtCateList();
        layer.msg("新增分类成功！");
        // 根据索引 关闭对应的图层
        layer.close(indexAdd);
      },
    });
  });

  // 编辑 模块 使用事件委托  绑定点击事件
  var indexEdit = null;
  $("body").on("click", ".btn-edit", function () {
    console.log("ok");
    indexEdit = layer.open({
      title: "修改文章分类",
      type: 1,
      area: ["500px", "250px"],
      content: $("#dalog-edit").html(),
    });

    var id = $(this).attr("data-id");
    // 发起请求获取对应的分类数据
    $.ajax({
      type: "GET",
      url: "/my/article/cates/" + id,
      success: function (res) {
        console.log(res);
        form.val("form-edit", res.data);
      },
    });
  });

  // 给表单 添加 submit 事件  使用事件委托
  $("body").on("submit", "#form-edit", function (e) {
    e.preventDefault();
    // console.log('ok');
    $.ajax({
      type: "POST",
      url: "/my/article/updatecate",
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("更新分类信息失败！");
        }
        layer.msg("更新分类信息成功！");
        // 根据索引 关闭对应的图层
        layer.close(indexEdit);
        initArtCateList();
      },
    });
  });

  // 使用 事件委托  监听 删除点击按钮
  $("body").on("click", ".btn-delete", function () {
    // 获取表单 删除按钮
    console.log("ok");
    var id = $(this).attr("data-id");
    layer.confirm("确定删除么？", { icon: 3, title: "提示" }, function (index) {
      $.ajax({
        type: "GET",
        url: "/my/article/deletecate/" + id,
        success: function (res) {
          if (res.status !== 0) {
            return layer.msg("删除文章分类失败！");
          }
          layer.msg("删除文章分类成功！");
          layer.close(index);
          initArtCateList();
        },
      });
    });
  });
});
