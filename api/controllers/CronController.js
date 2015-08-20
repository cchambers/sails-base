var CronJob = require('cron').CronJob;
var fetches = 0;
console.log(sails);
new CronJob('15 * * * * *', function () {
  fetches++;
  sails.controllers.bot.get(fetches);
}, null, true, 'America/Los_Angeles');