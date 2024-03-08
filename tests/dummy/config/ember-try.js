'use strict';

const getChannelURL = require('ember-source-channel-url');
const { embroiderSafe, embroiderOptimized } = require('@embroider/test-setup');

module.exports = async function () {
  return {
    usePnpm: true,
    scenarios: [
      {
        name: 'ember-lts-3.28',
        npm: {
          devDependencies: {
            'ember-source': '~3.28.0',
            'ember-cli': '~4.12.0',
          },
        },
      },
      {
        name: 'ember-lts-4.4',
        npm: {
          devDependencies: {
            'ember-source': '~4.4.0',
          },
        },
      },
      {
        name: 'ember-lts-4.8',
        npm: {
          devDependencies: {
            'ember-source': '~4.8.0',
          },
        },
      },
      {
        name: 'ember-lts-4.12',
        npm: {
          devDependencies: {
            'ember-source': '~4.12.0',
          },
        },
      },
      {
        name: 'ember-release',
        npm: {
          devDependencies: {
            'ember-source': await getChannelURL('release'),
          },
          overrides: {
            'ember-source': '$ember-source',
          },
        },
      },
      {
        name: 'ember-beta',
        npm: {
          devDependencies: {
            'ember-source': await getChannelURL('beta'),
          },
          overrides: {
            'ember-source': '$ember-source',
          },
        },
      },
      {
        name: 'ember-canary',
        npm: {
          devDependencies: {
            'ember-source': await getChannelURL('canary'),
          },
          overrides: {
            'ember-source': '$ember-source',
          },
        },
      },
      {
        name: 'no-deprecations',
        npm: {
          devDependencies: {
            'ember-deprecation-error': '*',
          },
        },
      },
      {
        name: 'ember-release-no-deprecations',
        npm: {
          devDependencies: {
            'ember-source': await getChannelURL('release'),
            'ember-deprecation-error': '*',
          },
          overrides: {
            'ember-source': '$ember-source',
          },
        },
      },
      embroiderSafe(),
      embroiderOptimized(),
    ],
  };
};
