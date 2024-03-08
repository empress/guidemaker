/* eslint-disable prettier/prettier */
'use strict';

const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

const webpackConfig = {
  module: {
    rules: [
      {
        test: function (specifier) {
          return !specifier.endsWith('.css') && !specifier.endsWith('.js');
        },
        issuer: function (issuer) {
          if (issuer.endsWith('.css')) {
            return true;
          }
        },
        type: 'asset/resource',
      },
    ],
  },
};

module.exports = function (defaults) {
  let app = new EmberAddon(defaults, {
    'ember-cli-uglify': {
      uglify: {
        compress: {
          collapse_vars: false
        }
      }
    },
    autoImport: {
      webpack: webpackConfig,
    },
  });

  /*
    This build file specifies the options for the dummy test app of this
    addon, located in `/tests/dummy`
    This build file does *not* influence how the addon or the app using it
    behave. You most likely want to be modifying `./index.js` or app's build file
  */

  const { maybeEmbroider } = require('@embroider/test-setup');
  return maybeEmbroider(app, {
    packagerOptions: {
      webpackConfig,
    },
    skipBabel: [
      {
        package: 'qunit',
      },
    ],
  });
};
