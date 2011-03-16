
describe("Clock", function(){
  after(function(){
    $("#testArea").empty();
  });

  it("should be creatable", function(){
    assert(clock()).should(beAn, Object);
  });

  it("should draw in specified element", function(){
    var c = clock("#testArea");
    c.draw();
    assert($("#clock")).should(beOnThePage);
    assert($("#clock #next")).should(beOnThePage);
    assert($("#clock .upcoming")).shouldNot(beOnThePage);
  });

  it("should draw infinity when uninitialized", function(){
    var c = clock("#testArea");
    c.draw();
    assert($("#clock #next").html()).should(eql, "\u221E");
  });
});

