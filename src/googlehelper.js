function googlehelper(spec) {
  var feed, start, end;
  feed = spec.feed;
  start = spec.start || new Date();
  end = spec.end || new Date(start.getFullYear(), start.getMonth(), start.getDate()+7);
  start = new google.gdata.DateTime(start);
  end = new google.gdata.DateTime(end);

  var query, service;

  var that = {};

  that.onFetch = spec.onFetch || function(){};
  that.onFail = spec.onFail || function(){};

  that.fetch = function() {
    that.fetchAndThen();
  };

  that.fetchAndThen = function(continuation) {
    if(query === undefined){
      query = new google.gdata.calendar.CalendarEventQuery(feed);
      query.setSingleEvents(true);
    }
    if(service === undefined){
      service = new google.gdata.calendar.CalendarService('this-doesnt-seem-to-matter');
    }
    query.setMinimumStartTime(start);
    query.setMaximumStartTime(end);
    query.setRecurrenceExpansionStart(start);
    query.setRecurrenceExpansionEnd(end);

    service.getEventsFeed(
      query, 
      function(result){
        var r = that.onFetch(result.feed.entry);
        if( r !== undefined && continuation !== undefined ){
          continuation(r);
        }
      },
      that.onFail
    );
  };

  return that;
}
