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
          postedBy: '55be24b83b118ad47c1bd24a',
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
    Botted.findOne(req.params.id)
    .exec( function (err, doc) {
      doc.reviewed = true;
      doc.save();

      var sub = doc.postedTo
      Sub.findOne({ name: sub })
      .exec( function (err, sub) {
        var entry = {
          postedBy: doc.postedBy,
          title: doc.title,
          slug: doc.title.toLowerCase().replace(/[^a-zA-Z0-9\s]/g,'').replace(/\s/g, "-"),
          media: doc.media || "",
          postedTo: sub.id,
          nsfw: doc.nsfw
        }

        Entry.create(entry)
        .exec( function (err, doc) {
          if (err) return res.json(err)
          return res.json({ message: "Success!" })
        });
      });
    });
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