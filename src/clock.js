function clock(spec){
  const INFINITY = "\u221E";

  spec = spec || {};
  var rootId = spec.rootId || "body";

  /* Certain elements are expected to exist inside the root element:
      #face       - holds the next and upcoming entries
        #next     - holds the details for the next entry, chronologically;
                    acts as a template for the other upcoming entries
          .time   - hours remaining
          .until  - entry title
          .day    - entry day
          .type   - entry type (one-time vs. repeated)
  */
  var faceId = "#face";
  var nextEntryId = "#next";

  var entries;
  var root = $(rootId);
  var face = $(faceId, root);
  var nextEntry = $(nextEntryId, root);

  var upcomingTemplate = nextEntry.clone(false);
  upcomingTemplate.removeAttr('id');
  upcomingTemplate.addClass('upcoming');
  
  if( !face.length ){
    throw 'No clock face found with [' + faceId + ']';
  }
  if( !nextEntry.length ){
    throw 'No next entry found with [' + nextEntryId + ']';
  }
  var classNames = ['.time', '.until', '.day', '.type'];
  for( var i in classNames ){
    if( !$(classNames[i], nextEntry).length ){
      throw 'No next entry slot found with [' + classNames[i] + ']';
    }
  }

  var that = {};

  that.draw = function(){
    that.updateEntries();
    $(".upcoming", root).remove();
    if( !entries || !entries.length ){
      that.drawEmpty(nextEntry);
    }
    else if( entries.length == 1) {
      that.drawNext(nextEntry, entries[0]);
    } else {
      that.drawNext(nextEntry, entries[0]);
      that.drawRest(upcomingTemplate, face, entries);
    }
  };
  
  that.drawEntry = function(container, time, entry){
    $("> .time", container).html(time);
    $("> .until", container).html(entry.getMessage());
    $("> .type", container).html(entry.getType());
    $("> .day", container).html(entry.getDay());
    document.title = "Rubato: " + time;
  };

  that.drawEmpty = function(container){
    var empty = {
      'getMessage': function(){ return '???' },
      'getType': function(){ return 'one-time' },
      'getDay': function(){ return '' }
    };
    that.drawEntry(container, INFINITY, empty);
  };

  that.drawNext = function(container, entry){
    var timeLeft = entry.getTimeUntil();
    that.drawEntry(container, timeLeft.timeDisplay, entry);
  };

  that.drawRest = function(elTemplate, face, entries){
    var currentStripe = 'zebra-white';
    for(var i=1; i<entries.length; i++){
      var prev = entries[i-1];
      var next = entries[i];
      if( next.getDate().getDay() != prev.getDate().getDay() ){
        currentStripe = currentStripe == 'zebra-white' ? 'zebra-black' : 'zebra-white';
      }
      var timeLeft = next.getTimeRemainingFrom(prev.getDate());
      var upcoming = elTemplate.clone(false).appendTo(face);
      upcoming.addClass(currentStripe);
      that.drawEntry(upcoming, timeLeft.timeDisplay, next);
    }
  };

  that.updateEntries = function(){
    while(entries && entries.length && entries[0].isExpired()){
      entries.shift();
    }
  };

  that.setEntries = function(newEntries){
    entries = newEntries;
    entries.sort(function(a, b){
      return a.getDate().getTime() - b.getDate().getTime(); 
    });
  };

  return that;
}
