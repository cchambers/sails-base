var client = {
  init: function () {
    client.setup();
  },

  setup: function () {
    $("form").on("click", ".submit", function () {
      var $form = $(this).parents("form");
      client.submitForm($form);
    });

    $("form").on("keyup", "input", function (e){
      if (e.which == 13) {
        var $form = $(this).parents("form");
        client.submitForm($form);
      }
    })

    $(".entry").on("keyup", client.entryKeypressHandler)
  },

  submitForm: function ($form) {
    var callback = $form.data().callback;
    var url = $form.attr("action");
    var data = $form.serialize();
    $.ajax({
      type: "POST",
      url: url,
      data: data,
      success: function (data) {
        if (client[callback]){
          client[callback](data);
        }
      }
    });
  },

  checkLogin: function (data) {
    console.log("Checking login..")
    if (data.user) {
      window.location.reload(); // success
    } else {
      var $output = $(".login-form output");
      $output.text(data.message);
    }
  },

  signUp: function (data) { 
    console.log(data);
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