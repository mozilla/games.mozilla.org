var http = require('http');

var basicAuth = require('basic-auth');
var nodeStatic = require('node-static');


var internals = {
  node_env: process.env.NODE_ENVIRONMENT || 'development',
  host: process.env.MOZ_GAMES_HOST || process.env.HOST || '0.0.0.0',
  port: process.env.MOZ_GAMES_PORT || process.env.PORT || 3000,
  fileServer: new nodeStatic.Server('./public'),
  cacheExpiryDates: {
    fonts: 31536000  // 1 year
  }
};

var server = http.createServer(function (req, res) {
  var credentials = basicAuth(req);
  var authChunks = (process.env.AUTH_GDC || ':').split(':');
  var authValid = (credentials &&
                   credentials.name === authChunks[0] &&
                   credentials.pass === authChunks[1]);

  // Protect only the `/gdc/` directory.
  function ipInRange(ip) {
    var blocks = (ip || '').split('.').map(function (num) {
      return parseInt(num, 10);
    });
    return (blocks[0] === 63 &&
            blocks[1] === 245 &&
            blocks[2] >= 208 && blocks[2] <= 223 &&
            blocks[3] >=0 && blocks[3] <= 255);
  }

  if (req.url === '/ip') {
    res.writeHead(200, {'content-type': 'application/json'});
    return res.end(JSON.stringify({
      'req.connection.remoteAddress': req.connection.remoteAddress,
      'req.connection.socket.remoteAddress': req.connection.socket && req.connection.socket.remoteAddress,
      'req.socket.remoteAddress': req.socket && req.socket.remoteAddress,
      'x-forwarded-for': req.headers['x-forwarded-for']
    }));
  }

  if (!ipInRange(req.headers['x-forwarded-for']) &&
      process.env.AUTH_GDC && req.url.indexOf('/gdc/') === 0 && !authValid) {

    return internals.fileServer.serveFile('/401.html', 401,
      {'WWW-Authenticate': 'Basic realm="mozgames"'}, req, res);
  }

  var urlBase = req.url.split('?')[0] || '';
  var urlExtension = urlBase.substr(urlBase.lastIndexOf('.'));
  if (['.woff', '.ttf', '.eot'].indexOf(urlExtension) !== -1) {
    var now = new Date();
    now.setSeconds(now.getSeconds() + internals.cacheExpiryDates.fonts);
    res.setHeader('Expires', now.toUTCString());
  }

  req.addListener('end', function () {
    internals.fileServer.serve(req, res, function (err) {
      if (!err) {
        console.log('[%s] [200] %s', req.method, req.url);
        return;
      }

      console.warn('[%s] [%s] %s', req.method, err.status, req.url);

      if (err.status === 404) {
        internals.fileServer.serveFile('/404.html', 404, {}, req, res);
      }
    });
  }).resume();
});


server.listen(internals.port, internals.host, function () {
  console.log('[%s] Server listening on http://%s:%s',
    internals.node_env, internals.host, internals.port);
});


module.exports = server;
