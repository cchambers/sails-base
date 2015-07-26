module.exports = {
  create: function (req, res) {
    User.findOne(req.user.id)
    .populate('names')
    .exec( function (err, doc) {
      if (req.body.name == "") {
        return res.json({ message: "Space... the final frontier." })
      } 

      if (doc.names.length >= 10) {
        return res.json({ message: "You already have 10 names." })
      } 

      Name.findOne({ name: req.body.name }, function (err, doc) {
        console.log("Namefind:",doc)
        if (doc) {
          return res.json({ message: "That name exists already." })
        }
        var data = {
          user: req.user.id,
          name: req.body.name
        }
        Name.create(data, function (err, doc) {
          console.log(doc);
          return res.json({ message: "Name created.", reload: true })
        });
      });
    });
  },

  switchTo: function (req, res) {
    var name = req.body.name;

    Name.findOne({ name: name })
    .populate('user')
    .exec( function (err, doc) { 
      if (req.user.id == doc.user.id) {
        User.findOne(req.user.id)
        .exec( function (err, doc) {
          doc.username = name;
          doc.save();
          return res.json({ message: "Switched." })
        });
      }
    });
  }
};

