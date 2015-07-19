module.exports = {
    new: function (req, res) {
        if ( typeof(req.user) == 'undefined' ) {
            return res.redirect('/');
        } else {
            return res.view('new-entry', { user: req.user, data: false });
        }
    },

    addComment: function(req, res){

        if ( typeof(req.user) == 'undefined' ) {
            return res.redirect('/');
        } else {
            Entry.findOne({slug: req.body.slug})
            .exec( function (err, data) {
                Comment.create({
                    entry: data.id,
                    content: req.body.message,
                    postedBy: req.user.username
                }).exec(function(err, comment){

                    if(err) return next(err);

                    Entry.findOne({ slug: req.body.slug })
                        .populate('comments')
                        .exec(function(err, doc) {

                        return;

                    });
                });

            });

            return res.redirect('/');
        }
    }
};
