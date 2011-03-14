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
      assert(onFetchReturnValue).should(eql, 5);
      start();
    });
  });

});

});
