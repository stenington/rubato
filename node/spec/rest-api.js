var HOST = "localhost";
var PORT = "8097";

var http = require('http');
var rubato = require('rubato');

function Server(delegate) {
  var self = {};

  var server = http.createServer(function(req, res) {
    delegate(req, res);
  });

  self.setDelegate = function(aDelegate) {
    delegate = aDelegate;
  };
  
  server.listen(PORT, HOST); /* this is slow, we only want to do it once for the test run */

  return self;
}

function request(method, path, responseCallback){
  asyncSpecWait();
  var options = {
    host: HOST,
    port: PORT,
    method: method,
    path: path
  };
  var req = http.request(options, function(res) {
    var chunks = [];
    res.setEncoding('utf8');
    res.on('data', function(chunk) {
      chunks.push(chunk);
    });
    res.on('end', function() {
      responseCallback(res, chunks.join());
      asyncSpecDone();
    });
  });
  req.end();
}

var runnerWideServer = Server();

describe("rubato rest api", function(){
  beforeEach(function() {
    runnerWideServer.setDelegate(rubato.RequestHandler());
  });

  afterEach(function() {
    runnerWideServer.setDelegate(null);
  });

  it("should return 404 on unrecognized paths", function(){
    request("GET", "/foo", function(response){
      expect(response.statusCode).toEqual(404);
    });
  });

  it("should say 'NO U' on unrecognized paths", function(){
    request("GET", "/foo", function(response, message){
      expect(message).toEqual("NO U\n");
    });
  });
});
