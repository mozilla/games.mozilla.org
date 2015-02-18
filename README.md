# Mozilla Games

Local Path | Local URL  | External URL | Description
---------- | ---------- | ------------ | -----------
[`./public/index.html`](https://github.com/mozilla/moz-gdc/blob/master/public/index.html) | http://localhost:3000/ | http://games.mozilla.org/ | TBD (currently a placeholder for Mozilla Games portal)
[`./public/index.html`](https://github.com/mozilla/moz-gdc/blob/master/public/gdc/) | http://localhost:3000/gdc/ | http://games.mozilla.org/gdc/ | Conference mini site for Mozilla's presence at [GDC 2015](http://www.gdconf.com/)


## Installation

1. To install the Node dependencies:

        npm install


## Development

All of the web content is static (see the [https://github.com/mozilla/moz-gdc/tree/master/public](`public/`) directory). Although a real server like Nginx is likely a better candidate for static content, all content here is served from a simple Node server to simplify deployment – and because server is already required for Service Workers and Basic Auth (for staging content not yet ready for public consumption).

To serve the site from the simple server:

    npm run dev

### Advanced

To run the server on a different port, set the `MOZ_GAMES_HOST` and `MOZ_GAMES_PORT` environment variables.

To tempoarily disable Service Worker caching (for ease of testing), run this from your browser console:

    localStorage.disable_sw = '1'

To resume Service Worker caching, run this from your browser console:

    delete localStorage.disable_sw


## Deployment

In production, the server is run continuously via [forever](https://github.com/foreverjs/forever):

    NODE_ENVIRONMENT=production forever start -al forever.log -o logs/out.log -e logs/err.log index.js

Alternatively:

    npm run prod

To run the server à la Heroku:

    foreman start web
