function googlehelper(spec) {
  var feed, start, end;
  feed = spec.feed;
  start = spec.start || new Date();
  end = spec.end || function(){ var d = new Date(); d.setDate(d.getDate() + 7); return d; }();

  var query, service;

  var that = {};

  that.start = start;
  that.end = end;
  that.onFetch = spec.onFetch || function(){};
  that.onFail = spec.onFail || function(){};

  that.fetch = function() {
    that.fetchAndThen();
  };

  that.getQueryObject = function(feed){ 
    if(query === undefined){
      query = new google.gdata.calendar.CalendarEventQuery(feed); 
      query.setSingleEvents(true);
    }
    return query;
  };

  that.getServiceObject = function(name){ 
    if(service === undefined){
      service = new google.gdata.calendar.CalendarService(name); 
    }
    return service;
  }

  that.getQueryRange = spec.queryRange || function(){ return {start: start, end: end}; };

  that.fetchAndThen = function(continuation) {
    var query = that.getQueryObject(feed);
    var queryRange = that.getQueryRange();
    var g_start = new google.gdata.DateTime(queryRange.start);
    var g_end = new google.gdata.DateTime(queryRange.end);
    query.setMinimumStartTime(g_start);
    query.setMaximumStartTime(g_end);
    query.setRecurrenceExpansionStart(g_start);
    query.setRecurrenceExpansionEnd(g_end);

    var service = that.getServiceObject('stenington-rubato-v1');
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
