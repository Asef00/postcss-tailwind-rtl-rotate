# postcss-tailwind-rtl-rotate

[![npm version](https://badge.fury.io/js/postcss-tailwind-rtl-rotate.svg)](https://badge.fury.io/js/postcss-tailwind-rtl-rotate)
[![Build Status](https://travis-ci.org/Asef00/postcss-tailwind-rtl-rotate.svg?branch=master)](https://travis-ci.org/Asef00/postcss-tailwind-rtl-rotate)
[![Coverage Status](https://coveralls.io/repos/github/Asef00/postcss-tailwind-rtl-rotate/badge.svg?branch=master)](https://coveralls.io/github/Asef00/postcss-tailwind-rtl-rotate?branch=master)

A PostCSS plugin that automatically handles Tailwind CSS rotate classes for RTL (Right-to-Left) layouts by negating rotation values in RTL mode.

## What it does

This plugin transforms Tailwind CSS rotate utilities to work correctly in both LTR and RTL layouts. When you use rotate classes like `rotate-45`, the plugin automatically creates RTL-specific versions that negate the rotation values, ensuring your rotated elements appear correctly in both text directions.

## Installation

```bash
npm install postcss-tailwind-rtl-rotate --save-dev
```

## Usage

Add the plugin to your PostCSS configuration:

```js
// postcss.config.js
module.exports = {
  plugins: [
    require("postcss-tailwind-rtl-rotate"),
    // other plugins
  ],
};
```

Or use it with other build tools:

```js
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          "style-loader",
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              plugins: [require("postcss-tailwind-rtl-rotate")],
            },
          },
        ],
      },
    ],
  },
};
```

## How it works

The plugin scans your CSS for rules containing `rotate-` in their selectors and `--tw-rotate` custom properties. For each matching rule, it:

1. Creates an RTL-specific version with `[dir="rtl"]` selector and negated rotation values
2. Creates an LTR-specific version with `[dir="ltr"]` selector and original rotation values
3. Removes the `--tw-rotate` declaration from the original rule (or removes the entire rule if it becomes empty)

## Examples

### Input CSS

```css
.rotate-45 {
  --tw-rotate: 45deg;
}

.hover\:rotate-90:hover {
  --tw-rotate: 90deg;
}

.rotate-180 {
  --tw-rotate: 180deg;
  color: red;
}
```

### Output CSS

```css
[dir="rtl"] .rotate-45 {
  --tw-rotate: -45deg;
}
[dir="ltr"] .rotate-45 {
  --tw-rotate: 45deg;
}

[dir="rtl"] .hover\:rotate-90:hover {
  --tw-rotate: -90deg;
}
[dir="ltr"] .hover\:rotate-90:hover {
  --tw-rotate: 90deg;
}

[dir="rtl"] .rotate-180 {
  --tw-rotate: -180deg;
}
[dir="ltr"] .rotate-180 {
  --tw-rotate: 180deg;
}
.rotate-180 {
  color: red;
}
```

## Supported rotation units

The plugin supports all CSS rotation units:

- **Degrees**: `45deg`, `-90deg`, `180deg`
- **Turns**: `0.25turn`, `0.5turn`, `1turn`
- **Radians**: `1.57rad`, `3.14rad`
- **Numeric values**: `45`, `-90`, `180`

## Browser support

This plugin works with any browser that supports:

- CSS Custom Properties (CSS Variables)
- The `dir` attribute

## Testing

Run the test suite:

```bash
npm test
```

The plugin includes comprehensive tests covering:

- Different rotation units
- Positive and negative values
- Complex selectors
- Rules with additional CSS properties
- Edge cases and error handling

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT © [Asef](https://github.com/Asef00)

## Changelog

### 0.0.0

- Initial release
- Support for all CSS rotation units
- Automatic RTL/LTR rule generation
- Comprehensive test coverage
