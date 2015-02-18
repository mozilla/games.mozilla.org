var http = require('http');

var nodeStatic = require('node-static');


var internals = {
  node_env: process.env.NODE_ENVIRONMENT || 'development',
  host: process.env.MOZ_GAMES_HOST || process.env.HOST || '0.0.0.0',
  port: process.env.MOZ_GAMES_PORT || process.env.PORT || 3000
};


var fileServer = new nodeStatic.Server('./public');

var server = http.createServer(function (req, res) {
  req.addListener('end', function () {
    fileServer.serve(req, res);
  }).resume();
}).listen(internals.port);

server.listen(internals.port, internals.host, function () {
  console.log('[%s] Server listening on http://%s:%s',
    internals.node_env, internals.host, internals.port);
});


module.exports = server;
