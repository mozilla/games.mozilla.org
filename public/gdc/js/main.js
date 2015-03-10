(function () {
  function toArray(obj) {
    return Array.prototype.slice.apply(obj);
  }

  function $(selector) {
    return document.querySelector(selector);
  }

  function $$(selector) {
    return toArray(document.querySelectorAll(selector));
  }

  // ServiceWorker for caching requests offline.
  loadSW();

  function loadSW() {
    if ('serviceWorker' in navigator) {
      // Service Workers require HTTPS (http://goo.gl/lq4gCo). `localhost`
      // on a custom port is whitelisted.
      if (location.protocol === 'file:') {
        // Just don't execute the SW code if we're viewing the document.
        return;
      }
      if (location.protocol === 'http:' &&
          (!location.port || location.port === '80')) {
        // Change the protocol to HTTPS if we're running on a real server.
        location.protocol = 'https:';
      }

      if (true && localStorage.disable_sw) {
        console.log('Service Workers are temporarily disabled');
        navigator.serviceWorker.getRegistration('./sw.js').then(function (sw) {
          if (sw) {
            console.log('Temporarily disabling Service Workers, unregistering…');
            sw.unregister();
          }
        });
        return;
      }

      navigator.serviceWorker.register('./sw.js', {scope: './'}).then(function (sw) {
        if (navigator.serviceWorker.controller) {
          console.log('Page successfully fetched from cache by the Service Worker');
        } else {
          console.log('Page successfully registered by the Service Worker');
        }
      }).catch(function (err) {
        console.error('Service Worker error occurred: ' + err);
      });
    } else {
      console.warn('Service Workers are not supported in your browser');
    }
  }


  // Adding a class so we can disable certain :hover styles on touch.
  // NOTE: Not using classList for IE compatibility.
  document.body.className += 'ontouchstart' in window ? ' has-touch' : ' lacks-touch';


  // Set the 'lang' and 'dir' attributes to `<html>` when the page is translated.
  window.addEventListener('localized', function () {
    document.documentElement.lang = document.webL10n.getLanguage();
    document.documentElement.dir = document.webL10n.getDirection();
  });

  // Google Analytics.
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-49796218-16', 'auto');
  ga('send', 'pageview');

  $('.gdc__mozilla').addEventListener('click', function () {
    ga('send', 'event', 'click.header', 'mozilla-logo');
  });

  $('.gdc__logo__link').addEventListener('click', function () {
    ga('send', 'event', 'click.header', 'gdc-logo-link');
  });

  $('.gdc__text__link').addEventListener('click', function () {
    ga('send', 'event', 'click.header', 'gdc-text-link');
  });

  $('.gdc__location').addEventListener('click', function () {
    ga('send', 'event', 'click.header', 'booth-link');
  });

  $$('.company__item').forEach(function (el) {
    el.addEventListener('click', function () {
      // NOTE: Not using dataset for IE compatibility.
      ga('send', 'event', 'click.company',
         el.querySelector('img').getAttribute('alt'));
    });
  });

  $$('.highlight__item').forEach(function (el) {
    el.addEventListener('click', function () {
      ga('send', 'event', 'click.demo',
         el.querySelector('.highlight__item__title').textContent);
    });
  });

  $$('#posts a').forEach(function (el) {
    el.addEventListener('click', function () {
      ga('send', 'event', 'click.post', el.textContent);
    });
  });

  $$('#mozilla a').forEach(function (el) {
    el.addEventListener('click', function () {
      ga('send', 'event', 'click.footer', el.textContent);
    });
  });


  // Outsmart spam bots.
  var pressEmail = $('.footer__press');

  function setPressEmail() {
    pressEmail.href = 'mailto:press';
    pressEmail.href += '@mozilla.com';
  }

  pressEmail.addEventListener('click', setPressEmail);
  $('#mozilla').addEventListener('mouseover', setPressEmail);


  // Open external links in new tabs.
  toArray(
    document.querySelectorAll('[href^="//"], [href*="://"]')
  ).forEach(function (link) {
    link.setAttribute('target', '_blank');
  });
})();
