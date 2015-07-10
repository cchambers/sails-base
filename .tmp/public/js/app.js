var app = {
  init: function () {
    app.setup();
  },

  setup: function () {
    $("a.log-in").on("click", app.submitLogin)
  },

  submitLogin: function () {
    var url = "/login";
    var data = $(".login-form").serialize();
    console.log(data);
    $.ajax({
      type: "POST",
      url: url,
      data: data,
      success: function (data) {
      if (data.user) {
          window.location.reload(); // success
        } else {
          app.loginFailure(data.message);
        }
      }
    });
  },

  loginFailure: function (message) {
    var $output = $(".login-form output");
    $output.text(message);
  }
}

app.init();