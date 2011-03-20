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

  it("should have a day", function(){
    var tp = timepoint({
      date: new Date(2011, 0, 2),
      message: "hi",
      type: "foo"
    });
    assert(tp.getDay()).should(eql, "Sunday");
    tp = timepoint({
      date: new Date(2011, 0, 3),
      message: "hi",
      type: "foo"
    });
    assert(tp.getDay()).should(eql, "Monday");
    tp = timepoint({
      date: new Date(2011, 0, 4),
      message: "hi",
      type: "foo"
    });
    assert(tp.getDay()).should(eql, "Tuesday");
  });

  it("should report day as 'today' and 'tomorrow'", function(){
    tp = timepoint({
      date: new Date(),
      message: "hi",
      type: "foo"
    });
    assert(tp.getDay()).should(eql, "today");
    tp = timepoint({
      date: (function(){ var d = new Date(); d.setDate(d.getDate()+1); return d;})(),
      message: "hi",
      type: "foo"
    });
    assert(tp.getDay()).should(eql, "tomorrow");
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

  it("should know when it's expired", function(){
    var tp = timepoint({
      date: function(){ var d = new Date(); d.setSeconds(d.getSeconds()-1); return d; }(),
      message: "death"
    });
    assert(tp.isExpired()).should(be);
  });
});

