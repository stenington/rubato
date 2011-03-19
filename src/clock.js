function clock(spec){
  spec = spec || {};
  var containerId = spec.containerId || "body";
  var events;
  var container = $(containerId);

  if( !$("#clock", container).length ){
    container.append('<ol id="clock"></ol>');
    $("#clock", container).append('<li id="next"></li>');
    $("#clock > #next", container).append('<span class="time"></span> until <span class="until"></span><span class="type"></span>');
    $("#clock", container).after('<p id="footer"></p>');
    $("#footer", container).html('<span id="expand">+</span>');
    $("#expand", container).hide();
    $("#expand", container).click(function () {
      var display = $(".upcoming:last", container).css("display") === 'none' ? 'hidden' : 'visible';
      var toggleFirst = function(){
        $(".upcoming:"+display+":first", container).slideToggle(350/$(".upcoming", container).length, "linear", toggleFirst);
      };
      toggleFirst();
    });
  }

  var that = {};

  that.draw = function(){
    that.updateEvents();
    if( !events || !events.length ){
      that.drawEmpty();
    }
    else if( events.length == 1) {
      that.drawNext(events[0]);
    } else {
      that.drawNext(events[0]);
      that.drawRest(events);
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

  that.drawRest = function(events){
    var currentStripe = 'zebra-white';
    var currentDisplay = $(".upcoming:first", container).css('display');
    while($("#clock > .upcoming:first", container).length){
      $("#clock > .upcoming:first", container).remove();
    };
    for(var i=1; i<events.length; i++){
      var prev = events[i-1];
      var next = events[i];
      if( next.getDate().getDay() != prev.getDate().getDay() ){
        currentStripe = currentStripe == 'zebra-white' ? 'zebra-black' : 'zebra-white';
      }
      var timeLeft = next.getTimeRemainingFrom(prev.getDate());
      $("#clock", container).append('<li class="upcoming"></li>');  
      var upcoming = $("#clock > .upcoming:last");
      upcoming.html('then <span class="time"></span> until <span class="until"></span><span class="type"></span>');
      $(".time", upcoming).html(timeLeft.timeDisplay);
      $(".until", upcoming).html(next.getMessage());
      $(".type", upcoming).html(next.getType());
      upcoming.css('display', currentDisplay);
      upcoming.addClass(currentStripe);
    }
    $("#footer > #expand", container).show();
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
