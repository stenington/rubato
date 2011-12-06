
describe("Clock", function(){

  /* TestClock sets up a container, clock and face for use in testing. 
     Each gets appended to the page. 
   */
  var TestClock = (function(){
    var container_i = 1;

    return function(titleText){
      var containerId = "testClock"+container_i;
      titleText = titleText || containerId;
      var title = $('<h3>'+titleText+'</h3>').appendTo("body");
      $("body").append('<div id="'+containerId+'"></div>');
      var container = $("#"+containerId);
      container.append('<ol id="face"></ol>');
      $("#face", container).append('<li id="next"><span class="time"></span> until <span class="until"></span> <span class="day"></span><span class="type"></span></li>');
      container.append('<a id="expand">More</a>');
      var c = clock({rootId:"#"+containerId});
      container_i += 1;
      
      return {
        "clock": c,
        "container": container,
        "face": $("#face", container),
        "title": function(newTitle){
          title.html(newTitle);
        }
      };
    };
  })();

  var t;

  before(function(){
    t = TestClock();
  });

  it("should be creatable", function(){
    assert(t.clock).should(beAn, Object);
  });

  it("should draw in specified element", function(){
    t.clock.setEntries([
      timepoint({
        date: function(){ var d = new Date(); d.setHours(d.getHours()+1); return d; }(),
        message: "my msg",
        type: "foo"
      })
    ]);
    t.clock.draw();
    assert($(t.face)).should(beOnThePage);
    assert($("#next", t.face)).should(beOnThePage);
    assert($("#next .until", t.face).html()).should(match, /^my msg$/);
    assert($("#face .upcoming", t.face)).shouldNot(beOnThePage);
  });

  it("should not cross-pollinate drawing areas", function(){
    t.title("cross-pollinate 1");
    var t2 = TestClock("cross-pollinate 2");
    t.clock.setEntries([
      timepoint({
        date: function(){ var d = new Date(); d.setHours(d.getHours()+1); return d; }(),
        message: "no cross-pollination",
        type: "foo"
      })
    ]);
    t.clock.draw();
    assert($("#next .until", t.face).html()).should(match, /^no cross-pollination$/);
    assert($("#next .until", t2.face).html()).shouldNot(match, /^no cross-pollination$/);
  });

  it("shouldn't double-draw existing clock elements", function(){
    t.clock.setEntries([
      timepoint({
        date: function(){ var d = new Date(); d.setHours(d.getHours()+1); return d; }(),
        message: "one",
        type: "foo"
      }),
      timepoint({
        date: function(){ var d = new Date(); d.setHours(d.getHours()+5); return d; }(),
        message: "two",
        type: "foo"
      }),
      timepoint({
        date: function(){ var d = new Date(); d.setHours(d.getHours()+8); return d; }(),
        message: "three",
        type: "foo"
      }),
    ]);
    t.clock.draw();
    t.clock.draw();
    assert(t.face.length).should(eql, 1);
    assert($("#next", t.face).length).should(eql, 1);
    assert($(".upcoming", t.face).length).should(eql, 2);
  });

  it("should draw infinity until ??? when uninitialized", function(){
    t.clock.draw();
    assert($("#next .time", t.face).html()).should(eql, "\u221E");
    assert($("#next .until", t.face).html()).should(eql, "???");
    assert($("#next .type", t.face).html()).should(eql, "one-time");
  });

  it("should draw next entry when there is one", function(){
    t.clock.setEntries([timepoint({
      date: function(){ var d = new Date(); d.setHours(d.getHours()+1); return d; }(),
      message: "hi",
      type: "foo"
    })]);
    t.clock.draw();
    assert($("#next .time", t.face).html()).should(eql, "1:00");
    assert($("#next .until", t.face).html()).should(eql, "hi");
    assert($("#next .type", t.face).html()).should(eql, "foo");
    assert($("#next .day", t.face).html()).should(match, /today|tomorrow/);
  });

  it("should not double-draw existing entry", function(){
    /* TODO: delete if this is a duplicate test */
    t.clock.setEntries([timepoint({
      date: function(){ var d = new Date(); d.setHours(d.getHours()+1); return d; }(),
      message: "hi",
      type: "foo"
    })]);
    t.clock.draw();
    t.clock.draw();
    assert(t.face.length).should(eql, 1);
    assert($("> #next", t.face).length).should(eql, 1);
    assert($("#next > .time", t.face).length).should(eql, 1);
    assert($("#next > .until", t.face).length).should(eql, 1);
    assert($("#next > .type", t.face).length).should(eql, 1);
  });

  it("should draw next even chronologically", function(){
    t.clock.setEntries([
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
    t.clock.draw();
    assert($("#next .time", t.face).html()).should(eql, "0:01");
    assert($("#next .until", t.face).html()).should(eql, "first");
    assert($("#next .type", t.face).html()).should(eql, "foo");
  });

  it("should remove expired entry and draw next", function(){
    t.clock.setEntries([
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
    t.clock.draw();
    assert($("#next .time", t.face).html()).should(eql, "0:00");
    assert($("#next .until", t.face).html()).should(eql, "one");
    assert($("#next .type", t.face).html()).should(eql, "foo");
    stop();
    setTimeout(function(){
      t.clock.draw();
      assert($("#next .time", t.face).html()).should(eql, "0:00");
      assert($("#next .until", t.face).html()).should(eql, "two");
      assert($("#next .type", t.face).html()).should(eql, "foo");
      start();
    }, 1000);
  });

  it("should return to infinity display when all entries expire", function(){
    t.clock.setEntries([
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
    t.clock.draw();
    assert($("#next .time", t.face).html()).should(eql, "0:00");
    assert($("#next .until", t.face).html()).should(eql, "one");
    assert($("#next .type", t.face).html()).should(eql, "foo");
    assert($(".upcoming .time", t.face).html()).should(eql, "0:00");
    assert($(".upcoming .until", t.face).html()).should(eql, "two");
    assert($(".upcoming .type", t.face).html()).should(eql, "foo");
    stop();
    setTimeout(function(){
      t.clock.draw();
      assert($("#next .time", t.face).html()).should(eql, "\u221E");
      assert($("#next .until", t.face).html()).should(eql, "???");
      assert($("#next .type", t.face).html()).should(eql, "one-time");
      assert($(".upcoming", t.face).length).should(eql, 0);
      start();
    }, 2100);
  });

  it("should display list of additional upcoming entries", function(){
    t.clock.setEntries([
      timepoint({
        date: function(){ var d = new Date(); d.setSeconds(d.getSeconds()+1); return d; }(),
        message: "one",
        type: "foo"
      }),
      timepoint({
        date: function(){ var d = new Date(); d.setHours(d.getHours()+2); return d; }(),
        message: "two",
        type: "foo"
      }),
    ]);
    t.clock.draw();
    assert($("> .upcoming", t.face)).should(beOnThePage);
    assert($("> .upcoming:first > .time", t.face).html()).should(eql, "1:59");
    assert($("> .upcoming:first > .until", t.face).html()).should(eql, "two");
    assert($("> .upcoming:first > .type", t.face).html()).should(eql, "foo");
    assert($("> .upcoming:first > .day", t.face).html()).should(match, /today|tomorrow/);
  });

  it("upcoming entries should be in order", function(){
    t.clock.setEntries([
      timepoint({
        date: function(){ var d = new Date(); d.setSeconds(d.getSeconds()+1); return d; }(),
        message: "one",
        type: "foo"
      }),
      timepoint({
        date: function(){ var d = new Date(); d.setHours(d.getHours()+5); return d; }(),
        message: "three",
        type: "foo"
      }),
      timepoint({
        date: function(){ var d = new Date(); d.setHours(d.getHours()+2); return d; }(),
        message: "two",
        type: "foo"
      }),
    ]);
    t.clock.draw();
    assert($("> .upcoming:first", t.face)).should(beOnThePage);
    assert($("> .upcoming:first > .time", t.face).html()).should(eql, "1:59");
    assert($("> .upcoming:first > .until", t.face).html()).should(eql, "two");
    assert($("> .upcoming:first > .type", t.face).html()).should(eql, "foo");
    assert($("> .upcoming:last", t.face)).should(beOnThePage);
    assert($("> .upcoming:last > .time", t.face).html()).should(eql, "3:00");
    assert($("> .upcoming:last > .until", t.face).html()).should(eql, "three");
    assert($("> .upcoming:last > .type", t.face).html()).should(eql, "foo");
  });

  it("upcoming entries should display time until starting from the previous entry (not from now)", function(){
    t.clock.setEntries([
      timepoint({
        date: function(){ var d = new Date(); d.setHours(d.getHours()+1); return d; }(),
        message: "one",
        type: "foo"
      }),
      timepoint({
        date: function(){ var d = new Date(); d.setHours(d.getHours()+5); return d; }(),
        message: "two",
        type: "foo"
      }),
    ]);
    t.clock.draw();
    assert($("> .upcoming", t.face)).should(beOnThePage);
    assert($("> .upcoming:first > .time", t.face).html()).should(eql, "4:00");
    assert($("> .upcoming:first > .until", t.face).html()).should(eql, "two");
    assert($("> .upcoming:first > .type", t.face).html()).should(eql, "foo");
  });

  it("should zebra-stripe upcoming entries by day", function(){
    t.clock.setEntries([
      timepoint({
        date: function(){ var d = new Date(); d.setSeconds(d.getSeconds()+5); return d; }(),
        message: "next",
        type: "foo"
      }),
      timepoint({
        date: function(){ var d = new Date(); d.setSeconds(d.getSeconds()+10); return d; }(),
        message: "today",
        type: "foo"
      }),
      timepoint({
        date: function(){ var d = new Date(); d.setDate(d.getDate()+1); return d; }(),
        message: "tomorrow",
        type: "foo"
      }),
      timepoint({
        date: function(){ var d = new Date(); d.setDate(d.getDate()+1); return d; }(),
        message: "tomorrow",
        type: "foo"
      }),
      timepoint({
        date: function(){ var d = new Date(); d.setDate(d.getDate()+2); return d; }(),
        message: "day after tomorrow",
        type: "foo"
      }),
      timepoint({
        date: function(){ var d = new Date(); d.setDate(d.getDate()+2); return d; }(),
        message: "day after tomorrow",
        type: "foo"
      }),
    ]);
    t.clock.draw();
    var upcomings = $(".upcoming", t.face).toArray();
    assert($(upcomings[0]).hasClass('zebra-white')).should(be);
    assert($(upcomings[1]).hasClass('zebra-black')).should(be);
    assert($(upcomings[2]).hasClass('zebra-black')).should(be);
    assert($(upcomings[3]).hasClass('zebra-white')).should(be);
    assert($(upcomings[4]).hasClass('zebra-white')).should(be);
  });
});

