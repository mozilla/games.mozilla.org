const fs = require('fs');
const path = require('path');

const electricity = require('electricity');
const express = require('express');
const internalIp = require('internal-ip');
const yonder = require('yonder');

let app = express();

const IS_DEV = app.get('env') === 'development';

const CACHE_MAX_AGE = IS_DEV ? -1 : 60;
const CACHE_EXPIRES = IS_DEV ? 0 : 60;

const PORT_SERVER = parseInt(process.env.PORT || process.env.PORT || '8080');
const PUBLIC_DIR = path.join(__dirname, '_build');
const ROUTER_PATH = path.join(PUBLIC_DIR, 'ROUTER');

app.initServer = function () {
  // Serve static files (very similar to how Surge and GitHub Pages do).
  // See http://expressjs.com/en/starter/static-files.html for usage.
  let electricityOptions = {
    'hashify': false,
    'headers': {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
    }
  };
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
