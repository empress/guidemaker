guidemaker
==============================================================================

This project is designed to be a fully-functional, static site implementation of a documentation site and is built on EmberJS with fully working out of the box SEO friendly output. It supports being hosted on AWS S3 or any other static site hosting solution.

This system is designed to have a core functionality provided by this repository/package and seperate packages that provide the themes and styling to your Documentation site.

- [Guidemaker Default Template](https://github.com/empress/guidemaker-default-template) is a basic theme that is intended to provide a default style for new projects.
- [Guidemaker Ember Template](https://github.com/ember-learn/guidemaker-ember-template) is the official theme used for all Ember Learning Core Team projects

If you are interested in writing your own theme for Guidemaker please reach out to us and we can walk you through the process. Hopefully if there is enough interest we can provide basic instructions on how to build your own theme using this system.

If you want an example of the this "in production" then check out the [Ember Guides](https://guides.emberjs.com). If you use this in production let us know on Twitter and we can add a "built with guidemaker" wiki.

You do not need to be a web developer to be able to use this system. You just write markdown files and the rest of the work is performed by the EmberJS build system.

Compatibility
------------------------------------------------------------------------------

* Ember.js v2.18 or above
* Ember CLI v2.13 or above
* Node.js v8 or above

Super Quick Start
------------------------------------------------------------------------------
If you want to start writing your documentation right away and want to deploy your new Guidemaker documentation site on [Netlify](https://www.netlify.com/) in less than a minute then you can just click this button:

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/empress/guidemaker-netlify-default-template)

This will create a new repo in your GitHub account that has everything setup and ready to go, as well as setting up Netifly to do Continuous Deployment of your new documentation site.

If you want to instead work with your documentation site locally before deploying then you can continue reading

Quick Start
------------------------------------------------------------------------------

```sh
# if you don't have ember-cli installed already
npm install -g ember-cli

ember new super-docs
cd super-docs

ember install guidemaker guidemaker-default-template
```

It will ask you if you want to update the index.html file and you should say yes 👍

To build the static output directory, run the standard build process for a production Ember application:

```sh
ember build -e production
```

This will generate a fully static output of your site in the dist folder.

If you want to see the system running on your local machine just run `npm start` and you will be able to navigate to http://localhost:4200 to see the documentation site in action.

Configuration
------------------------------------------------------------------------------

After you install Guidemaker using the instructions above, you will see that your `config/environment.js` file will have been edited to add a `guidemaker` config object. You should update this with the details relevant to your documentation.

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

  // when true the Table of Contents will be collapsed and you will need to click each header to expand
  // default - false
  collapseToc: true,
}
```


Contributing
------------------------------------------------------------------------------

See the [Contributing](CONTRIBUTING.md) guide for details.


License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
