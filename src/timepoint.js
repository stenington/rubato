var timepoint = function(spec) {
  var date, message, type;

  date = spec.date;
  message = spec.message || "";
  type = spec.type || "";

  var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  var that = {};

  that.getDate = function() {
    return date;
  };

  that.getDay = function() {
    return days[that.getDate().getDay()];
  };

  that.getMessage = function() {
    return message;
  };

  that.getType = function() {
    return type;
  }

  that.getTimeRemainingFrom = function( startDate ){
    startDate.setMilliseconds(0); // TODO: is this a bug?
    var delta_ms = that.getDate().getTime() - startDate.getTime();
    var diff = {};
    diff.hours = Math.floor(delta_ms / (60*60*1000));
    diff.minutes = Math.floor((delta_ms % (60*60*1000)) / (60*1000));
    diff.seconds = Math.floor(((delta_ms % (60*60*1000)) % (60*1000)) / 1000);
    if( diff.minutes < 10 ){
      diff.minutes = "0" + diff.minutes;
    }
    if( diff.seconds < 10 ){
      diff.seconds = "0" + diff.seconds;
    }
    diff.timeDisplay = diff.hours + ":" + diff.minutes;
    diff.timeWithSecondsDisplay = diff.hours + ":" + diff.minutes + ":" + diff.seconds;
    return diff;
  };

  that.getTimeUntil = function() {
    return that.getTimeRemainingFrom(new Date());
  };

  that.isExpired = function() {
    var d = new Date();
    var foo = d.getTime();
    var bar = that.getDate().getTime();
    return (d.getTime() - that.getDate().getTime()) > 0;
  };

  return that;
};

var timepointGenerator = function(spec) {
  var day, hour, minute, message;

  day = spec.day || 0;
  hour = spec.hour || 0;
  minute = spec.minute || 0;
  message = spec.message || "";

  var that = {};

  that.getDay = function() {
    return day;
  };

  that.getHour = function() {
    return hour;
  };

  that.getMinute = function() {
    return minute;
  };

  that.getMessage = function() {
    return message;
  };

  that.getNextInstanceFrom = function( startDate ) {
    var date = new Date(
      startDate.getFullYear(),
      startDate.getMonth(),
      startDate.getDate() + (day - startDate.getDay()),
      hour, minute, 0, 0
    );
    if( date < startDate ){
      date.setDate(date.getDate() + 7);
    }
    var tp = timepoint({
      date: date,
      message: that.getMessage()
    });
    return tp;
  };

  that.getNextInstance = function() {
    return that.getNextInstanceFrom(new Date());
  }

  return that;
};
