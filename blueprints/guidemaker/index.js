/* eslint-env node */

const recast = require('recast');
const { readFileSync, writeFileSync } = require('fs');

const builders = recast.types.builders;

module.exports = {
  description: 'The default blueprint for guidemaker.',

  normalizeEntityName() {
    // no-op
  },

  afterInstall() {
    return this.addAddonsToProject({
      packages: [
        'prember',
        'ember-cli-fastboot'
      ]
    }).then(() => {
      const code = readFileSync('./ember-cli-build.js');
      const ast = recast.parse(code);

      recast.visit(ast, {
        visitNewExpression: function (path) {
          var node = path.node;

          if (node.callee.name === 'EmberApp'
              || node.callee.name === 'EmberAddon') {
            // console.log(node, node.arguments)
            const configNode = node.arguments.find(element => element.type === 'ObjectExpression');

            let fingerprint = configNode.properties.find(property => {
              return property.key.name === 'fingerprint'
            });

            if(!fingerprint) {
              fingerprint = builders.property(
                'init',
                builders.identifier('fingerprint'),
                builders.objectExpression([])
              )
              configNode.properties.push(fingerprint);
            }

            // remove image extensions from the fingerprint config
            let extensions = fingerprint.value.properties.find(property => property.key.name === 'extensions');

            if(!extensions) {
              extensions = recast.types.builders.property(
                'init',
                builders.identifier('extensions'),
                builders.arrayPattern([])
              );

              fingerprint.value.properties.push(extensions);
            }

            extensions.value = builders.arrayPattern([
              builders.literal('js'),
              builders.literal('css'),
              builders.literal('map'),
            ]);

            return false;
          } else {
            this.traverse(path);
          }
        }
      });

      writeFileSync('./ember-cli-build.js', recast.print(ast, { tabWidth: 2, quote: 'single' }).code);

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

            let emberMeta = env.init.properties.find(property => property.key.value === 'ember-meta');

            if(!emberMeta) {
              emberMeta = builders.property(
                'init',
                builders.literal('ember-meta'),
                builders.objectExpression([
                  builders.property('init', builders.identifier('description'), builders.literal('Guides - Built with Guidemaker')),
                ])
              )
              env.init.properties.push(emberMeta);
            }
          }

          this.traverse(path);
        }
      });

      writeFileSync('./config/environment.js', recast.print(configAst, { tabWidth: 2, quote: 'single' }).code);
    });
  },

  filesToRemove: ['app/templates/application.hbs'],
};
