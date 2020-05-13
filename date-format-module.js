var months=['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
var mon = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

var methods = {
  ddmonyyyy: function(argument) {
    // 1-Jan-2020
    var date = new Date(argument);
    var changedDate = date.getDate()+'-'+mon[date.getMonth()]+'-'+date.getFullYear();
    return changedDate;
  },
  ddmonthsyyyy: function (argument) {
    // 1-January-2020
    var date = new Date(argument);
    var changedDate = date.getDate()+'-'+months[date.getMonth()]+'-'+date.getFullYear();
    return changedDate;
  },
  ddmmyyyy: function(argument) {
    // 1-01-2020
    var date = new Date(argument);
    var changedDate = date.getDate()+'-'+(date.getMonth()+1)+'-'+date.getFullYear().toString();
    return changedDate;
  },
  MonthsYYYY: function (argument) {
    // January 2020
    var date = new Date(argument);
    var changedDate = months[date.getMonth()]+' '+date.getFullYear();
    return changedDate;
  },
  Month: function(argument) {
    // January
    var date = new Date(argument);
    var changedDate = months[date.getMonth()];
    return changedDate;
  }
}

module.exports = methods;
