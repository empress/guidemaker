'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const { compatBuild } = require('@embroider/compat');

module.exports = async function (defaults) {
  const { buildOnce } = await import('@embroider/vite');
  const { setConfig } = await import('@warp-drive/core/build-config');

  const app = new EmberApp(defaults, {});

  setConfig(app, __dirname, {
    deprecations: {
      DEPRECATE_TRACKING_PACKAGE: false,
    },
  });

  return compatBuild(app, buildOnce);
};
