/* eslint-disable prettier/prettier */
'use strict';

module.exports = {
  root: true,
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    requireConfigFile: false,
    babelOptions: {
      plugins: [
        ['@babel/plugin-proposal-decorators', { decoratorsBeforeExport: true }],
      ],
    },
  },
  plugins: ['ember'],
  extends: [
    'eslint:recommended',
    'plugin:ember/recommended',
    'plugin:prettier/recommended',
  ],
  env: {
    browser: true,
  },
  rules: {},
  overrides: [
    // node files
    {
      files: [
        './.eslintrc.js',
        './.prettierrc.js',
        './.stylelintrc.js',
        './.template-lintrc.js',
        './addon-main.cjs',
        './babel.publish.config.cjs',
        './blueprints/*/index.js',
        './test-app/babel.config.cjs',
        './test-app/config/**/*.js',
        './test-app/ember-cli-build.js',
        './test-app/testem.cjs',
      ],
      parserOptions: {
        sourceType: 'script',
      },
      env: {
        browser: false,
        node: true,
      },
      extends: ['plugin:n/recommended'],
    },
    {
      files: [
        './vite.mjs',
        './rollup.config.mjs',
        './test-app/.try.mjs',
        './test-app/vite.config.mjs',
      ],
      env: {
        browser: false,
        node: true,
      },
      extends: ['plugin:n/recommended'],
    },
    {
      // test files
      files: ['test-app/tests/**/*-test.{js,ts}'],
      extends: ['plugin:qunit/recommended'],
    },
    // node tests
    {
      files: [
        'node-tests/**/*.js',
      ],
      env: {
        node: true,
        mocha: true,
      },
      parserOptions: {
        ecmaVersion: 2018,
      },
      rules: {
        "func-names": 0,
        "prefer-arrow-callback": 0,
        "no-unused-expressions": 0,
      },
    },
  ],
};
