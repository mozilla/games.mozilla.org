var http = require('http');

var nodeStatic = require('node-static');


var internals = {
  node_env: process.env.NODE_ENVIRONMENT || 'development',
  host: process.env.MOZ_GAMES_HOST || process.env.HOST || '0.0.0.0',
  port: process.env.MOZ_GAMES_PORT || process.env.PORT || 3000,
  nodeStaticOptions: {gzip: false, cache: false},
  cacheExpiryDates: {
    fonts: 31536000  // 1 year
  }
};


if (internals.node_env === 'production') {
  internals.nodeStaticOptions = {gzip: true, cache: 60};
}

internals.fileServer = new nodeStatic.Server('./public', internals.nodeStaticOptions);


var server = http.createServer(function (req, res) {
  var urlBase = req.url.split('?')[0] || '';
  var urlExtension = urlBase.substr(urlBase.lastIndexOf('.'));
  if (['.woff', '.ttf', '.eot'].indexOf(urlExtension) !== -1) {
    var now = new Date();
    now.setSeconds(now.getSeconds() + internals.cacheExpiryDates.fonts);
    res.setHeader('Expires', now.toUTCString());
  }

  if (req.url.split('?')[0] === '/') {
    res.writeHead(302, {'Location': '/gdc' + req.url});
    return res.end();
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
