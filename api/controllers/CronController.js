var CronJob = require('cron').CronJob;
var fetches = 0;


new CronJob('*/15 * * * *', function () {
  fetches++;
  sails.controllers.bot.get(fetches);
}, null, true, 'America/Los_Angeles');


new CronJob('*/4 * * * *', function () {
  sails.controllers.bot.postRandom();
}, null, true, 'America/Los_Angeles');


new CronJob('*/1 * * * * *', function () {
  sails.controllers.bot.voteRandom();
}, null, true, 'America/Los_Angeles');