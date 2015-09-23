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

  // Google Analytics.
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-49796218-16', 'auto');
  ga('send', 'pageview');

  var actionLink = document.getElementById('action-link');
  if (typeof(actionLink) != 'undefined' && actionLink != null) {
    $('#action-link').addEventListener('click', function () {
      ga('send', 'event', 'click.header', 'action-link');
    });
  }

  $$('#companies a').forEach(function (el) {
    el.addEventListener('click', function () {
      // NOTE: Not using dataset for IE compatibility.
      ga('send', 'event', 'click.company',
        el.getAttribute('alt'));
    });
  });

  $$('.highlight__item').forEach(function (el) {
    el.addEventListener('click', function () {
      ga('send', 'event', 'click.demo',
        el.querySelector('.highlight__item__title').textContent);
    });
  });

  $$('#stories a').forEach(function (el) {
    el.addEventListener('click', function () {
      ga('send', 'event', 'click.post', el.textContent);
    });
  });

  $$('#mozilla a').forEach(function (el) {
    el.addEventListener('click', function () {
      ga('send', 'event', 'click.footer', el.textContent);
    });
  });
})();