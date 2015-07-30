var utilities = require('../services/utilities');

module.exports = {
  _config: {
    actions: false,
    shortcuts: false,
    rest: false
  },

  index: function (req, res) {
    var viewdata = {
      images: [],
      text: [],
      links: [],
      videos: []
    }

    Entry.find({ nsfw: { $ne: true } })
    .populate('comments')
    .populate('postedTo')
    .populate('postedBy')
    //.populate('votes', { user: req.user.id })
    .exec( function (err, data) {
      for (var x = 0; x < data.length; x++) {
        if (data[x].media) { 
          if ( data[x].media.indexOf('.jpg') > 0 || data[x].media.indexOf('.jpeg') > 0 || data[x].media.indexOf('.gif') > 0  || data[x].media.indexOf('.png') > 0 ) {
            viewdata.images.push(data[x]);
          } else if ( data[x].media.indexOf('youtube') > 0 || data[x].media.indexOf('youtu.be') > 0 || data[x].media.indexOf('liveleak') > 0) {
            viewdata.videos.push(data[x]);
          } else {
            viewdata.links.push(data[x]);
          }
        } else {
          viewdata.links.push(data[x]);
        }
      }
      viewdata.images = utilities.sortByPop(viewdata.images);
      viewdata.text = utilities.sortByPop(viewdata.text);
      viewdata.videos = utilities.sortByPop(viewdata.videos);
      viewdata.links = utilities.sortByPop(viewdata.links);
      loadView();
    });

    function loadView() {
      return res.view('front-page', { user: req.user, data: viewdata  })
    }
  }
};
