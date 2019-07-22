
1.5.0 / 2019-07-22
==================

  * move all queryRecord and query to findRecord() and findAll() #18 from @mansona

Note: Travis tests are now in Node 8 which does **not** need a major version bump. Guidemaker never supported Node 6

1.4.0 / 2019-04-09
==================

  * implementing netlifyRedirects() to automatically add netlify redirects from guidemaker redirects #16 from @mansona

1.3.0 / 2019-03-11
==================

  * add ltsVersions attribute to version model #13 from @locks
  * Add repository link #14 from @jrjohnson

1.2.0 / 2019-02-24
==================

  * exposing a percy-tests helper to make it easy to test each guide in latest version #12 from @mansona

1.1.0 / 2019-02-15
==================

  * Test internal redirects and implement external redirects #11 from @locks
  * Fixing typo #10 from @MelSumner

1.0.2 / 2019-02-08
==================

  * add release folder as numeric version to premberUrls #8 from @mansona

1.0.1 / 2019-02-08
==================

  * fixing premberUrls #7 from @mansona

1.0.0 / 2019-02-08
==================

  * Make it so that the currentVersion of the guides are in a `release` #6 from @locks
  * Making it possible to develop guidemaker locally (with dummy app) #5 from @mansona

0.7.1 / 2019-01-22
==================

  * adding compare-versions as a dependency
  * adding link-checker, toc-checker, and mocha to default blueprint
  * fixing page title update on navigation from @cah-danmonroe

0.6.1 / 2018-11-08
==================

  * fix issue when deploying to S3
  * fixing showdown-section-groups initializer

0.6.0 / 2018-11-08
==================

  * moving controllers, helpers, initializers, models, and routes to core from @mansona

0.5.0 / 2018-11-07
==================

  * Moving ember-meta implementation into guidemaker core from @mansona

0.4.1 / 2018-11-07
==================

  * adding index.html override to the default template to fix meta-data from @mansona

0.4.0 / 2018-11-04
==================

  * adding collapseToc setting from @mansona

0.3.0 / 2018-11-04
==================

  * Adding configuration options and config service #2 from @mansona
  * Updating using ember-cli-update

0.2.0 / 2018-11-02
==================

  * adding redirect to attributes from @mansona

0.1.1 / 2018-11-02
==================

  * fixing prember urls from @mansona

0.1.0 / 2018-11-02
==================

  * Adding some documentation and allowing local guides sources #1 from @mansona
