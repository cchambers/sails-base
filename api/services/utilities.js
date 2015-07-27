module.exports = {
  isToday: function (date) {
    var now = new Date();
    var dateSplit = date.toString().split(" ");
    if(dateSplit[3] == now.getFullYear()) {
      if(this.getMonthInt(dateSplit[1]) == now.getMonth()) {
        if(dateSplit[2] == now.getDate()) {
          return true;
        }
      }
    }
    return false;
  },
  
  timeSince: function (date) {
    var seconds = Math.floor((new Date() - date) / 1000);
    var interval = Math.floor(seconds / 3600);
    return interval;
  },
  
  popularity: function (date, score) {
    return (score/this.timeSince(date)).toFixed(2);
  },
  
  addPopScore: function (data) {
    for (i = 0; i < data.length; i++) {
      data[i].pop = this.popularity(new Date(data[i].createdAt),(data[i].ups - data[i].downs));
    }
    return data;
  },
  
  sortByScore: function (data) {
    var i,m,j;
    for (i = -1; ++i < data.length;) {
      for (m = j = i; ++j < data.length;) {
        mScore = data[m].ups - data[m].downs;
        jScore = data[j].ups - data[j].downs;
        if (mScore < jScore) m = j;
        if (mScore == jScore && data[m].createdAt < data[j].createdAt) m = j;
      }
      t1 = data[m];
      t2 = data[i];
      data[m] = t2;
      data[i] = t1;
    }
    return data;
  },
  
  sortByPop: function (data) {
    var i,m,j;
    data = this.addPopScore(data);
    for (i = -1; ++i < data.length;) {
      for (m = j = i; ++j < data.length;) {
        mScore = data[m].pop;
        jScore = data[j].pop;
        if (mScore < jScore) m = j;
        if (mScore == jScore) m = j;
      }
      t1 = data[m];
      t2 = data[i];
      data[m] = t2;
      data[i] = t1;
    }
    return data;
  },
  
  getMonthInt: function (month) {
    var monthInt;
    switch(month) {
      case 'Jan':
        monthInt = 0
        break;
      case 'Feb':
        monthInt = 1
        break;
      case 'Mar':
        monthInt = 2
        break;
      case 'Apr':
        monthInt = 3
        break;
      case 'May':
        monthInt = 4
        break;
      case 'Jun':
        monthInt = 5
        break;
      case 'Jul':
        monthInt = 6
        break;
      case 'Aug':
        monthInt = 7
        break;
      case 'Sep':
        monthInt = 8
        break;
      case 'Oct':
        monthInt = 9
        break;
      case 'Nov':
        monthInt = 10
        break;
      case 'Dec':
        monthInt = 11
        break;
    }
    return monthInt;
  }
  
}