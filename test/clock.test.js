
describe("Clock", function(){
  var c;
  var container_i = 1;
  var container; 

  before(function(){
    var containerId = "testArea"+container_i;
    $("body").append('<h3>'+containerId+'</h3>');
    $("body").append('<div id="'+containerId+'"></div>');
    container = $("#"+containerId);
    c = clock({containerId:"#"+containerId});
    container_i += 1;
  });

  it("should be creatable", function(){
    assert(clock()).should(beAn, Object);
  });

  it("should draw in specified element", function(){
    c.draw();
    assert($("#clock"), container).should(beOnThePage);
    assert($("#clock #next"), container).should(beOnThePage);
    assert($("#clock .upcoming"), container).shouldNot(beOnThePage);
  });

  it("should not cross-pollinate drawing areas", function(){
    // TODO: check that this is actually working right
    c.draw();
    assert($("#clock", container).length).should(eql, 1);
    assert($("#clock > #next", container).length).should(eql, 1);
    $("body").append('<div id="crosspoll"></div>');
    d = clock({containerId:"#crosspoll"});
    d.draw();
    assert($("#clock", container).length).should(eql, 1);
    assert($("#clock > #next", container).length).should(eql, 1);
  });

  it("shouldn't double-draw existing clock elements", function(){
    c.draw();
    c.draw();
    assert($("#clock", container).length).should(eql, 1);
    assert($("#next", container).length).should(eql, 1);
  });

  it("should draw infinity until ??? when uninitialized", function(){
    c.draw();
    assert($("#clock #next .time", container).html()).should(eql, "\u221E");
    assert($("#clock #next .until", container).html()).should(eql, "???");
    assert($("#clock #next .type", container).html()).should(eql, "one-time");
  });

  it("should draw next event when there is one", function(){
    c.setEvents([timepoint({
      date: function(){ var d = new Date(); d.setHours(d.getHours()+1); return d; }(),
      message: "hi",
      type: "foo"
    })]);
    c.draw();
    assert($("#clock #next .time", container).html()).should(eql, "1:00");
    assert($("#clock #next .until", container).html()).should(eql, "hi");
    assert($("#clock #next .type", container).html()).should(eql, "foo");
  });

  it("should not double-draw existing event", function(){
    c.setEvents([timepoint({
      date: function(){ var d = new Date(); d.setHours(d.getHours()+1); return d; }(),
      message: "hi",
      type: "foo"
    })]);
    c.draw();
    c.draw();
    assert($("#clock", container).length).should(eql, 1);
    assert($("#clock > #next", container).length).should(eql, 1);
    assert($("#next > .time", container).length).should(eql, 1);
    assert($("#next > .until", container).length).should(eql, 1);
    assert($("#next > .type", container).length).should(eql, 1);
  });

  it("should draw next even chronologically", function(){
    c.setEvents([
      timepoint({
        date: function(){ var d = new Date(); d.setHours(d.getHours()+1); return d; }(),
        message: "second",
        type: "foo"
      }),
      timepoint({
        date: function(){ var d = new Date(); d.setMinutes(d.getMinutes()+1); return d; }(),
        message: "first",
        type: "foo"
      })
    ]);
    c.draw();
    assert($("#clock #next .time", container).html()).should(eql, "0:01");
    assert($("#clock #next .until", container).html()).should(eql, "first");
    assert($("#clock #next .type", container).html()).should(eql, "foo");
  });

  it("should remove expired event and draw next", function(){
    c.setEvents([
      timepoint({
        date: function(){ var d = new Date(); d.setSeconds(d.getSeconds()+1); return d; }(),
        message: "one",
        type: "foo"
      }),
      timepoint({
        date: function(){ var d = new Date(); d.setSeconds(d.getSeconds()+2); return d; }(),
        message: "two",
        type: "foo"
      }),
    ]);
    c.draw();
    assert($("#clock #next .time", container).html()).should(eql, "0:00");
    assert($("#clock #next .until", container).html()).should(eql, "one");
    assert($("#clock #next .type", container).html()).should(eql, "foo");
    stop();
    setTimeout(function(){
      c.draw();
      assert($("#clock #next .time", container).html()).should(eql, "0:00");
      assert($("#clock #next .until", container).html()).should(eql, "two");
      assert($("#clock #next .type", container).html()).should(eql, "foo");
      start();
    }, 1000);
  });

  it("should return to infinity display when all events expire", function(){
    c.setEvents([
      timepoint({
        date: function(){ var d = new Date(); d.setSeconds(d.getSeconds()+1); return d; }(),
        message: "one",
        type: "foo"
      }),
    ]);
    c.draw();
    assert($("#clock #next .time", container).html()).should(eql, "0:00");
    assert($("#clock #next .until", container).html()).should(eql, "one");
    assert($("#clock #next .type", container).html()).should(eql, "foo");
    stop();
    setTimeout(function(){
      c.draw();
      assert($("#clock #next .time", container).html()).should(eql, "\u221E");
      assert($("#clock #next .until", container).html()).should(eql, "???");
      assert($("#clock #next .type", container).html()).should(eql, "one-time");
      start();
    }, 1000);
  
  });
});

