google.load("gdata", "2"); 
google.setOnLoadCallback(function(){

describe("Google Helper", function(){

  it("should be creatable", function(){
    assert(googlehelper({})).should(beAn, Object);
    var helper = googlehelper({
      feed: "",
      start: new Date(),
      end: new Date()
    });
    assert(helper).should(beAn, Object);
  });

  it("should default to one-week time span", function(){
    var helper = googlehelper({});
    var now = new Date();
    var oneWeek = new Date();
    oneWeek.setDate(oneWeek.getDate() + 7);
    assert(Math.abs(helper.start.getTime() - now.getTime())).should(beLessThan, 60000); // minute tolerance
    assert(Math.abs(helper.end.getTime() - oneWeek.getTime())).should(beLessThan, 60000); // minute tolerance
  });

  it("should optionally take a range generator", function(){
    var now = new Date();
    var oneWeek = new Date();
    oneWeek.setDate(oneWeek.getDate() + 7);
    var helper = googlehelper({
      queryRange:function(){ 
        return { start: now, end: oneWeek };
      }
    });
    var query;
    helper.getQueryObject = function(feed){
      query = {
        setSingleEvents : function(){},
        setMinimumStartTime : function(time){
          this.minStart = time;
        },
        setMaximumStartTime : function(time){
          this.maxStart = time;
        },
        setRecurrenceExpansionStart : function(){},
        setRecurrenceExpansionEnd : function(){}
      };
      return query;
    };
    helper.getServiceObject = function(name){
      return {
        getEventsFeed : function(){}
      };
    };
    helper.fetch();
    assert(query.minStart.date).should(eql, now);
    assert(query.maxStart.date).should(eql, oneWeek);
  });

  asyncIt("should call range generator on each fetch", function(){
    var helper = googlehelper({
      queryRange:function(){ 
        return { start: new Date(), end: new Date() };
      }
    });
    var query;
    helper.getQueryObject = function(feed){
      query = {
        setSingleEvents : function(){},
        setMinimumStartTime : function(time){
          this.minStart = time;
        },
        setMaximumStartTime : function(time){
          this.maxStart = time;
        },
        setRecurrenceExpansionStart : function(){},
        setRecurrenceExpansionEnd : function(){}
      };
      return query;
    };
    helper.getServiceObject = function(name){
      return {
        getEventsFeed : function(){}
      };
    };
    helper.fetch();
    var min = query.minStart.date;
    var max = query.maxStart.date;
    setTimeout(function(){
      helper.fetch();
      assert(min).should(beLessThan, query.minStart.date);
      assert(max).should(beLessThan, query.maxStart.date);
      start();
    }, 1);
  });

  asyncIt("should fetch from a Google Calendar feed", function(){
    var helper = googlehelper({
      feed: "https://www.google.com/calendar/feeds/bmojkrmcasv362rvqili27u2k8@group.calendar.google.com/public/full",
      start: new Date(2011, 0, 2),
      end: new Date(2011, 0, 8),
      onFetch: function( entries ) {
        ok(true, "fetched");
        assert(entries.length).should(beGreaterThan, 0);
        start();
      },
      onFail: function( error ) {
        ok(false, "failed fetch");
        start();
      }
    });
    helper.fetch();
  });

  asyncIt("should have continuation mechanism from fetches", function(){
    var fetchHit = false;
    var contHit = false;
    var helper = googlehelper({
      feed: "https://www.google.com/calendar/feeds/bmojkrmcasv362rvqili27u2k8@group.calendar.google.com/public/full",
      start: new Date(2011, 0, 2),
      end: new Date(2011, 0, 8),
      onFetch: function( entries ) {
        fetchHit = true;
        assert(contHit).shouldNot(be);
        return entries.length;
      },
      onFail: function( error ) {
        ok(false, "failed fetch");
        start();
      }
    });
    helper.fetchAndThen(function(onFetchReturnValue){
      contHit = true;
      assert(fetchHit).should(be);
      assert(onFetchReturnValue).should(eql, 7);
      start();
    });
  });

});

});
