importScripts('js/serviceworker-cache-polyfill.js');


var CACHE_NAME = 'moz-gdc';
var CACHE_VERSION = 5;
var CACHE_KEY = CACHE_NAME + '-v' + CACHE_VERSION;


self.onactivate = function (event) {
  caches.keys().then(function (cacheNames) {
    return Promise.all(
      cacheNames.map(function (cacheName) {
        if (cacheName.indexOf(CACHE_NAME) === -1) {
          return;
        }

        // If this cache name isn't the expected cache name, delete it.
        if (cacheName !== CACHE_KEY) {
          console.log('Deleting out of cache:', cacheName);
          return caches.delete(cacheName);
        }
      })
    );
  });
};


self.onfetch = function (event) {
  var request = event.request;

  event.respondWith(

    // Check the cache for a hit.
    caches.match(request).then(function (response) {

      if (response) {
        // If there is an entry in the cache for `event.request`, then response
        // will be defined and we can just return it. Notice we are caching
        // *all* resources here.
        console.log('  Found response in cache:', response);
        return response;
      }

      // Otherwise, if there is no entry in the cache for `event.request`,
      // response will be `undefined`, and we need to `fetch()` the resource.
      console.log('  No response for %s found in cache. Fetching from network:',
                  event.request.url);

      // We call .clone() on the request since we might use it in a call to
      // `cache.put()` later on. Both `fetch() and `cache.put()` "consume"
      // the request, so we need to make a copy.
      // (See https://fetch.spec.whatwg.org/#dom-request-clone)
      return fetch(event.request).then(function (response) {
        console.log('    Response for %s from network: %O',
                    event.request.url, response);

        if (event.request.url.substr(-6) !== '/sw.js' && response.status < 400) {
          // This avoids caching responses that we know are errors (i.e.,
          // HTTP status codes of 4xx or 5xx). Note that for opaque filtered
          // responses (https://fetch.spec.whatwg.org/#concept-filtered-response-opaque)
          // we can't access to the response headers, so this check will
          // always fail and the font won't be cached. We call .clone() on
          // the response to save a copy of it to the cache. By doing so, we
          // get to keep the original response object which we will return
          // back to the controlled page.
          // (See https://fetch.spec.whatwg.org/#dom-response-clone)
          caches.open(CACHE_KEY).then(function (cache) {
            console.log('    Caching the response to', event.request.url);
            return cache.put(event.request, response.clone());
          }).catch(function (err) {
            // Likely we got an opaque response which the polyfill can't deal
            // with, so show a warning.
            console.warn('    Could not cache ' + requestURL + ': ' +
                         err.message);
          });
        } else {
          console.log('    Not caching the response to', event.request.url);
        }

        // Return the original response object, which will be used to fulfill
        // the resource request.
        return response;
      });

    })
  );
};
