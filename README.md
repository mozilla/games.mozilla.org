# Mozilla GDC 2015

A conference mini site for Mozilla's presence at [GDC 2015](http://www.gdconf.com/).


## Development

As all of the files are static, a server is not required to work on this site locally (except when working with Service Workers).

To serve the site from a simple server:

    python -m SimpleHTTPServer

To tempoarily disable Service Worker caching (for ease of testing), run this from your browser console:

    localStorage.disable_sw = '1'

To resume Service Worker caching, run this from your browser console:

    delete localStorage.disable_sw
