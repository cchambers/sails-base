
module.exports = {
  fourOhFour: function (req, res) {
    res.view("404", { data: false });
  },
  fourOhThree: function (req, res) {
    res.view("403", { data: false });
  },
  fiveOhOh: function (req, res) {
    res.view("500", { data: false });
  }
};
