function clock(spec){
  spec = spec || {};
  var containerId = spec.containerId || "body";
  var events;
  var container = $(containerId);

  if( !$("#clock", container).length ){
    container.append('<ol id="clock"></ol>');
    $("#clock", container).append('<li id="next"></li>');
    $("#clock > #next", container).append('<span class="time"></span> until <span class="until"></span><span class="type"></span>');
  }

  var that = {};

  that.draw = function(){
    that.updateEvents();
    if( !events || !events.length ){
      that.drawEmpty();
    }
    else {
      that.drawNext(events[0]);
    }
  };

  that.drawEmpty = function(){
    $("#next > .time", container).html('&#8734;');
    $("#next > .until", container).html('???');
    $("#next > .type", container).html('one-time');
  };

  that.drawNext = function(next){
    var timeLeft = next.getTimeUntil();
    $("#next > .time", container).html(timeLeft.timeDisplay);
    $("#next > .until", container).html(next.getMessage());
    $("#next > .type", container).html(next.getType());
  };

  that.updateEvents = function(){
    for(i in events){
      if(events[i].isExpired()){
        events.shift();
      }
    }
  };

  that.setEvents = function(newEvents){
    events = newEvents;
    events.sort(function(a, b){
      return a.getDate().getTime() - b.getDate().getTime(); 
    });
  };

  return that;
}
