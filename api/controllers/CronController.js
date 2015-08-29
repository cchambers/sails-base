var CronJob = require('cron').CronJob;
var fetches = 0;


setTimeout( function () {
	new CronJob('0 */15 * * * *', function () {
		fetches++;
		sails.controllers.bot.get(fetches);
	}, null, true, 'America/Los_Angeles');


	new CronJob('0 */4 * * * *', function () {
		sails.controllers.bot.postRandom();
	}, null, true, 'America/Los_Angeles');


	new CronJob('0,10,20,30,40,50,60 * * * * *', function () {
		sails.controllers.bot.voteRandom();
	}, null, true, 'America/Los_Angeles');
}, 10000)
