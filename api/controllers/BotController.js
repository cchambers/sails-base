var request = require('request');

module.exports = {
  get: function (req, res) {
    request('http://www.reddit.com/r/all.json', function (error, response, body) {
      if (!error && response.statusCode == 200) {
        filterData(body);
        return res.json({ message: "Success. We created new entries for review." });
      } else {
        return res.json({ message: "Error." }) 
      }
    });


    function filterData(data) {
      var json = JSON.parse(data);
      var entries = json.data.children;
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
          });
        }
      }
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
            ups: Math.floor(Math.random() * 12) + 4,
            downs: Math.floor(Math.random() * 6) + 2
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