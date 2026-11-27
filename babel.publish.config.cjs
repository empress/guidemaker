"use strict";

/**
 * Used by rollup to publish the addon. Templates stay in the `hbs` format,
 * so that the app's ember-source compiles them.
 */
module.exports = {
  plugins: [
    "@embroider/addon-dev/template-colocation-plugin",
    [
      "babel-plugin-ember-template-compilation",
      {
        targetFormat: "hbs",
        transforms: [],
      },
    ],
    [
      "module:decorator-transforms",
      {
        runtime: {
          import: "decorator-transforms/runtime-esm",
        },
      },
    ],
  ],

  generatorOpts: {
    compact: false,
  },
};
