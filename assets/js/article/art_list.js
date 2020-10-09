$(function () {
  var layer = layui.layer;
  var form = layui.form;
  var laypage = layui.laypage;
  // 定义美化时间的过滤器
  template.defaults.imports.dataFormat = function (date) {
    const dt = new Date(date);

    var y = dt.getFullYear();
    var m = padZero(dt.getMonth() + 1);
    var d = padZero(dt.getDate());

    var hh = padZero(dt.getHours());
    var mm = padZero(dt.getMinutes());
    var ss = padZero(dt.getSeconds());

    return y + "-" + m + "-" + d + " " + hh + ":" + mm + ":" + ss;
  };

  // 定义补零的函数
  function padZero(n) {
    return n > 9 ? n : "0" + n;
  }

  // 定义一个查询的参数对象，将来请求数据时需要将请求参数对象提交到服务器
  var q = {
    pagenum: 1, // 页码值，默认请求第一页的数据
    pagesize: 2, // 每页显示几条数据，默认每页显示2条
    cate_id: "", // 文章分类的 Id
    state: "", // 文章的发布状态
  };
  //   initTable();
  //   // 获取文章列表的方法
  //   function initTable() {
  //     $.ajax({
  //       type: "GET",
  //       url: "/my/article/list",
  //       data: q,
  //       success: function (res) {
  //         //   console.log(res);
  //         if (res.status !== 0) {
  //           return layer.msg("获取文章列表失败！");
  //         }
  //         //   layer.msg("获取文章列表成功！");
  //         var htmlStr = template("tpl-table", res);
  //         $("tbody").html(htmlStr);
  //         console.log($("tbody").html(htmlStr));
  //       },
  //     });
  //   }
  initTable();
  initCate();
  // 获取文章列表数据的方法
  function initTable() {
    $.ajax({
      method: "GET",
      url: "/my/article/list",
      data: q,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("获取文章列表失败！");
        }
        // 使用模板引擎渲染页面的数据
        var htmlStr = template("tpl-table", res);
        console.log(htmlStr);
        $("tbody").html(htmlStr);
        // 调用分页函数
        renderPage(res.total);
      },
    });
  }

  // 获取文章分类的方法
  function initCate() {
    $.ajax({
      type: "GET",
      url: "/my/article/cates",
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("获取文章分类列表失败！");
        }
        var htmlStr = template("tpl_cate", res);
        console.log(htmlStr);
        $("[name=caty_id]").html(htmlStr);
        // 通知 layUI 重新渲染 表单UI 结构
        form.render();
      },
    });
  }

  // 为筛选按钮 绑定submit 事件
  $("#form-search").on("submit", function (e) {
    e.preventDefault();
    // 获取表单的值
    var caty_id = $("[name=caty_id]").val();
    var state = $("[name=state]").val();
    // 为查询参数对象q 中对应的数据赋值
    q.caty_id = caty_id;
    q.state = state;
    // 重新渲染数据
    initTable();
  });

  // 定义分页列表渲染数据
  function renderPage(total) {
    // console.log(total);
    //执行一个laypage实例
    laypage.render({
      elem: "pageBox", //分页容器的 id
      count: total, //数据总数，从服务端得到
      limit: q.pagesize, // 每页显示几个数据
      curr: q.pagenum, //默认被选中的页数
      layout: ["count", "limit", "prev", "page", "next", "skip"],
      limits: [2, 3, 5],
      // 1.点击分页发生切换时 触发 jump 回调函数
      // 2.只要调用 laypage.render() 方法， 就会触发jump回调
      jump: function (obj, first) {
        // 可以通过 frist 的值， 来判断是通过哪种方式， 触发的jump 回调
        // 如果 frist 的值为true， 证明是 方法2触发的
        //obj包含了当前分页的所有参数，比如：
        console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
        q.pagenum = obj.curr;
        // 根据最新的条目数，赋值到q 这个查询参数对象的 pagesize 属性中
        q.pagesize = obj.limit;
        // initTable();
        // 根据最新的q获取对应的数据列表， 并渲染表格
        if (!first) {
          initTable();
        }
      },
    });
  }

  // 通过事件委托形式  绑定 删除按钮事件
  $("tbody").on("click", "#btn_delte", function () {
    // 获取删除按钮的个数
    var len = $("#btn_delte").length;
    // 获取文字的id
    var id = $(this).attr("data-id");

    layer.confirm("确定删除么?", { icon: 3, title: "提示" }, function (index) {
      $.ajax({
        type: "GET",
        url: "/my/article/delete/" + id,
        success: function (res) {
          if (res.status !== 0) {
            return layer.msg("删除失败！");
          }
          layer.msg("删除成功！");
          // 当数据删除完成后 进行 判断 如果没有值 页码值就减去1 再次调用函数 initTable();
          if(len ===1) {
            // 当len 等于1 的话 就说明页码删除后没有任何数据
            q.pagenum = q.pagenum === 1 ? 1 : q.pagenum-1;
          }
          initTable();
        },
      });

      layer.close(index);
    });
  });
});
