function clock(containerId){
  var container = $(containerId);
  var that = {};

  that.draw = function(){
    container.append('<ol id="clock"></ol>');
    $("#clock").append('<li id="next">&#8734;</li>');
  };

  return that;
}
