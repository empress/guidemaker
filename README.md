guidemaker
==============================================================================

This project is designed to be a fully-functional, static site implementation of a documentation site and is built on EmberJS with fully working out of the box SEO friendly output. It supports being hosted on AWS S3 or any other static site hosting solution.

This system is designed to have a core functionality provided by this repository/package and seperate packages that provide the themes and styling to your Documentation site.

- [Guidemaker Template] is a basic theme that is intended to provide a default style for new projects.
- [Guidemaker Ember Teamplate] is the official theme used for all Ember Learning Core Team projects

If you are interested in writing your own theme for Guidemaker please reach out to us and we can walk you through the process. Hopefully if there is enough interest we can provide basic instructions on how to build your own theme using this system.

If you want an example of the this "in production" then check out the [Ember Guides](https://guides.emberjs.com). If you use this in production let us know on Twitter and we can add a "built with guidemaker" wiki.

You do not need to be a web developer to be able to use this system. You just write markdown files and the rest of the work is performed by the EmberJS build system.

Quick Start
------------------------------------------------------------------------------

```sh
# if you don't have ember-cli installed already
npm install -g ember-cli

ember new super-docs
cd super-docs

# you can replace the template with the one you want to use
ember install guidemaker guidemaker-template
```

It will ask you if you want to update the index.html file and you should say yes 👍

To build the static output directory, run the standard build process for a production Ember application:

```sh
ember build -e production
```

This will generate a fully static output of your site in the dist folder.

If you want to see the system running on your local machine just run `npm start` and you will be able to navigate to http://localhost:4200 to see the documentation site in action.

Usage
------------------------------------------------------------------------------

[TODO: fill in this section]


Contributing
------------------------------------------------------------------------------

### Installation

* `git clone <repository-url>`
* `cd guidemaker`
* `npm install`

### Linting

* `npm run lint:js`
* `npm run lint:js -- --fix`

### Running tests

* `ember test` – Runs the test suite on the current Ember version
* `ember test --server` – Runs the test suite in "watch mode"
* `ember try:each` – Runs the test suite against multiple Ember versions

### Running the dummy application

* `ember serve`
* Visit the dummy application at [http://localhost:4200](http://localhost:4200).

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).

License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
