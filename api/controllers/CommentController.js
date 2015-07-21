module.exports = {
    new: function (req, res) {
        if ( typeof(req.user) == 'undefined' ) {
            return res.redirect('/');
        } else {
            Comment.findOne({id: req.query.parent}).exec(function(err,data){
                return res.view('new-comment', { user: req.user, data: false, parent: data, slug: req.query.slug});
            })
        }
    },
    reply: function(req, res){
        Comment.findOne({id: req.params.id})
            .exec(function(err, data){
                Entry.findOne({slug: req.body.slug})
                    .exec(function(err, entry){
                        Comment.create({
                            entry: entry.id,
                            parent: data.id,
                            content: req.body.message,
                            postedBy: req.user.username
                        }).exec(function(err, comment){
                            return;
                        })
                    });
            });
    }
};
