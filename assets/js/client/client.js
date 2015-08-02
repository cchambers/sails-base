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
    var channel = client.slug(location.pathname);
    io.socket.get('/sockets/join/' + channel);
    client.setupSockets();

    client.keys = {
      nextItem: [115,108,32],
      prevItem: [119,107]
    }

    /* make some way to only bind on the pages that need it */
    $("body").on("click", "form .submit", function () {
      var $form = $(this).parents("form").first();
      client.submitForm($form);
    });

    $("form").on("keyup", "input", function (e){
      if (e.which == 13) {
        var $form = $(this).parents("form").first();
        client.submitForm($form);
      }

      if ($(this).hasClass("generate-slug")) {
        var val = $(this).val();
        client.generateSlug(val);
      }
    });

    $(".features").on("click", "a", function (e) {
      var $article = $($(this).attr("href"));
      $article.trigger("click");

      var t = $(this).attr("href");
      e.preventDefault();
      if ($(t).length > 0) {
        var target = $(t).offset().top - 120;
        if (target < 0) { target = 1; }
        $(".entries").animate({ scrollTop: target+"px" }, 250);
      }
    });

    $("form").on("keyup",".CodeMirror", function(){mirror.save();});

    $(".new-thing").on("keyup", "[name=markdown]", client.updatePreview);
    $(".edit-thing").on("keyup", "[name=markdown]", client.updatePreview);

    $(".new-thing").on("keyup", "[name=title]", function () {
      client.generateSlug($(this).val())
    });

    $(".entry").on("keyup", client.entryKeypressHandler);

    $("body").on("click", ".close-feature", function (e) {
      e.stopPropagation();
      $(".feature").removeClass("active");
    });

    $("body").on("click", ".close", function (e) {
      e.stopPropagation();
      var $parent = $(this).parents("article");
      $parent.removeClass("active");
    });

    $("body").on("click", ".delete", client.deleteEntry);

    $("body").on("click", ".edit", function (e) {
      client.editEntry( $(this).parents("article").data().id );
    });

    $("body").on("click", "article:not(.active)", function (e) {
      var $target = $(e.target);
      if (!$(e.target).attr("href")) {
        $(this).activate(true);
      }

    });

    $("body").on("click", ".vote", client.doVote);
    $("body").on("click", ".tag", client.tagEntry);

    $(".panel").on("click", ".swap-panel-forms", function () {
      $(".panel form").toggleClass("active");
      $(".panel form.active input").first().focus();
    });
    $(".panel form.active input").first().focus();

    $(".switch-to").on("click", client.switchNames)

    $("body").on("click", ".load-replies", client.getChildren)
    $("body").on("click", ".make-reply", client.replyForm)

    $(".entries").on("click", ".entry", function () {
      var id = $(this).data().id;
      var url = '/get/entry/' + id;
      io.socket.post(url, function (data) {
        console.log(data);
        client.loadEntry(data);
        $(".feature").addClass("active");

      });
    })
    window.onpopstate = function(event) {
      console.log(event)
      if (event.state == null) {
        if (window.location.hash == "") {
          window.location.reload(true);
        }
      } else {
        client.loadEntry(event.state, true);
      }
    };
  },

  loadEntry: function (data, popState) {
    var user = false;
    if ($("html").hasClass("logged-in")) {
      user = true;
    }    
    if (!popState) {
      history.pushState(data, data.entry.title, "/sub/" + data.entry.postedTo.slug + "/" + data.entry.slug);
    }
    var data = { entry: data.entry, comments: data.comments, user: user };
    var html = new EJS({ url: '/templates/entry-article.ejs' }).render(data);
    $(".feature").animate({ scrollTop: "0px" }, 250).html(html);
  },

  setupSockets: function () {
    io.socket.on("message", function (data) {
      console.log(data);
    });



    io.socket.on("listing-data", function (data) {
      console.log("Listing Data:",data)
    });

    io.socket.on("vote", function (data) {
      console.log("VOTE:",data)
      var $parent = $("[data-id='"+data.entryid+"']");
      var $score = $parent.find(".score");
      var score = data.ups - data.downs;
      console.log($parent, $score)
      $score.find(".ups").text(data.ups);
      $score.find(".downs").text(data.downs);
      $score.find(".totes").text(score);
    });
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
      $(".login-form [name=email]").val( $(".signup-form [name=email]").val() );
      $(".login-form [name=password]").val( $(".signup-form [name=password]").val() );
      $(".login-form .submit").trigger("click");
    },

    createSub: function (data) {
      if (data.name) {
        location.href = "/sub/" + data.name
      }
    },

    output: function (data, $form) {
      if ($form){
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

      if (data.callback && client.callbacks[data.callback]) {
        client.callbacks[data.callback]();
      }
    },

    renderChildren: function (data, $li) {
      console.log(data);
      var html = new EJS({ url: '/templates/load-replies.ejs' }).render({ entries: data });
      $li.append(html);
      console.log(html);
    }
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
        console.log("Form post success:", data);
        if (client.callbacks[callback]){
          client.callbacks[callback](data, $form);
        }
      }
    });
  },

  tagEntry: function () {
    var $el = $(this);
    $el.toggleClass("active")
    var tag = $el.data().tag;
    var id = $el.parents("article").data().id;
    var data = {
      id: id,
      tag: tag
    }
    $.ajax({
      type: "POST",
      url: "/tag/entry",
      data: data,
      success: function (data) {
        console.log(data);
      }
    });
  },

  switchNames: function (e) {
    e.preventDefault();
    var $el = $(this);
    var name = $el.data().name;
    var data = {
      name: name
    }
    $.ajax({
      type: "POST",
      url: "/switch",
      data: data,
      success: function (data) {
        $("[data-name]").parent().removeClass("active");
        $("[data-name='" + name + "']").parent().addClass("active");
        $(".userinfo .bold").text(name);
        client.callbacks.output(data);
      }
    });
  },

  editSub: function (data) {
    mirror.save();
  },

  editEntry: function (id) {
    location.href = "/edit/entry/" + id
  },

  submitEntryEdit: function(data) {
    console.info(data);
  },

  slug: function (text) {
    return text.toLowerCase().replace(/[^a-zA-Z0-9\s]/g,'').replace(/\s/g, "-");
  },

  generateSlug: function (data) {
    var title = data.trunc(64);;
    var slug = title.toLowerCase().replace(/[^a-zA-Z0-9\s]/g,'').replace(/\s/g, "-");
    $("input[name=slug]").val(slug);
    $(".slug").text(slug);
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

  getChildren: function () {
    var $el = $(this);
    var $parent = $(this).parents("article");
    var $li = $(this).parents("li");
    var id = $li.data().id;

    $.ajax({
      type: 'POST',
      url: '/children/' + id,
      data: { },
      success: function (data) {
        $el.remove();
        client.callbacks.renderChildren(data, $li);
      }
    });
  },

  replyForm: function (e) {
    e.preventDefault();
    var $parent = $(this).parents("li").first();
    var id = $parent.data().id;
    var $footer = $parent.find("footer");
    var $form = $footer.find("form");
    var $article = $("<input />", {
      "hidden": true,
      "value": $("article.active").data().id,
      "name": "entryid"
    });
    $form.append($article);
    $(".comment form").addClass("off");
    $form.removeClass("off");
  },

  doVote: function () {
    var dir = $(this).data().dir;
    var $el = $(this);
    var $entry = $(this).parents("article");
    var id = $entry.data().id;
    var score = {
      ups: parseInt($entry.find(".ups").text()),
      downs: parseInt($entry.find(".downs").text()),
      total: parseInt($entry.find(".totes").text())
    }

    if ($el.isActive() && dir == "up") {
      score.ups--;
    }
    if (!$el.isActive() && dir == "up") {
      score.ups++;
    }
    if ($el.isActive() && dir == "down") {
      score.downs--;
    }
    if (!$el.isActive() && dir == "down") {
      score.downs++;
    }
    score.total = score.ups - score.downs;

    client.updateVotes($entry, score)

    if ($el.isActive()) {
      $el.deactivate();
      dir = "neutral"
    } else {
      $el.activate(true);
    }

    client.sendVote(id, dir);
    return;
  },

  updateVotes: function ($entry, score) {
    $entry.find(".ups").text(score.ups);
    $entry.find(".downs").text(score.downs);
    $entry.find(".totes").text(score.total);
  },

  sendVote: function (id, direction) {
    $.ajax({
      type: 'POST',
      url: '/vote/' + direction + '/' + id,
      data: { doVote: true },
      success: function (data) {
        console.log(data);
      }
    });
  },

  deleteEntry: function (id) {
    var $parent = $(this).parents("article");
    var id = $parent.data().id;
    $.ajax({
      type: 'POST',
      url: '/delete/entry/' + id,
      data: { doVote: true },
      success: function (data) {
        console.log(data);
        if (data.success) {
          $("article[data-id='" + id + "']").remove();
        }
      }
    });
  }
}

client.init();
























(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-65514000-1', 'auto');
ga('send', 'pageview');
