"use strict";

const { dirname } = require("node:path");
const {
  babelCompatSupport,
  templateCompatSupport,
} = require("@embroider/compat/babel");

module.exports = {
  plugins: [
    [
      "babel-plugin-ember-template-compilation",
      {
        enableLegacyModules: [
          "ember-cli-htmlbars",
          "ember-cli-htmlbars-inline-precompile",
          "htmlbars-inline-precompile",
        ],
        transforms: templateCompatSupport(),
      },
    ],
    [
      "module:decorator-transforms",
      {
        runtime: {
          import: require.resolve("decorator-transforms/runtime-esm"),
        },
      },
    ],
    [
      "@babel/plugin-transform-runtime",
      {
        absoluteRuntime: dirname(
          require.resolve("@babel/runtime/package.json"),
        ),
        useESModules: true,
        regenerator: false,
      },
    ],
  ].concat(babelCompatSupport()),

  generatorOpts: {
    compact: false,
  },
};
