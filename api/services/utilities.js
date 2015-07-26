module.exports = {
  isToday: function (date) {
    var date = new Date();
    var dateSplit = date.toString().split(" ");
    if(dateSplit[3] == date.getFullYear()) {
      if(this.getMonthInt(dateSplit[1]) == date.getMonth()) {
        if(dateSplit[2] == date.getDate()) {
          return true;
        }
      }
    }
    return false;
  },
  
  sortByScore: function (data) {
    var i,m,j;
    for (i = -1; ++i < data.length;) {
      for (m = j = i; ++j < data.length;) {
        mScore = data[m].ups - data[m].downs;
        jScore = data[j].ups - data[j].downs;
        if(data[m].slug == "todays-booty") console.info(data[m].createdAt);
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