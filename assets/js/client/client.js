/*\
  The Sauce
  Client File
  Functions: 
  - callbacks: An object of callback functions that are run when a after a form submission response.
  - init: Kicks off the app.
  - setup: A place for binds.
  - setupSockets: Configures socket emissions and reactions for the app.
  - loadEntry: Loads a single entry into the SPA's main view.
  - submitForm: Handles the submission of every form on the website! Takes an optional
    data-callback attribute for running on success.
  - tagEntry: Currently sets NSFW/NSFL tags on posts.
  - switchNames: Switches the user's name.
  - editSub: 
  - submitEntryEdit: removed.
  - slug: Takes a single string and returns the slug version. Eventually this needs to check
    the database to see if the slug exists and then increment based on the response.
  - generateSlug: Generates a slug as the user is typing in on the "New Sub" page.
  - updatePreview: Updates the preview box while a user is creating a new entry.
  - convertMarkdown: Takes one param of markdown and returns HTML.
  - keypressHandler: Function for handling keypress events.
  - 
/*\
\*/

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


var app = {
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

    makeComment: function (data) {
      var $comments = $(".comments ul");
      var html = new EJS({ url: "/templates/comment-success.ejs" }).render(data);
      $comments.prepend(html);
      $(".make-comment").remove();
    },

    makeReply: function (data, $form) {
      var $comments = $form.parents("footer").next();
      var html = new EJS({ url: "/templates/comment-success.ejs" }).render(data);
      $comments.prepend(html);
      $form.remove();
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

      if (data.callback && app.callbacks[data.callback]) {
        app.callbacks[data.callback]();
      }
    },

    renderChildren: function (data, $li) {
      var html = new EJS({ url: "/templates/load-replies.ejs" }).render({ entries: data });
      $li.append(html);
    }
  },

  site: { // sitewide functionality
    setup: function () {
      var channel = app.utility.slug(location.pathname);
      io.socket.get("/sockets/join/" + channel);
      app.site.setupSockets();

      app.keys = {
        nextItem: [83],
        prevItem: [87]
      }

      // WHICH SCRIPTS DO WE NEED AT THIS MOMENT?
      app.frontPage.setup();

      $("body").on("click", ".submit", function () {
        var $form = $(this).parents("form").first();
        app.site.submitForm($form);
      });

      $("form").on("keyup", "input", function (e){
        if (e.which == 13) {
          var $form = $(this).parents("form").first();
          app.site.submitForm($form);
        }

        if ($(this).hasClass("generate-slug")) {
          var val = $(this).val();
          app.generateSlug(val);
        }
      });
      // OKAY, THEN!

      $(".mention").mentionsInput({
        onDataRequest: function (mode, query, callback) {
          var subList = [];
          if(subList.length == 0) {
            $.ajax({
              type: "GET",
              url: "/subs",
              data: { },
              async: false,
              success: function (data) {
                subList = data;
              }
            });
          }
          var list = _.filter(subList, function (item) { return item.name.toLowerCase().indexOf(query.toLowerCase()) > -1 });
          callback.call(this, list);
        },
        triggerChar: "/"
      });

      $("body").on("blur", ".mention", function (e) {

      });

      $("body").on("blur", ".mention", function (e) {
        $("textarea.mention").mentionsInput("getMentions", function(data) {
          var mentionsData = JSON.stringify(data);
          $("textarea[name='postedTo']").val(mentionsData);
        });
      });

      $(".features").on("click", "a", app.frontPage.activateEntry);

      $("body").on("keyup.main", app.keypressHandler);
      $("form").on("keyup",".CodeMirror", function(){mirror.save();});

      $(".new-thing").on("keyup", "[name=markdown]", app.updatePreview);
      $(".edit-thing").on("keyup", "[name=markdown]", app.updatePreview);

      $("body").on("click", ".vote", app.entry.vote);
      $("body").on("click", ".tag", app.entry.tag);
      $("body").on("click", ".make-reply", app.entry.replyForm);
      $("body").on("click", ".load-replies", app.getChildComments);
      $("body").on("click", ".switch-to", app.user.switchNames);
      $("body").on("click", ".close", app.entry.close);

      $("body").on("click", ".delete", function () {
        var sure = confirm("Are you sure you want to delete this?");
        if (sure) {
          app.entry.deleteEntry();
        }
      });

      $("body").on("click", ".back", function () {
        history.back();
      });
      
      $("body").on("click", "#hide-nsfw", function() { app.userToggleSetting("nsfw", true); });
      $("body").on("click", "#hide-nsfl", function() { app.userToggleSetting("nsfl", true); });

      $("body").on("click", "article:not(.active)", function (e) {
        $(this).activate(true);
      });

      // This focuses on the active email field at init.
      $(".panel form.active input").first().focus();
      // This is the toggle for the sign up/log in forms.
      $(".panel").on("click", ".swap-panel-forms", app.header.togglePanelForms);

      // This handles "back" functionality on the front-page. 
      // When you hit back, it looks to a stored data var to load whatever was there.
      window.onpopstate = function(event) {
        // console.log(event);
        if (event.state == null) {
          if (window.location.hash == "") {
            $(".loaded-view.active").removeClass("active");
            $(".front-page .active").removeClass("active");
            history.pushState(null, "/");
          }
        } else {
          app.frontPage.loadEntry(event.state, true);
        }
      };
    },

    setupSockets: function () {
      io.socket.on("message", function (data) {
        // console.log(data);
      });

      io.socket.on("listing-data", function (data) {
        // console.log("Listing Data:",data)
      });

      io.socket.on("vote", function (data) {
        // console.log("VOTE:",data)
        var $parent = $("[data-id='"+data.entryid+"']");
        var $score = $parent.find(".score");
        var score = data.ups - data.downs;
        // console.log($parent, $score)
        $score.find(".ups").text(data.ups);
        $score.find(".downs").text(data.downs);
        $score.find(".totes").text(score);
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
          if (app.callbacks[callback]){
            app.callbacks[callback](data, $form);
          }
        }
      });
    },

    updateVotes: function ($entry, score) {
      $entry.find(".ups").text(score.ups);
      $entry.find(".downs").text(score.downs);
      $entry.find(".totes").text(score.total);
    }
  },

  header: {
    togglePanelForms: function () {
      $(".panel form").toggleClass("active");
      $(".panel form.active input").first().focus();
    }
  },

  user: {
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
          app.callbacks.output(data);
        }
      });
    }
  },

  entry: {
    tag: function () {
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

    vote: function (e) {
      e.stopPropagation();
      var dir = $(this).data().dir;
      var $el = $(this);
      var $entry = $(".loaded-view article");
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

      app.site.updateVotes($entry, score);

      if ($el.isActive()) {
        $el.deactivate();
        dir = "neutral"
      } else {
        $el.activate(true);
      }
      $.ajax({
        type: 'POST',
        url: '/vote/' + dir + '/' + id,
        data: { doVote: true },
        success: function (data) {
          console.log(data);
        }
      });
      return;
    },

    close: function (e) {
      $(".loaded-view").removeClass("active");
      $(".front-page article.active").removeClass("active");
      history.pushState(null, "/");
    },

    deleteEntry: function (id) {
      var $parent = $(".entries article.active");
      var id = $parent.data().id;
      $.ajax({
        type: 'POST',
        url: '/delete/entry/' + id,
        data: { doVote: true },
        success: function (data) {
          if (data.success) {
            $("article[data-id='" + id + "']").remove();
            app.frontPage.closeLoaded();
          }
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
    }
  },

  admin: {
    setup: function () {
      $("body").on("click", ".botted-list .approve", function () {
        var id = $(this).parents("li").data().id;
        var $el = $("[data-id='"+id+"']");
        var url = "/bot/approve/" + id;
        io.socket.post(url, function (data) {
          $el.remove();
        });
      });

      $("body").on("click", ".botted-list .ignore", function () {
        var id = $(this).parents("li").data().id;
        var $el = $("[data-id='"+id+"']");
        var url = "/bot/ignore/" + id;
        io.socket.post(url, function (data) {
          $el.remove();
        });
      });
    }
  },

  init: function () {
    app.site.setup();
    app.admin.setup();
  },

  frontPage: {
    depth: 0,
    sub: 'all',
    height: window.innerHeight,
    width: window.innerWidth,
    setup: function () {
      app.frontPage.sub = location.pathname.split("/")[2] || "all";
      $(".front-page").on("click", "article:not(.active)", function () {
        var id = $(this).data().id;
        app.frontPage.getEntry(id)
      });
      $("body").off("keyup.main")
      $("body").on("keyup", app.frontPage.keypressHandler);
      var $target = $(".front-page article.active");
      if ($target.length > 0) {
        app.frontPage.scrollToEntry($target);
      }
      if ( $("iframe.embedly-embed").length > 0 ) {
        $("iframe.embedly-embed").attr("height", "").attr("width", "");
      }

      // scroll watch
      // make sure the last element in the .entries.front-page list is 
      // never less than view height from the bottom

      var scrollBounce = null;
      $(".front-page").on("scroll", function (e) {
        if (scrollBounce) clearTimeout(scrollBounce);
        scrollBounce = setTimeout( function () {
          if ($(".front-page article").last().offset().top < app.frontPage.height*2) {
            app.frontPage.depth++;
            app.frontPage.loadMoreEntries();
          } 
        }, 100);
      })
    },

    loadMoreEntries: function () {
      var query = app.frontPage.depth * 50;
      if (app.frontPage.sub != "all") {
        var sub = app.frontPage.sub;
        query = sub + " / " + app.frontPage.depth * 50;
      }

      $.ajax({
        type: 'POST',
        url: '/api/entries/' + query,
        data: { },
        success: function (data) {
          var html = new EJS({ url: '/templates/front-page-entries.ejs' }).render(data);
          $(".front-page").append(html);
        }
      });
    },

    keypressHandler: function (e) {
      var key = e.which;

      if ( ($('input:focus').length == 0) && ($('textarea:focus').length == 0)) {
        if (app.keys.nextItem.indexOf(key) >= 0) {
          app.frontPage.nextItem();
        }

        if (app.keys.prevItem.indexOf(key) >= 0) {
          app.frontPage.prevItem();
        }
      }
    },

    nextItem: function () {
      var $current = $(".front-page article.active");
      if (!$current) {
        current = $(".front-page article").first();
      }
      var $next;
      if ($current.length == 0) {
        $next = $("article").eq(0);
      } else {
        $next = $current.next("article");
      }
      $next.trigger("click");
    },

    prevItem: function () {
      var $current = $(".front-page article.active");
      var $prev = $current.prev("article");
      $current.removeClass("active");
      $prev.trigger("click");
    },

    getEntry: function (id) {
      var url = "/get/entry/" + id;
      io.socket.post(url, function (data) {
        // console.log(data);
        app.frontPage.loadEntry(data);
      });
    },

    loadEntry: function (data, popState) {
      var user = false;
      if ($("html").hasClass("logged-in")) {
        user = {
          admin: false
        };
      }   
      if ($("html").hasClass("admin")) {
        user.admin = true;
      }     
      if (!popState) {
        history.pushState(data, data.entry.title, "/sub/" + data.entry.subs[0].slug + "/" + data.entry.slug);
        ga('send', 'pageview');
      } else {
        $(".front-page .active").removeClass("active");
        $(".front-page [data-id='"+data.entry.id+"']").addClass("active");
        app.frontPage.scrollToEntry($(".front-page .active"));
      }
      var data = { entry: data.entry, comments: data.comments, user: user };
      var html = new EJS({ url: '/templates/entry-article.ejs' }).render(data);
      $(".loaded-view").animate({ scrollTop: "0px" }, 250).html(html).addClass("active");
      //$(".loaded-view .load-replies").trigger("click");
      if ( $("iframe.embedly-embed").length > 0 ) {
        $("iframe.embedly-embed").attr("height", "").attr("width", "");
      }
    },

    activateEntry: function (e) {
      e.preventDefault();
      var $article = $($(this).attr("href"));
      $article.trigger("click");
      var t = $(this).attr("href");
      app.frontPage.scrollToEntry($(t));
    },

    scrollToEntry: function ($el) {
      if ($el.length > 0) {
        var target = $el.offset().top - 120;
        if (target < 0) { target = 1; }
        $(".entries").animate({ scrollTop: target+"px" }, 250);
      }
    },

    closeLoaded: function () {
      $(".loaded-view").removeClass("active").html();
    }
  },

  utility: {
    slug: function (text) {
      return text.toLowerCase().replace(/[^a-zA-Z0-9\s]/g,'').replace(/\s/g, "-");
    },

    convertMarkdown: function (data) {
      var converter = new showdown.Converter();
      var text = data;
      var html = converter.makeHtml(text);
      return html;
    }
  },

  generateSlug: function (data) {
    var title = data.trunc(64);
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

  keypressHandler: function (e) {

  },

  getChildComments: function () {
    var $el = $(this);
    var $parent = $el.parents("article");
    var $li = $el.parents("li").first();
    var id = $li.data().id;

    $.ajax({
      type: 'POST',
      url: '/children/' + id,
      data: { },
      success: function (data) {
        $el.remove();
        app.callbacks.renderChildren(data, $li);
      }
    });
  },
  
  userToggleSetting: function (toggle, set) { 
    $.ajax({
      type: 'POST',
      url: '/sockets/settings/toggle/',
      data: { setting: toggle, value: set },
      success: function (data) {
      }
    });
  }
}



app.init();








function timeSince (date) {var seconds = Math.floor((new Date() - date) / 1000);var interval = Math.floor(seconds / 31536000);if (interval > 1) {return interval + " years";}interval = Math.floor(seconds / 2592000);if (interval > 1) {return interval + " months";}interval = Math.floor(seconds / 86400);if (interval > 1) {return interval + " days";}interval = Math.floor(seconds / 3600);if (interval > 1) {return interval + " hours";}interval = Math.floor(seconds / 60);if (interval > 1) {return interval + " minutes";}return Math.floor(seconds) + " seconds";}














//String.prototype.trunc = function(n,useWordBoundary){
//  var toLong = this.length>n,
//  s_ = toLong ? this.substr(0,n-1) : this;
//  s_ = useWordBoundary && toLong ? s_.substr(0,s_.lastIndexOf(' ')) : s_;
//  return toLong ? s_ : s_;
//};
//
//(function($){
//  $.fn.isActive = function () {
//    return $(this).hasClass("active");
//  };
//
//  $.fn.activate = function (doSiblings, toggle) {
//    if (doSiblings) $(this).siblings().deactivate();
//    if (toggle) return $(this).toggleClass("active");
//    return $(this).addClass("active");
//  };
//
//  $.fn.deactivate = function () {
//    return $(this).removeClass("active");
//  };
//})(jQuery);

(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-65514000-1', 'auto');
ga('send', 'pageview');
