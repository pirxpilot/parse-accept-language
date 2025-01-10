[![NPM version][npm-image]][npm-url]
[![Build Status][build-image]][build-url]
[![Dependency Status][deps-image]][deps-url]

# parse-accept-language

Parse 'Accept-Language' header and cache the result in request.

## Install

```sh
$ npm install --save parse-accept-language
```

## Usage

```js
var parseAcceptLanguage = require('parse-accept-language');

var pal = parseAcceptLanguage(req);
```

## License

MIT © [Damian Krzeminski](https://pirxpilot.me)

[npm-image]: https://img.shields.io/npm/v/parse-accept-language
[npm-url]: https://npmjs.org/package/parse-accept-language

[build-url]: https://github.com/pirxpilot/parse-accept-language/actions/workflows/check.yaml
[build-image]: https://img.shields.io/github/actions/workflow/status/pirxpilot/parse-accept-language/check.yaml?branch=main

[deps-image]: https://img.shields.io/librariesio/release/npm/parse-accept-language
[deps-url]: https://libraries.io/npm/parse-accept-language
