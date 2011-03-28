exports.RequestHandler = function RequestHandler() {
  return function handler(req, res) {
    res.writeHead('404 Not Found', {'Content-Type': 'text/plain'});
    res.end('NO U\n');
  };
};
