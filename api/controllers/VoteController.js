module.exports = {
	vote: function (req, res) {
    var direction = req.params.direction; // up, down, neutral
    var entry = req.params.entry;
    var user = req.user;
    var vote = voteExists();
    console.log("Exists?", vote);

    if (vote) { // update a vote
      if (direction == "neutral") {
        // find relative vote and add or remove from entry data

        return res.json({ vote: "not yet deleted" })
      } else {

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

    function voteExists() {
      Vote.find({ entry: entry, user: user.id }).exec( function (err, data) {
        if (err) return next(err);
        return data;
      });
    }

    return res.json({ vote: "waiting" })
  },
};

