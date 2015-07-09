

module.exports = {
  list: function (req, res) {
    User.find().exec(function(err, data) {
      if (err) return next(err);
      res.json(data);  
    });
  }
};

