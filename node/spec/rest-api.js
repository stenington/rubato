describe("rubato rest api", function(){
  it("should return 404 on unrecognized paths", function(){
    expect(request("GET", "/foo")).toBeStatusCode(404);
  });
});
