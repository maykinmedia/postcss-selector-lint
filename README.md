[![Build Status](https://travis-ci.org/maykinmedia/postcss-selector-lint.svg?branch=master)](https://travis-ci.org/maykinmedia/postcss-selector-lint)

# PostCSS Selector Lint

`🐱 Please don't use CSS selectors of type "id" in global scope (stylesheet.css:11,1 "#header").`

PostCSS Selector Lint warns about disallowed selector types in either 'global' or 'local' scope. This helps preventing
scope pollution by warning about non-nested type (tag) selectors which might have unwanted side-effects.

 > "Only use class names in selectors, no IDs or HTML tag names." -- kandl-style-guide.


The configuration of this linter is fully customizable.



## Installation

Install with [npm](https://www.npmjs.com/)

```sh
npm install --save-dev postcss-selector-lint
```



## Usage

```js
var postcss = require('postcss')
var selectorLint = require('postcss-selector-lint')

var config = {};  // Optional

postcss([selectorLint(config)]);
```



## Terminology

*Scope types:*
- **Global**: non-nested selectors - `h1`
- **Local**: nested selectors - `.wysiwyg h1`

*Selector types*
- **Type**: Tag type - `h1`
- **Class**: Tag class - `.wysiwyg`
- **Id**: Tag id - `#nav`
- **universal**: Universal selector - `*`
- **attribute**: Attribute selector- `input[type=checkbox]`
- **pseudo**: Pseudo class selector- `h1:before`



## Configuration

**Default**:

The default configuration only lets you use `class` selectors in `global` scope. In `local` (nested) scope, `type` (h1),
`universal` (*) and `attribute` ([type=checkbox])  are also allowed.

**Configuration scheme**:

```js
const config = {
    global: {
        type: false,
        class: true,
        id: false,
        universal: false,
        attribute: false,
        psuedo: false,
    },

    local: {
        type: true,
        class: true,
        id: false,
        universal: true,
        attribute: true,
        psuedo: true,
    },

    options: {
        excludedFiles: [''],  // Allows filenames to be excluded from linting.
    }
};
```

## Running tests

```sh
npm test
```



## Contributing

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](https://github.com/maykinmedia/postcss-selector-lint/issues).



## Author

**Maykin Media**

* [maykinmedia.nl](https://www.maykinmedia.nl/)
* [github/maykinmedia](https://github.com/maykinmedia)
* [twitter/maykinmedia](http://twitter.com/maykinmedia)

## License

Copyright © 2020 [Maykin Media](https://www.maykinmedia.nl/)
Licensed under the MIT license.
