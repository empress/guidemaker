'use strict';

const BroccoliMergeTrees = require('broccoli-merge-trees');
const Funnel = require('broccoli-funnel');
const StaticSiteJson = require('broccoli-static-site-json');
const walkSync = require('walk-sync');
const writeFile = require('broccoli-file-creator');
const yaml = require('js-yaml');

const { readFileSync } = require('fs');
const { Serializer } = require('jsonapi-serializer');
const { extname } = require('path');

const VersionsSerializer = new Serializer('version', {
  attributes: [
    'allVersions',
    'currentVersion',
  ],
});

module.exports = {
  name: 'guidemaker',
  urlsForPrember() {
    const guidesSrcPkg = `node_modules/${this.app.options.guidemaker.source}`;
    const versions = yaml.safeLoad(readFileSync(`${guidesSrcPkg}/versions.yml`, 'utf8'));

    let premberVersions = [...versions.allVersions, 'release'];
    const urls = premberVersions.map(version => `/${version}`);

    premberVersions.forEach((premberVersion) => {
      const filesVersion = ['current', 'release'].includes(premberVersion) ? versions.currentVersion : premberVersion;
      const paths = walkSync(`${guidesSrcPkg}/guides/${filesVersion}`);

      const mdFiles = paths.
        filter(path => extname(path) === '.md')
        .map(path => path.replace(/\.md/, ''))
        .map(path => path.replace(/\/index$/, ''));

      mdFiles.forEach((file) => {
        urls.push(`/${premberVersion}/${file}`)
      })
    });

    return urls;
  },

  treeForPublic() {
    const guidesSrcPkg = `node_modules/${this.app.options.guidemaker.source}`;
    const versions = yaml.safeLoad(readFileSync(`${guidesSrcPkg}/versions.yml`, 'utf8'));
    let premberVersions = [...versions.allVersions, 'release'];
    const urls = premberVersions.map(version => `/${version}`);

    const guidesSourcePublic = new Funnel(`${guidesSrcPkg}/public`);

    premberVersions.forEach((premberVersion) => {
      const filesVersion = ['current', 'release'].includes(premberVersion) ? versions.currentVersion : premberVersion;
      const paths = walkSync(`${guidesSrcPkg}/guides/${filesVersion}`);

      const mdFiles = paths.
        filter(path => extname(path) === '.md')
        .map(path => path.replace(/\.md/, ''))
        .map(path => path.replace(/\/index$/, ''));

      mdFiles.forEach((file) => {
        urls.push(`/${premberVersion}/${file}`)
      })
    });

    // setting an ID so that it's not undefined
    versions.id = 'versions';

    const jsonTrees = versions.allVersions.map((version) => new StaticSiteJson(`${guidesSrcPkg}/guides/${version}`, {
      contentFolder: `content/${version}`,
      contentTypes: ['content', 'description'],
      type: 'contents',
      attributes: ['canonical'],
    }));

    var versionsFile = writeFile('/content/versions.json', JSON.stringify(VersionsSerializer.serialize(versions)));

    return new BroccoliMergeTrees([versionsFile, guidesSourcePublic, ...jsonTrees]);
  }
};
