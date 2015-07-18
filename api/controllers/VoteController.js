module.exports = {
	vote: function (req, res) {
    var direction = req.params.direction; // up, down, neutral
    var entry = req.params.entry;
    var user = req.user;

    checkExistence();

    function checkExistence() {
      var exists = false;
      Vote.find({ entry: entry, user: user.id }).exec( function (err, data) {
        if (err) return next(err);
        if (data) {
          exists = data;
        }
        doVote(exists);
      });
    }

    function doVote(exists) {
      if (exists) { // update a vote
        if (direction == "neutral") {
          // find relative vote and add or remove from entry data
          exists.destroy();
          return res.json({ message: "vote neutralized" })
        } else {
          var vote = (direction == "up");
          exists.vote = vote;
          exists.save;
          return res.json({ message: "vote updated" })
        }
      } else { // create NEW vote
        var bool = (direction == "up");
        Vote.create({ user: user.id, entry: entry, vote: bool });

        Entry.findOne(entry).exec( function (err, data) {
          if (bool) {
            data.ups++
          } else {
            data.downs++;
          }
          data.save();
        });

      }
      return res.json({ vote: "updated" })
    }

  },
};

