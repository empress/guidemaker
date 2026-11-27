# guidemaker

This project is designed to be a fully-functional, static site implementation of a documentation site and is built on EmberJS with fully working out of the box SEO friendly output. It supports being hosted on AWS S3 or any other static site hosting solution.

This system is designed to have a core functionality provided by this repository/package and seperate packages that provide the themes and styling to your Documentation site.

- [Guidemaker Default Template](https://github.com/empress/guidemaker-default-template) is a basic theme that is intended to provide a default style for new projects.
- [Guidemaker Ember Template](https://github.com/ember-learn/guidemaker-ember-template) is the official theme used for all Ember Learning Core Team projects

If you are interested in writing your own theme for Guidemaker please reach out to us and we can walk you through the process. Hopefully if there is enough interest we can provide basic instructions on how to build your own theme using this system.

If you want an example of the this "in production" then check out the [Ember Guides](https://guides.emberjs.com). If you use this in production let us know on Twitter and we can add a "built with guidemaker" wiki.

You do not need to be a web developer to be able to use this system. You just write markdown files and the rest of the work is performed by the Vite build of your Ember app.

## Compatibility

* Ember.js v5.12 or above, built with Vite and Embroider (`@embroider/vite`)
* ember-data or WarpDrive, with the legacy API: guidemaker has models, adapters and serializers
* Node.js v20.19 or above

Guidemaker 4 is the last version for classic ember-cli builds (without Vite).

## Install in a Vite app

```sh
pnpm add -D guidemaker guidemaker-ember-template ember-cli-head showdown
```

Your app also needs ember-data (or WarpDrive with its legacy API).

### Add the Vite plugin

The plugin turns the markdown files in your `guides` folder into the JSON files that the app loads from `/content/`. It serves them in dev, and writes them into the build.

```js
// vite.config.mjs
import { defineConfig } from 'vite';
import { extensions, classicEmberSupport, ember } from '@embroider/vite';
import { babel } from '@rollup/plugin-babel';
import { guidemaker } from 'guidemaker/vite';

export default defineConfig({
  plugins: [
    classicEmberSupport(),
    ember(),
    guidemaker(),
    babel({
      babelHelpers: 'runtime',
      extensions,
    }),
  ],
});
```

`guidemaker()` takes these options:

* `source`: a package (or a folder in `node_modules`) that has the `guides` folder, for example `guidemaker({ source: '@ember-learn/guides-source' })`. Without it, the plugin uses the `guides` folder of the app. When the guides come from a package, the plugin also serves and builds the `public` folder of that package.
* `showdown`: the [showdown options](https://github.com/showdownjs/showdown#valid-options) for the markdown. Without it, the plugin uses `showdown` from `config/environment.js`.
* `premberVersionFilter`: the versions that `urls()` lists. A string such as `'v3.0.0'` lists that version and each newer one. A function gets each version and returns `true` to list it. The `release` urls are always in the list.
* `root`: the folder of the app. The default is the folder of the Vite config.

The `guides` folder can have a `versions.yml` file with `allVersions`, `currentVersion` and `ltsVersions`. Then each version has its own folder, and `release` has the current version.

### Prerender the pages

`guidemaker/vite` also exports `urls()`, which gives the url of each page for a static site generator or a prerender step. It takes the same options as the plugin:

```js
import { urls } from 'guidemaker/vite';

let pages = urls({ premberVersionFilter: 'v3.0.0' });
// ['/v3.0.0', ..., '/release', '/release/getting-started', ...]
```

`netlifyRedirects()` gives the lines of a Netlify `_redirects` file. `/` and `/current/*` go to `/release/`, and each page with a `redirect` in its front matter goes to that page.

```js
import { writeFileSync } from 'node:fs';
import { netlifyRedirects } from 'guidemaker/vite';

writeFileSync('dist/_redirects', netlifyRedirects().join('\n'));
```

### Files your app needs

Embroider uses the files of the app before the files of addons. It also uses the app files of classic addons (such as ember-cli-head) before the ones of guidemaker. Add these files to your app:

```js
// app/components/head-content.js
// ember-cli-head renders this component in <head>
export { default } from 'guidemaker/components/head-content';
```

```js
// app/services/store.js
export { default } from 'ember-data/store';
```

```js
// app/transforms/boolean.js
export { BooleanTransform as default } from '@ember-data/serializer/transform';
```

```js
// app/transforms/string.js
export { StringTransform as default } from '@ember-data/serializer/transform';
```

Your theme renders ember-cli-head's `<HeadLayout />`. Guidemaker puts the title, the description, the canonical url, and the Open Graph and Twitter tags of the current page in `<head>`. To change them, extend `guidemaker/services/head-data` in `app/services/head-data.js`.

### Changes from the classic addon

The classic addon (guidemaker 4) changed the config of the app at build time. This version does not:

* `ember-meta` in `config/environment.js` is optional. Its `description` and `title` default to the ones of `guidemaker`. Set `ember-meta.url` (with a trailing `/`) to get canonical urls.
* FastBoot's `hostWhitelist` does not get `/localhost:\d+/`. If you use FastBoot, add it yourself.
* The config does not get an empty `ember-collapsible-panel` object.

Guidemaker puts the names of the active routes on `<body>`, as ember-body-class did. After each transition, it moves the focus to the top of the page, as ember-scroll did. If your app depends on `ember-body-class`, `ember-scroll` or `ember-meta` itself, you can remove them.

## Configuration

Add a `guidemaker` object to your `config/environment.js` file, with the details of your documentation. Also set `locationType: 'trailing-history'`, so that each url ends with a `/`, as the prerendered pages do.

Here is an example config with comments to explain the use of each of the attributes:

```javascript
guidemaker: {
  // This title will be used in place of a logo if you do not provide one
  title: 'Guidemaker docs',
  // This logo will be used in the top left of the page - you can add it to your public folder
  logo: '/images/logo.svg',
  // this will be used for the copyright line in the bottom left of the page - if not provided then
  // it will use `title` instead
  copyright: 'My Awesome Company',
  // show social links
  social: {
    // provide the slug for the github link (can be a project or an org)
    github: 'empress/guidemaker',
    // provide your username
    twitter: 'real_ate',
    // provide your invite link for your public discord
    // discordLink: '<insert link here>'
  },
  // this should be the link to your documentation source - if you provide one it will add an edit button on each page
  // sourceRepo: 'https://github.com/authmaker/documentation',

  // this allows you to override the branch that is used in the edit button (if you have provided a sourceRepo). It is up to the templates, but most of them default to master if you don't provide this setting
  // sourceBranch: 'master'

  // when true the Table of Contents will be collapsed and you will need to click each header to expand
  // default - false
  collapseToc: true,
}
```


## Contributing

See the [Contributing](CONTRIBUTING.md) guide for details.


## License

This project is licensed under the [MIT License](LICENSE.md).
