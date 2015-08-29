var request = require('request');

module.exports = {
  get: function (fetches) {
    request('http://www.reddit.com/r/all.json?limit=100', function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var json = JSON.parse(body);
        var entries = json.data.children;
        var howmany = 0;
        console.log("[BOT] Filtering " + entries.length + " entries...")
        for (entry in entries) {
          var data = {
            postedTo: entries[entry].data.subreddit,
            title: entries[entry].data.title,
            media: entries[entry].data.url,
            nsfw: entries[entry].data.over_18
          }
          if (data.media) {
            Botted.create(data).exec( function (err, doc) {
              if (doc) howmany++;
            });
          }
        }
        console.log({ message: "Success. We created new entries on fetch " + fetches });
        return;
      } else {
        console.log({ message: "Error." });
        return;
      }
    });

  },

  postRandom: function() {

    getRandom();

    function getRandom() {
      Botted.find({ reviewed: {$eq: false } })
      .exec( function (err, data) {
        if (data) {
          var rand = Math.floor(Math.random()*(data.length-0)+0);
          var which = data[rand];
          console.log(which)
          if (which) {
            var succeed = verify(which);
            if (succeed) {
              approve(data[rand]);
            } else {
              ignore(data[rand]);
            }
          }
        } else {
          console.log("[BOT] Nothing to post.")
          return;
        }
      });
    }

    function verify(entry) {
      var ignoreSubs = ["blackpeopletwitter", "blog", "announcements", "girlsfinishingthejob", "ama", "tifu", "eli5", "dota2", "leagueoflegends", "4chan"];
      var ignoreTitles = [ " i ", " i'm ", " i'll ", " my ", " ama "];
      var title = entry.title;
      var sub = entry.postedTo;
      var succeed = true;

      var lowerTitle = title.toLowerCase();
      for ( var x = 0; x < ignoreTitles.length; x++ ) {
        if (lowerTitle.indexOf(ignoreTitles[x]) > -1) {
          console.log("Bad title.")
          succeed = false;
        }
      }

      var badsub = (ignoreSubs.indexOf(sub.toLowerCase()) > -1) ? true : false;

      if (badsub) {
        succeed = false;
        console.log("Bad sub.", sub)
      }

      return succeed;
    }

    function ignore(entry) {
      Botted.findOne(entry.id)
      .exec( function (err, doc) {
        doc.reviewed = true;
        doc.save();
        console.log("[BOT] Entry ignored.")
        getRandom();
      });
    }

    function approve(entry) {
      Name.find({ user: '55c1900e895c065c2e006061' })
      .exec( function (err, data) {
        var rand = Math.floor(Math.random()*(data.length-0)+0);
        whichName = data[rand].id;
        andGo(entry);
      });
    }

    function andGo(entry) {
      Botted.findOne(entry.id)
      .exec( function (err, doc) {
        doc.reviewed = true;
        doc.save();
        var subslug = doc.postedTo;
        Sub.findOne({ name: subslug })
        .exec( function (err, sub) {
          if (sub == undefined) {
            var sub = {
              id: '55c2af394d9e89df572ba5ba'
            }
          }
          var entry = {
            postedBy: whichName,
            title: doc.title,
            slug: doc.title.toLowerCase().replace(/[^a-zA-Z0-9\s]/g,'').replace(/\s/g, "-"),
            media: doc.media || "",
            postedTo: sub.id,
            subs: [sub.id],
            nsfw: doc.nsfw,
            ups: 1, // Math.floor(Math.random() * 12) + 4,
            downs: 0, //Math.floor(Math.random() * 6) + 2
          }
          if (entry.media != "") {
            var uri = decodeURI(entry.media);
            var api = "http://api.embed.ly/1/oembed?url="+uri+"&key=8f0ccd90b8974261a8d908e5f409f7cb";
            getMediaEmbed(api, entry);
          } else {
            createEntry(entry);
          }
        });
      });
}
function createEntry(entry) {
  Entry.create(entry)
  .exec( function (err, doc) {
    if (err) return res.json(err)
      console.log("[BOT] Entry created!");
    return;
  });
}

function getMediaEmbed(api, entry) {
  request(api, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      entry.oembed = body;
      createEntry(entry);
    } else {
      console.log("[BOT] ERROR.")
      return;
    }
  });
}


},

voteRandom: function () {
  var cycle = 0;
  setTimeout(makeVote, 10000*cycle);

  function makeVote() {
    cycle++;
    // console.log("Attempting to vote...");
    var query = { where: { nsfw: false }, limit: 33, skip: 0, sort: 'createdAt DESC' };

    Entry.find(query)
    .exec( function(err, data) {
      var rand = Math.floor(Math.random()*(data.length-0)+0);
      var which = data[rand];

      Entry.findOne(data[rand].id)
      .exec(function (err, doc) {
        doc.ups = doc.ups + 1;
        doc.save();

        Vote.create({
          vote: true,
          user: '55c1900e895c065c2e006061',
          entry: doc.id
        }).exec( function (err, vote) {
          // console.log("Vote created...", doc.title);
          sails.sockets.blast('vote', {
            entryid: doc.id,
            ups: doc.ups,
            downs: doc.downs
          });
          setTimeout(makeVote, 10000*cycle);
        });
      });
    });
  }
},

approve: function (req, res) {
  console.log("APPROVING...")
  var whichName;

  Name.find({ user: '55c1900e895c065c2e006061' })
  .exec( function (err, data) {
    var rand = Math.floor(Math.random()*(data.length-0)+0);
    whichName = data[rand].id;
    andGo();
  });

  function andGo() {
    Botted.findOne(req.params.id)
    .exec( function (err, doc) {
      doc.reviewed = true;
      doc.save();
      var subslug = doc.postedTo;
      Sub.findOne({ name: subslug })
      .exec( function (err, sub) {
        if (sub == undefined) {
          var sub = {
            id: '55c2af394d9e89df572ba5ba'
          }
        }
        var entry = {
          postedBy: whichName,
          title: doc.title,
          slug: doc.title.toLowerCase().replace(/[^a-zA-Z0-9\s]/g,'').replace(/\s/g, "-"),
          media: doc.media || "",
          postedTo: sub.id,
          subs: [sub.id],
          nsfw: doc.nsfw,
            ups: 1, // Math.floor(Math.random() * 12) + 4,
            downs: 0, //Math.floor(Math.random() * 6) + 2
          }
          if (entry.media != "") {
            var uri = decodeURI(entry.media);
            var api = "http://api.embed.ly/1/oembed?url="+uri+"&key=8f0ccd90b8974261a8d908e5f409f7cb";
            getMediaEmbed(api, entry);
          } else {
            createEntry(entry);
          }
        });
    });
}

function getMediaEmbed(api, entry) {
  request(api, function (error, response, body) {
    console.log(api);
    if (!error && response.statusCode == 200) {
      entry.oembed = body;
      createEntry(entry);
    } else {
      return res.json({ message: "Error." })
    }
  });
}

function createEntry(entry) {
  Entry.create(entry)
  .exec( function (err, doc) {
    if (err) return res.json(err)
      return res.json({ message: "Success!" })
  });
}

},

ignore: function (req, res) {
  Botted.findOne(req.params.id)
  .exec( function (err, doc) {
    doc.reviewed = true;
    doc.save();
    return res.json({ message: "Success!" })
  })
}
}


