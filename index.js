/* eslint-disable prettier/prettier */
'use strict';

const BroccoliMergeTrees = require('broccoli-merge-trees');
const compareVersions = require('compare-versions');
const Funnel = require('broccoli-funnel');
const resolve = require('resolve');
const StaticSiteJson = require('broccoli-static-site-json');
const walkSync = require('walk-sync');
const writeFile = require('broccoli-file-creator');
const yaml = require('js-yaml');
const yamlFront = require('yaml-front-matter');

const { readFileSync, existsSync } = require('fs');
const { join } = require('path');
const { Serializer } = require('jsonapi-serializer');
const { extname } = require('path');

const VersionsSerializer = new Serializer('version', {
  attributes: [
    'allVersions',
    'currentVersion',
    'ltsVersions'
  ],
});

module.exports = {
  name: require('./package').name,
  urlsForPrember() {
    const guidemakerOptions = this.app.options.guidemaker || {};
    const guidesSrcPkg = this.getGuidesSrcPkg();
    let urls = []

    const versions = this.getVersions();

    if(!versions) {
      const paths = walkSync(`${guidesSrcPkg}/guides`);

      const mdFiles = paths.
        filter(path => extname(path) === '.md')
        .map(path => path.replace(/\.md/, ''))
        .map(path => path.replace(/\/index$/, ''));

      mdFiles.forEach((file) => {
        urls.push(`/release/${file}`)
      });

      urls.push('/release')
    } else {
      let premberVersions = versions.allVersions;

      if(guidemakerOptions.premberVersionFilter) {
        if(typeof guidemakerOptions.premberVersionFilter === 'function') {
          premberVersions = versions.allVersions.filter(guidemakerOptions.premberVersionFilter);
        } else if (typeof guidemakerOptions.premberVersionFilter === 'string') {
          premberVersions = versions.allVersions.filter((version) => {
            return compareVersions.compare(version, guidemakerOptions.premberVersionFilter, '>=');
          });
        } else {
          throw Error(`'premberVersionFilter' should be either a function or a string of the version you want to build from`);
        }
      }

      // always build release
      premberVersions.push('release');

      urls = [...urls, ...premberVersions.map(version => `/${version}`)];

      premberVersions.forEach((premberVersion) => {
        const filesVersion = premberVersion === versions.currentVersion ? 'release' : premberVersion;
        const paths = walkSync(`${guidesSrcPkg}/guides/${filesVersion}`);

        const mdFiles = paths.
          filter(path => extname(path) === '.md')
          .map(path => path.replace(/\.md/, ''))
          .map(path => path.replace(/\/index$/, ''));

        mdFiles.forEach((file) => {
          urls.push(`/${premberVersion}/${file}`)
        })
      });

      const paths = walkSync(`${guidesSrcPkg}/guides/release`);

      const mdFiles = paths.
        filter(path => extname(path) === '.md')
        .map(path => path.replace(/\.md/, ''))
        .map(path => path.replace(/\/index$/, ''));

      mdFiles.forEach((file) => {
        urls.push(`/${versions.currentVersion}/${file}`)
      });
    }

    return urls;
  },

  getVersions() {
    const guidesSrcPkg = this.getGuidesSrcPkg();

    if(!existsSync(`${guidesSrcPkg}/versions.yml`) && !existsSync(`${guidesSrcPkg}/guides/versions.yml`)) {
      return;
    }

    let versionsFile;

    if (existsSync(`${guidesSrcPkg}/versions.yml`)) {
      // eslint-disable-next-line no-console
      console.warn(`Defining your 'versions.yml' file in the root folder is now deprecated.

You should move it into the 'guides' folder.
`);
      versionsFile = `${guidesSrcPkg}/versions.yml`;
    } else {
      versionsFile = `${guidesSrcPkg}/guides/versions.yml`;
    }

    return yaml.safeLoad(readFileSync(versionsFile, 'utf8'));
  },

  netlifyRedirects() {
    const redirects = [
      '/          /release/',
      '/current/* /release/:splat',
    ];

    const guidesSrcPkg = this.getGuidesSrcPkg();
    const paths = walkSync(`${guidesSrcPkg}/guides`)
      .filter(path => extname(path) === '.md')
      .map(path => ({
        path: path.replace(/\/index.md$/, ''),
        content: readFileSync(join(guidesSrcPkg, 'guides', path)),
      }));

    const versions = this.getVersions();

    if(!versions) {
      paths.forEach((file) => {
          const front = yamlFront.loadFront(file.content);

          if (front.redirect) {
            let redirect;

            if(front.redirect.match(/^https?:\/\//)) {
              redirect = front.redirect;
            } else if (front.redirect.endsWith('/index')) {
              redirect = `/release/${front.redirect.replace(/\/index$/, '')}`;
            } else {
              redirect = `/release/${front.redirect}`;
            }

            redirects.push(`/release/${file.path.replace(/\.md$/, '')} ${redirect}`)
          }
        })
    } else {
      paths.forEach((file) => {
          const front = yamlFront.loadFront(file.content);

          if (front.redirect) {
            let pathMatch = file.path.match(/^([^/]*)/);
            let version = pathMatch[1];

            let redirect;

            if(front.redirect.match(/^https?:\/\//)) {
              redirect = front.redirect;
            } else if (front.redirect.endsWith('/index')) {
              redirect = `/${version}/${front.redirect.replace(/\/index$/, '')}`;
            } else {
              redirect = `/${version}/${front.redirect}`;
            }

            redirects.push(`/${file.path.replace(/\.md$/, '')} ${redirect}`)

            // also add current version number redirect
            if(version === 'release') {
              redirects.push(`/${file.path.replace(/\.md$/, '').replace(/^release\//, `${versions.currentVersion}/`)} ${redirect}`)
            }

          }
        })
    }


    return redirects;
  },

  getGuidesSrcPkg() {
    let appPrefix = join(this.project.configPath(), '../..');
    if(this.app.options.guidemaker && this.app.options.guidemaker.source) {
      try {
        return resolve.sync(this.app.options.guidemaker.source, { basedir: process.cwd() });
      } catch (e) {
        // try getting node_modules directly
        let fullPath = join(process.cwd(), 'node_modules', this.app.options.guidemaker.source);
        if(existsSync(fullPath)) {
          return fullPath;
        }
      }

    } else if(existsSync(join(appPrefix, 'guides'))) {
      return appPrefix;
    }
  },

  treeForPublic() {
    let guidesSrcPkg = this.getGuidesSrcPkg();
    let broccoliTrees = [];

    // if there is an external guides source
    if(guidesSrcPkg !== process.cwd()) {
      if(existsSync(`${guidesSrcPkg}/public`)) {
        broccoliTrees.push(new Funnel(`${guidesSrcPkg}/public`))
      }
    }

    if(!guidesSrcPkg) {
      throw new Error('You must either define "source" in your ember-cli-build or have a `guides` directory in your project.')
    }

    const versions = this.getVersions();

    // the source package does not support versions
    if(!versions) {
      broccoliTrees.push(new StaticSiteJson(`${guidesSrcPkg}/guides`, {
        contentFolder: `content/release`,
        contentTypes: ['content', 'description'],
        type: 'contents',
        attributes: ['canonical', 'redirect'],
      }))
    } else {
      const jsonTrees = versions.allVersions.map((listedVersion) => {
        let version = listedVersion === versions.currentVersion ? 'release' : listedVersion;

        return new StaticSiteJson(`${guidesSrcPkg}/guides/${version}`, {
          contentFolder: `content/${version}`,
          contentTypes: ['content', 'description'],
          type: 'contents',
          attributes: ['canonical', 'redirect'],
        })
      });

      jsonTrees.push(new StaticSiteJson(`${guidesSrcPkg}/guides/release`, {
        contentFolder: `content/${versions.currentVersion}`,
        contentTypes: ['content', 'description'],
        type: 'contents',
        attributes: ['canonical', 'redirect'],
      }));

      // setting an ID so that it's not undefined
      versions.id = 'versions';
      const versionsFile = writeFile('/content/versions.json', JSON.stringify(VersionsSerializer.serialize(versions)));

      broccoliTrees.push(versionsFile);
      broccoliTrees = [...broccoliTrees, ...jsonTrees];
    }

    return new BroccoliMergeTrees(broccoliTrees);
  },

  config(env, config) {
    let guidemaker = config.guidemaker || {};

    let emberMetaConfig = {
      description: guidemaker.description,
      title: guidemaker.title,
    }

    let fastboot = config.fastboot || {};

    if(fastboot.hostWhitelist) {
      fastboot.hostWhitelist.push(/localhost:\d+/);
    } else {
      fastboot.hostWhitelist = [/localhost:\d+/];
    }

    return {
      fastboot,
      'ember-meta': emberMetaConfig,
      // TODO: investigate this bug - remove it and see why it breaks
      'ember-collapsible-panel': config['ember-collapsible-panel'] || {}
    }
  },

  included(app) {
    this._super.included.apply(this, arguments)

    if(!app.options['ember-prism']) {
      app.options['ember-prism'] = {
        theme: 'okaidia',

        components: [
          'apacheconf',
          'bash',
          'css',
          'handlebars',
          'http',
          'javascript',
          'json',
          'markup-templating',
          'ruby',
          'scss'
        ],

        plugins: ['line-numbers', 'normalize-whitespace']
      }
    }
  },
};
