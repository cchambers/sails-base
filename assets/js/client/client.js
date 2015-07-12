String.prototype.trunc =
     function(n,useWordBoundary){
         var toLong = this.length>n,
             s_ = toLong ? this.substr(0,n-1) : this;
         s_ = useWordBoundary && toLong ? s_.substr(0,s_.lastIndexOf(' ')) : s_;
         return  toLong ? s_ : s_;
      };

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
    });

    $(".new-thing").on("keyup", "[name=title]", client.generateSlug);

    $(".entry").on("keyup", client.entryKeypressHandler)
  },

  submitForm: function ($form) {
    console.log("Submitting a form!")
    var callback = $form.data().callback;
    var url = $form.attr("action");
    var data = $form.serialize();
    console.log(callback, url, data)
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
    var $output = $(".sign-up output");
    $output.text(data);
    console.log(data);
  },

  createSub: function (data) {
    if (data.name) {
      location.href = "/sub/" + data.name
    }
  },

  newEntry: function (data) {
    console.log(data);
  },

  generateSlug: function (data) {
    var title = $("input[name=title]").val().trunc(64);;
    var slug = title.toLowerCase().replace(/[^a-zA-Z0-9\s]/g,'').replace(/\s/g, "-");
    $("input[name=slug]").val(slug);
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