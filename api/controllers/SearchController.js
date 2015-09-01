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
 		}, function ( err, subs ){
 			return res.json({ data: subs });
 		});
 	},

 	users: function (req, res) {
 		return res.json({ message: "not yet" })
 	},


 };

