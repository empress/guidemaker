/* eslint-env node */

const recast = require('recast');
const { readFileSync, writeFileSync } = require('fs');
const { applyBuildConfig } = require('empress-blueprint-helpers');

const builders = recast.types.builders;

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

    const config = readFileSync('./config/environment.js');
    const configAst = recast.parse(config);

    recast.visit(configAst, {
      visitVariableDeclaration: function (path) {
        var node = path.node;

        const env = node.declarations.find(declaration => declaration.id.name === 'ENV');

        if (env) {
          let locationType = env.init.properties.find(property => property.key.name === 'locationType');

          if(locationType) {
            locationType.value = builders.literal('trailing-history');
          }

          let historySupportMiddleware = env.init.properties.find(property => property.key.name === 'historySupportMiddleware');

          if(historySupportMiddleware) {
            historySupportMiddleware.value = builders.literal(true);
          } else {
            historySupportMiddleware = builders.property(
              'init',
              builders.identifier('historySupportMiddleware'),
              builders.literal(true)
            );

            // insert just after the locationType
            env.init.properties.splice(env.init.properties.indexOf(locationType) + 1, 0, historySupportMiddleware);
          }

          let guidemaker = env.init.properties.find(property => property.key.value === 'guidemaker');

          if(!guidemaker) {
            guidemaker = builders.property(
              'init',
              builders.identifier('guidemaker'),
              builders.objectExpression([
                builders.property('init', builders.identifier('title'), builders.literal('Guidemaker Docs'))
              ])
            )
            env.init.properties.push(guidemaker);
          }
        }

        this.traverse(path);
      }
    });

    writeFileSync('./config/environment.js', recast.print(configAst, { tabWidth: 2, quote: 'single' }).code);

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
