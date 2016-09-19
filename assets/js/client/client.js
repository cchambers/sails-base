/*\
  SAILS BASE CLIENT FILE
  Functions: 
  - init: Kicks off the app.
  - callbacks: An object of callback functions that are run when a after a form submission response 
    using that forms data-callback attribute. 
  - setup: A place for binds.
  - setupSockets: Configures socket emissions and reactions for the app.
  - submitForm: Handles the submission of every form on the website! Takes an optional
    data-callback attribute for running on success.
  Utilities:
  - slug: Takes a single string and returns the slug version. Eventually this needs to check
    the database to see if the slug exists and then increment based on the response.
  - generateSlug: Generates a slug as the user is typing in on the "New Sub" page.
  - convertMarkdown: Takes one param of markdown and returns HTML.
  - keypressHandler: Function for handling keypress events.
/*\
\*/


var app = {
  timers: {},

  init: function () {
    app.site.setup();
  },

  callbacks: {
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
      var $output = $(".signup-form output");
      $output.text(data);
      $(".login-form [name=email]").val($(".signup-form [name=email]").val());
      $(".login-form [name=password]").val($(".signup-form [name=password]").val());
      $(".login-form .submit").trigger("click");
    },

    output: function (data, $form) {
      if ($form) {
        if (data.message) {
          $form.find("output").text(data.message)
        }
      }

      if (data.redirect) {
        location.href = data.redirect;
      }

      if (data.reload) {
        location.reload();
      }

      if (data.target) {
        location.hash = data.target;
      }

      if (data.callback && app.callbacks[data.callback]) {
        app.callbacks[data.callback]();
      }
    }
  },

  site: { // sitewide functionality
    setup: function () {
      var channel = app.utility.slug(location.pathname);
      io.socket.get("/sockets/join/" + channel);
      // app.site.setupSockets();

      app.keys = {
        nextItem: [83],
        prevItem: [87]
      }

      $("body").on("click", "form .submit", function (e) {
        e.preventDefault();
        var $form = $(this).parents("form").first();
        app.site.submitForm($form);
      });


      $("form").on("keyup", "input", function (e) {
        if (e.which == 13) {
          var $form = $(this).parents("form").first();
          app.site.submitForm($form);
        }

        if ($(this).hasClass("generate-slug")) {
          var val = $(this).val();
          app.generateSlug(val);
        }
      });
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
          if (app.callbacks[callback]) {
            app.callbacks[callback](data, $form);
          }
        }
      });
    }
  },

  utility: {
    slug: function (text) {
      return text.toLowerCase().replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s/g, "-");
    },

    convertMarkdown: function (data) {
      var converter = new showdown.Converter();
      var text = data;
      var html = converter.makeHtml(text);
      return html;
    }
  }
}



app.init();

