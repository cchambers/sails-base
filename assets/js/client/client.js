var client = {
  init: function () {
    client.setup();
  },

  setup: function () {
    $("a.log-in").on("click", client.submitLogin);

    $(".login-form input").on("keyup", function (e){
      if (e.which == 13) client.submitLogin();
    })

    $(".entry").on("keyup", client.entryKeypressHandler)
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
  },

  convertMarkdown: function (data) {
    var converter = new showdown.Converter();
    var text = data;
    var html = converter.makeHtml(text);
    return html;
  },

  entryKeypressHandler: function (e) {
    
  }
}

client.init();