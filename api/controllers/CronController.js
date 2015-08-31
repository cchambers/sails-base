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
		sails.controllers.bot.voteRandom(false);
	}, null, true, 'America/Los_Angeles');


	new CronJob('5,15,25,35,45,55 * * * * *', function () {
		sails.controllers.bot.voteRandom(true);
	}, null, true, 'America/Los_Angeles');

	new CronJob('0 */10 * * * *', function () {
		sails.controllers.bot.fGet();
	}, null, true, 'America/Los_Angeles');

	sails.controllers.bot.fGet();


}, 900000)


