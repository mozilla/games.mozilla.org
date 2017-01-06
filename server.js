var fs = require('fs');
var path = require('path');
var urllib = require('url');

var electricity = require('electricity');
var express = require('express');
var internalIp = require('internal-ip');
var tinylr = require('tiny-lr');
var yonder = require('yonder');

var app = express();

var IS_DEV = app.get('env') === 'development';

var CACHE_MAX_AGE = IS_DEV ? -1 : 60;
var CACHE_EXPIRES = IS_DEV ? 0 : 60;

var PORT_SERVER = process.env.PORT || process.env.PORT || 3000;
var PORT_LR = process.env.LR_PORT || process.env.PORT || 35729;
var PUBLIC_DIR = path.join(__dirname, '_build');
var ROUTER_PATH = path.join(PUBLIC_DIR, 'ROUTER');

// Live-reloading (for local development).
// See https://github.com/mklabs/tiny-lr for usage.
if (IS_DEV) {
  app.use(tinylr.middleware({app: app, dashboard: true}));
}

app.initServer = function () {
  // Serve static files (very similar to how Surge and GitHub Pages do).
  // See http://expressjs.com/en/starter/static-files.html for usage.
  var electricityOptions = {
    'hashify': false,
    'headers': {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
    }
  };
  if (IS_DEV) {
    electricityOptions.livereload = {
      'enabled': true,
      'listener': tinylr
    };
  }
  if (CACHE_MAX_AGE) {
    electricityOptions.headers['Cache-Control'] = 'max-age=' + CACHE_MAX_AGE;
  }
  if (CACHE_EXPIRES) {
    electricityOptions.headers['Expires'] = CACHE_EXPIRES;
  }

  var serveStatic = electricity.static(PUBLIC_DIR, electricityOptions);
  app.use(serveStatic);

  // Create server-side redirects (defined in the `ROUTER` file).
  // See https://github.com/sintaxi/yonder#readme for usage.
  if (fs.existsSync(ROUTER_PATH)) {
    app.use(yonder.middleware(ROUTER_PATH));
  }

  app.use(function (req, res, next) {
    res.status(404);

    if (req.accepts('html')) {
      res.sendFile('404.html', {root: PUBLIC_DIR});
      return;
    }

    res.type('txt').send('Not found');
  });

  if (!module.parent) {
    let listener = app.listen(PORT_SERVER, function () {
      console.log('Listening on port http://%s:%s', internalIp.v4(), listener.address().port);
    });
  }

  return app;
};

app.initServer();

module.exports = app;
