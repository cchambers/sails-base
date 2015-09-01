/**
 * SearchController
 *
 * @description :: Server-side logic for managing searches
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

 module.exports = {

 	index: function (req, res) {
 		return res.view('search', { data: false });
 	},

 	subs: function (req, res) {
 		var like = req.body.query;
 		Sub.find( { 
 			or: [
 			{
 				like: { 
 					name: '%'+like+'%'
 				}
 			},
 			{ 
 				like: {
 					description: '%'+like+'%' 
 				} 
 			},
 			{ 
 				like: {
 					tagline: '%'+like+'%' 
 				} 
 			},
 			{ 
 				like: {
 					slug: '%'+like+'%' 
 				} 
 			}],
 			limit: 10,
 			sort: 'name DESC'
 		}, function ( err, data ){
 			return res.json({ data: data });
 		});
 	},

 	names: function (req, res) {
 		var like = req.body.query;
 		Name.find( { 
 			like: { 
 				name: '%'+like+'%'
 			},
 			limit: 10,
 			sort: 'name DESC'
 		}, function ( err, data ){
 			return res.json({ data: data });
 		});
 	},

 	entries: function (req, res) {
 		var like = req.body.query;
 		Entry.find( { 
 			or: [
 			{
 				like: { 
 					title: '%'+like+'%'
 				}
 			},
 			{ 
 				like: {
 					media: '%'+like+'%' 
 				} 
 			},
 			{ 
 				like: {
 					content: '%'+like+'%' 
 				} 
 			}],
 			limit: 10,
 			sort: 'createdAt DESC'
 		})
 		.populate('subs')
 		.populate('postedBy')
 		.exec( function ( err, data ){
 			return res.json({ data: data });
 		});
 	},


 };

