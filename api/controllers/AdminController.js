module.exports = {
  index: function (req, res) {
    return res.json({ message: "Yep!" });
  },

  listBotted: function (req, res) {
    Botted.find({ reviewed: { $eq: false } })
    .exec( function (err, data) {
      return res.view("admin-botted-list", { data: data });
    })
  }
};
