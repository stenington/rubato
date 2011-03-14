var JAN = 0;
var FEB = 1;
var MAR = 2;
var APR = 3;
var MAY = 4;
var JUN = 5;
var JUL = 6;
var AUG = 7;
var SEP = 8;
var OCT = 9;
var NOV = 10;
var DEC = 11;

describe("Timepoint", function(){

  it("should be creatable", function(){
    assert(timepoint({})).should(beAn, Object);
  });

  it("should have a date, message and type", function(){
    var tp = timepoint({
      date: new Date(),
      message: "hi",
      type: "foo"
    });
    assert(tp.getDate()).should(beA, Date);
    assert(tp.getMessage()).should(eql, "hi");
    assert(tp.getType()).should(eql, "foo");
  });

  it("should have 'time remaining from' helper", function(){
    var now = new Date(2011, 0, 1);
    var tp = timepoint({
      date: new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        now.getHours() + 30,
        now.getMinutes() + 45,
        now.getSeconds(), 
        0
      ),
      message: "hi there"
    });
    assert(tp.getTimeRemainingFrom(now).hours).should(eql, 30);
    assert(tp.getTimeRemainingFrom(now).minutes).should(eql, 45);
    assert(tp.getTimeRemainingFrom(now).seconds).should(eql, 0);
    assert(tp.getTimeRemainingFrom(now).timeDisplay).should(eql, "30:45");
    assert(tp.getTimeRemainingFrom(now).timeWithSecondsDisplay).should(eql, "30:45:00");
  });

  it("should have 'time remaining' helper", function(){
    var tp = timepoint({
      date: new Date(), 
      message:"hi"
    });
    assert(tp.getTimeUntil()).should(include, 'hours');
    assert(tp.getTimeUntil()).should(include, 'minutes');
    assert(tp.getTimeUntil()).should(include, 'seconds');
  });

  it("should pad less than 10 minutes and seconds with zero", function(){
    var now = new Date();
    var tp = timepoint({
      date: new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        now.getHours() + 5,
        now.getMinutes() + 7,
        now.getSeconds() + 1, 
        0
      ),
      message: "hi there"
    });
    assert(tp.getTimeRemainingFrom(now).hours).should(eql, 5);
    assert(tp.getTimeRemainingFrom(now).minutes).should(match, /07/);
    assert(tp.getTimeRemainingFrom(now).seconds).should(match, /01/);
  });
});

describe("Timepoint Generator", function(){
  it("should be creatable", function(){
    assert(timepointGenerator({})).should(beAn, Object);
  });

  it("should specify a day of week and time to do something", function(){
    var tp = timepointGenerator({
      day: 0,
      hour:15,
      minute:30,
      message: "get up for work"
    });
    assert(tp.getDay()).should(eql, 0);
    assert(tp.getHour()).should(eql, 15);
    assert(tp.getMinute()).should(eql, 30);
    assert(tp.getMessage()).should(eql, "get up for work");
  });

  it("should return the date of the next instance from now", function(){
     var tp = timepointGenerator({
      day: 3, // Wednesday
      hour: 12, 
      minute:10,
      message:"hi"
    });
    var nextInstance = tp.getNextInstance();
    assert(nextInstance).should(beAn, Object);
    assert(nextInstance.getDate()).should(beA, Date);
   
  });

  it("should return the date of the next instance after a specified date of this weekly timepoint", function(){
    var tp = timepointGenerator({
      day: 3, // Wednesday
      hour: 12, 
      minute:10
    });

    var monday = new Date(2011, JAN, 3);
    assert(monday.getDay()).should(eql, 1);

    var nextInstance = tp.getNextInstanceFrom(monday);
    assert(nextInstance.getDate()).should(beA, Date);
    assert(nextInstance.getDate().getDay()).should(eql, 3);
    assert(nextInstance.getDate().getDate()).should(eql, 5);
    assert(nextInstance.getDate().getHours()).should(eql, 12); 
    assert(nextInstance.getDate().getMinutes()).should(eql, 10); 
    assert(nextInstance.getDate().getSeconds()).should(eql, 0); 
    assert(nextInstance.getDate().getMilliseconds()).should(eql, 0); 
  });

  it("should return a date this week if the specified day hasn't passed", function(){
    var tp = timepointGenerator({
      day: 3, // Wednesday
      hour: 12, 
      minute:10
    });
    var monday = new Date(2011, JAN, 3);
    var nextInstance = tp.getNextInstanceFrom(monday);
    assert(nextInstance.getDate().getDate()).should(eql, 5);
  });

  it("should return a date next week if the specified day has passed", function(){
    var tp = timepointGenerator({
      day: 3, // Wednesday
      hour: 12, 
      minute:10
    });
    var thursday = new Date(2011, JAN, 6);
    var nextInstance = tp.getNextInstanceFrom(thursday);
    assert(nextInstance.getDate().getDate()).should(eql, 12);
  });

  it("should return the start date if the specified time hasn't passed", function(){
    var tp = timepointGenerator({
      day: 3, // Wednesday
      hour: 12, 
      minute:10
    });
    var earlyWednesday = new Date(2011, JAN, 5, 6, 0, 0, 0);
    var nextInstance = tp.getNextInstanceFrom(earlyWednesday);
    assert(nextInstance.getDate().getDate()).should(eql, 5);
  });

  it("should return next week if the specified time has passed", function(){
    var tp = timepointGenerator({
      day: 3, // Wednesday
      hour: 12, 
      minute:10
    });
    var lateWednesday = new Date(2011, JAN, 5, 20, 0, 0, 0);
    var nextInstance = tp.getNextInstanceFrom(lateWednesday);
    assert(nextInstance.getDate().getDate()).should(eql, 12);
  });
});
