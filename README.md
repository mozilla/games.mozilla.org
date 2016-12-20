# Mozilla Games

[Mozilla Games site](https://games.mozilla.org/)


## Installation

To install the Node dependencies:

    npm install


## Development

All of the web content is static (see the [https://github.com/mozilla/moz-games/tree/master/public](public/) directory).

To serve the site from the simple server:

    npm run dev

Then launch the site from your favourite browser:

[__http://localhost:8080/__](http://localhost:8080/)

If you wish to serve the site from a different port:

    PORT=8000 npm run dev


## Deployment

In production, the server is run like so:

    npm start

Alternatively:

    npm run prod

To run the server through Heroku's [foreman](https://devcenter.heroku.com/articles/procfile):

    foreman start web


## Localisation

All webpage content is localised using [webL10n](https://github.com/fabi1cazenave/webL10n), a client-side library for internationalisation (i18n) / localisation (l10n).

If you would like to submit new translations:

1. Ensure a section exists for the locale in [`l10n/locales.ini`](https://github.com/mozilla/moz-games/blob/master/public/gdc/l10n/locales.ini), followed by an `import` rule. For example:

    ```properties
    [fr]
    @import url(data.fr.properties)
    ```

2. Open the corresponding [`.properties`](https://github.com/mozilla/moz-games/blob/master/public/gdc/l10n/data.fr.properties) file, and fill in all the translations.
3. Open a pull request.


## Contributing

[Contributions are very welcome!](CONTRIBUTING.md)
