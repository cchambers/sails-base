module.exports = {
	vote: function (req, res) {
    var direction = req.params.direction; // up, down, neutral
    var entry = req.params.entry;
    var user = req.user;
    var vote = (direction == "up");
    var exists = false;

    checkExistence();

    function checkExistence() {
      Vote.findOne({ entry: entry, user: user.id }).exec( function (err, votedata) {
        if (err) return next(err);
        if (votedata) {
          doVote(votedata);
        } else {
          doVote();
        }
      });
    }

    function doVote(exists) {
      var voteData;
      if (exists) { // update a vote
        // console.log("VOTE EXISTS", "going " + direction);
        if (direction == "neutral") {
          //exists.destroy();
          Vote.destroy({ user: exists.user, entry: exists.entry })
          .exec( function (err, data) {
            voteData = data;
            Entry.findOne(entry)
            .exec( function (err, doc) {
              console.log(voteData[0].vote)
              if (voteData[0].vote) {
                console.log("removed upvote")
                doc.ups--;
                if (doc.ups < 0) doc.ups = 0;
              } else {
                console.log("removed downvote")
                doc.downs--;
                if (doc.downs < 0) doc.downs = 0;
              }
              doc.save();
              blastVoteUpdate(entry, doc);
              console.log("document updated for destroy");
              return res.json({ vote: "" });
            });
          });
        } else {
          Vote.update({ user: exists.user, entry: exists.entry }, { vote: vote }).exec( function (err, data) {
            Entry.findOne(entry).exec( function (err, doc) {
              if (vote) {
                doc.ups++;
                doc.downs--;
              } else {
                doc.downs++;
                doc.ups--;
              }
              doc.save();
              blastVoteUpdate(entry, doc);
              console.log("document updated for reversal of vote");
              return res.json({ vote: "" });
            });
          })
          
        }
      } else { // create NEW vote
        console.log("VOTE DOES NOT EXIST")
        Vote.create({ user: user.id, entry: entry, vote: vote })
        .exec( function (err, vote) {
          console.log("vote created");
          updateEntry();
        });
      }
    }

    function blastVoteUpdate (entry, doc) {
      sails.sockets.blast('vote', {
        entryid: entry,
        ups: doc.ups,
        downs: doc.downs
      })
    }

    function updateEntry() {
      Entry.findOne(entry).exec( function (err, doc) {
        if (vote) {
          doc.ups++
        } else {
          doc.downs++;
        }
        doc.save();
        console.log("document updated");
        blastVoteUpdate(entry, doc);
        return res.json({ vote: "vote created" });
      });
    }
  },
};

