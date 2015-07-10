var client = {
  init: function () {
    client.setup();
  },

  setup: function () {
    $("a.log-in").on("click", client.submitLogin);

    $(".login-form input").on("keyup", function (e){
      if (e.which == 13) client.submitLogin();
    })
  },

  submitLogin: function () {
    var url = "/login";
    var data = $(".login-form").serialize();
    $.ajax({
      type: "POST",
      url: url,
      data: data,
      success: function (data) {
      if (data.user) {
          window.location.reload(); // success
        } else {
          client.loginFailure(data.message);
        }
      }
    });
  },

  loginFailure: function (message) {
    var $output = $(".login-form output");
    $output.text(message);
  }
}

client.init();