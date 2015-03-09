# Mozilla Games

Local Path | Local URL  | External URL | Description
---------- | ---------- | ------------ | -----------
[`./public/index.html`](https://github.com/mozilla/moz-gdc/blob/master/public/index.html) | [http://localhost:3000/](http://localhost:3000/) | https://games.mozilla.org/ | Redirects to `/gdc/` for now
[`./public/index.html`](https://github.com/mozilla/moz-gdc/blob/master/public/gdc/) | [http://localhost:3000/gdc/](http://localhost:3000/gdc/) | https://games.mozilla.org/gdc/ | Conference mini site for Mozilla's presence at [GDC 2015](http://www.gdconf.com/)


## Installation

To install the Node dependencies:

    npm install


## Development

All of the web content is static (see the [https://github.com/mozilla/moz-gdc/tree/master/public](`public/`) directory). Although a real server like Nginx is likely a better candidate for static content, all content here is served from a simple Node server to simplify deployment – and because server is already required for Service Workers and Basic Auth (for staging content not yet ready for public consumption).

To serve the site from the simple server:

    npm run dev

Then launch the site from your favourite browser:

[__http://localhost:3000/__](http://localhost:3000/)

If you wish to serve the site from a different port:

    MOZ_GDC_PORT=8000 npm run dev

### Advanced

To run the server on a different port, set the `MOZ_GAMES_HOST` and `MOZ_GAMES_PORT` environment variables.

To temporarily disable Service Worker caching (for ease of testing), run this from your browser console:

    localStorage.disable_sw = '1'

To resume Service Worker caching, run this from your browser console:

    delete localStorage.disable_sw


## Deployment

In production, the server is run like so:

    NODE_ENVIRONMENT=production node index.js

Alternatively:

    npm run prod

To run the server à la Heroku:

    foreman start web
