module.exports = {
  list: function (req, res) {
    User.find().exec(function(err, data) {
      if (err) return next(err);
      res.json(data);  
    });
  },

  makeAdmin: function (req, res) {
    User.findOne({ email: req.user.email }, function (err, doc){
      doc.admin = true;
      doc.save();
      return res.redirect("/userlist");
    });
  }
};

