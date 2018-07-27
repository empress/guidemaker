/* eslint-env node */

const recast = require('recast');
const { readFileSync, writeFileSync } = require('fs');

module.exports = {
  description: 'The default blueprint for guidemaker.',

  normalizeEntityName() {
    // no-op
  },

  afterInstall() {
    return this.addAddonsToProject({
      packages: [
        'prember@0.3.0',
        'ember-cli-fastboot',
      ]
    }).then(() => {
      const builders = recast.types.builders;

      const code = readFileSync('./ember-cli-build.js');
      const ast = recast.parse(code);

      recast.visit(ast, {
        visitNewExpression: function (path) {
          var node = path.node;

          if (node.callee.name === 'EmberApp'
              || node.callee.name === 'EmberAddon') {
            // console.log(node, node.arguments)
            const configNode = node.arguments.find(element => element.type === 'ObjectExpression');

            let fingerprint = configNode.properties.find(property => property.key.value === 'fingerprint');

            if(!fingerprint) {
              fingerprint = builders.property(
                'init',
                builders.identifier('fingerprint'),
                builders.objectExpression([])
              )
              configNode.properties.push(fingerprint);
            }

            // remove image extensions from the fingerprint config
            const properties = fingerprint.value.properties.filter(property => property.key.value !== 'extensions');

            properties.push(recast.types.builders.property(
              'init',
              builders.identifier('extensions'),
              builders.arrayPattern([
                builders.literal('js'),
                builders.literal('css'),
                builders.literal('map'),
              ])
            ));

            fingerprint.value.properties = properties;
            return false;
          } else {
            this.traverse(path);
          }
        }
      });

      writeFileSync('./ember-cli-build.js', recast.print(ast, { tabWidth: 2, quote: 'single' }).code);
    });
  }
};
