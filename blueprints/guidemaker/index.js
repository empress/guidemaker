/* eslint-disable prettier/prettier */
/* eslint-env node */

const { readFileSync, writeFileSync } = require('fs');
const { applyBuildConfig, applyConfig } = require('empress-blueprint-helpers');

module.exports = {
  description: 'The default blueprint for guidemaker.',

  normalizeEntityName() {
    // no-op
  },

  async afterInstall() {
    await this.addPackagesToProject([
      { name: 'guidemaker-link-checker' },
      { name: 'guidemaker-toc-checker' },
      { name: 'mocha' },
    ]);

    await this.addAddonsToProject({
      packages: [
        'prember',
        'ember-cli-fastboot'
      ]
    });

    applyBuildConfig('fingerprint', {
      extensions: ['js', 'css', 'map'],
    })

    applyConfig(this.project, 'guidemaker', {
      title: 'Guidemaker Docs',
      description: 'Guides - Built with Guidemaker',
    });

    applyConfig(this.project, 'locationType', 'trailing-history', true);

    applyConfig(this.project, 'historySupportMiddleware', true, true);

    const package = JSON.parse(readFileSync('./package.json'));
    package.scripts = Object.assign(package.scripts, {
      "test": "npm run test:node && npm run test:ember",
      "test:ember": "ember test",
      "test:node": "mocha node-tests"
    });

    writeFileSync('./package.json', JSON.stringify(package, null, 2) + '\n');
  },

  filesToRemove: ['app/templates/application.hbs'],
};
