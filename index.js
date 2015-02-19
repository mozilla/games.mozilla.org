var http = require('http');

var basicAuth = require('basic-auth');
var nodeStatic = require('node-static');


var internals = {
  node_env: process.env.NODE_ENVIRONMENT || 'development',
  host: process.env.MOZ_GAMES_HOST || process.env.HOST || '0.0.0.0',
  port: process.env.MOZ_GAMES_PORT || process.env.PORT || 3000,
  fileServer: new nodeStatic.Server('./public')
};

var server = http.createServer(function (req, res) {
  var credentials = basicAuth(req);
  var authChunks = (process.env.AUTH_GDC || ':').split(':');
  var authValid = (credentials &&
                   credentials.name === authChunks[0] &&
                   credentials.pass === authChunks[1]);

  // Protect only the `/gdc/` directory.
  if (process.env.AUTH_GDC && req.url.indexOf('/gdc/') === 0 && !authValid) {
    return internals.fileServer.serveFile('/401.html', 401,
      {'WWW-Authenticate': 'Basic realm="mozgames"'}, req, res);
  }

  req.addListener('end', function () {
    internals.fileServer.serve(req, res);
  }).resume();
});


server.listen(internals.port, internals.host, function () {
  console.log('[%s] Server listening on http://%s:%s',
    internals.node_env, internals.host, internals.port);
});


module.exports = server;
