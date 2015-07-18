module.exports = {
	vote: function (req, res) {
    var direction = req.params.direction; // up, down, neutral
    var entry = req.params.entry;
    var data = req.body;

    // check if vote already exists -- 
    // if not, save vote.
    // if it does, update.
  },
};

