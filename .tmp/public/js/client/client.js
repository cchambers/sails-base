String.prototype.trunc = function(n,useWordBoundary){
  var toLong = this.length>n,
  s_ = toLong ? this.substr(0,n-1) : this;
  s_ = useWordBoundary && toLong ? s_.substr(0,s_.lastIndexOf(' ')) : s_;
  return toLong ? s_ : s_;
};

(function($){
  $.fn.isActive = function () {
    return $(this).hasClass("active");
  };

  $.fn.activate = function (doSiblings, toggle) {
    if (doSiblings) $(this).siblings().deactivate();
    if (toggle) return $(this).toggleClass("active");
    return $(this).addClass("active");
  };

  $.fn.deactivate = function () {
    return $(this).removeClass("active");
  };
})(jQuery);


var client = {
  init: function () {
    client.setup();
  },

  setup: function () {
    client.keys = {
      nextItem: [115,108,32],
      prevItem: [119,107]
    }

    /* make some way to only bind on the pages that need it */
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

    $(".new-thing").on("keyup", "[name=markdown]", client.updatePreview);

    $(".new-thing").on("keyup", "[name=title]", client.generateSlug);

    $(".entry").on("keyup", client.entryKeypressHandler);

    $(".entry").on("click", ".close", function (e) {
      e.stopPropagation();
      var $parent = $(this).parents("article");
      console.log($parent)
      $parent.removeClass("active");
    });

    $("body").on("click", "article:not(.active)", function (e) {
      var $target = $(e.target);
      if (!$(e.target).attr("href")) {
        $(this).activate(true);

      }
    });

    $(".entries").on("click", ".control div", function () {
      // decide to post up, down, or neutral.
      var dir = $(this).data().dir;
      var $el = $(this);

      if ($el.isActive()) {
        $el.deactivate();
      } else {
        $el.activate(true);
      }

    });

    $(".vote .control").on("click", "div", client.doVote);

    $(".panel").on("click", ".swap-panel-forms", function () {
      $(".panel form").toggleClass("active");
      $(".panel form.active input").first().focus();
    });
    $(".panel form.active input").first().focus();
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
    var $output = $(".sign-up output");
    $output.text(data);
    $(".login-form [name=email]").val( $(".sign-up [name=email]").val() );
    $(".login-form [name=password]").val( $(".sign-up [name=password]").val() );
    $(".login-form .submit").trigger("click");
  },

  createSub: function (data) {
    if (data.name) {
      location.href = "/sub/" + data.name
    }
  },

  newEntry: function (data) {
    if (data.slug) {
      location.href = "/sub/" + data.postedTo + "/" + data.slug
    }
  },

  generateSlug: function (data) {
    var title = $("input[name=title]").val().trunc(64);;
    var slug = title.toLowerCase().replace(/[^a-zA-Z0-9\s]/g,'').replace(/\s/g, "-");
    $("input[name=slug]").val(slug);
  },

  updatePreview: function (data) {
    var converter = new showdown.Converter();
    var text = $("textarea[name=markdown]").val();
    var html = converter.makeHtml(text);
    $("textarea[name=content]").val(html);
    $(".preview").html(html);
  },

  convertMarkdown: function (data) {
    var converter = new showdown.Converter();
    var text = data;
    var html = converter.makeHtml(text);
    return html;
  },

  entryKeypressHandler: function (e) {

  },

  doVote: function () {
    // decide what kind of vote it is and send it.
  }
}



client.init();