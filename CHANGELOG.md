# Guidemaker Changelog

## Release (2024-05-03)

guidemaker 4.0.2 (patch)

#### :bug: Bug Fix
* `guidemaker`
  * [#109](https://github.com/empress/guidemaker/pull/109) remove ember-data transform re-exports ([@mansona](https://github.com/mansona))

#### :house: Internal
* `guidemaker`
  * [#112](https://github.com/empress/guidemaker/pull/112) update to v5.8 with ember-cli-update ([@mansona](https://github.com/mansona))
  * [#110](https://github.com/empress/guidemaker/pull/110) add ember-data to ember-try scenarios ([@mansona](https://github.com/mansona))

#### Committers: 1
- Chris Manson ([@mansona](https://github.com/mansona))

## Release (2024-03-08)

guidemaker 4.0.1 (patch)

#### :bug: Bug Fix
* `guidemaker`
  * [#105](https://github.com/empress/guidemaker/pull/105) fix the location of the shorten-version helper ([@mansona](https://github.com/mansona))

#### Committers: 1
- Chris Manson ([@mansona](https://github.com/mansona))

## Release (2024-03-08)

guidemaker 4.0.0 (major)

#### :boom: Breaking Change
* `guidemaker`
  * [#91](https://github.com/empress/guidemaker/pull/91) update to v5.4 with ember-cli-update and drop support for Ember < 3.28 ([@mansona](https://github.com/mansona))
  * [#103](https://github.com/empress/guidemaker/pull/103) drop support for node < 18 ([@mansona](https://github.com/mansona))

#### :house: Internal
* `guidemaker`
  * [#102](https://github.com/empress/guidemaker/pull/102) swap to pnpm ([@mansona](https://github.com/mansona))

#### Committers: 1
- Chris Manson ([@mansona](https://github.com/mansona))
## Release (2023-12-18)

guidemaker 3.3.1 (patch)

#### :bug: Bug Fix
* [#100](https://github.com/empress/guidemaker/pull/100) Fix `ember-data:deprecate-array-like` deprecation ([@bartocc](https://github.com/bartocc))

#### Committers: 1
- Julien Palmas ([@bartocc](https://github.com/bartocc))
## Release (2023-12-04)

guidemaker 3.3.0 (minor)

#### :rocket: Enhancement
* [#94](https://github.com/empress/guidemaker/pull/94) Fix implicit-injections and routing.transition-methods deprecations ([@bartocc](https://github.com/bartocc))

#### :house: Internal
* [#98](https://github.com/empress/guidemaker/pull/98) update and fix release-plan ([@mansona](https://github.com/mansona))
* [#97](https://github.com/empress/guidemaker/pull/97) Setup release-plan ([@mansona](https://github.com/mansona))

#### Committers: 2
- Chris Manson ([@mansona](https://github.com/mansona))
- Julien Palmas ([@bartocc](https://github.com/bartocc))

## v3.2.1 (2023-09-30)

#### :bug: Bug Fix
* [#93](https://github.com/empress/guidemaker/pull/93) Removed `included()` method, which only added `ember-prism` options.  ([@lupestro](https://github.com/lupestro))

#### Committers: 1
- Ralph Mack ([@lupestro](https://github.com/lupestro))

3.2.0 / 2023-06-30
==================

* Load the showdown config from environment and pass it to broccoli-static-site-json #92 from @mansona

3.1.0 / 2023-04-21
==================

* Add ToC for each page #88 from @mansona

3.0.0 / 2022-08-14
==================

* update dependencies to fix CI #74 from @mansona
* fix transitionTo deprecations #76 from @mansona
* fix ember-try for pre-releases #75 from @mansona
* update to ember-auto-import@2 #73 from @mansona
* Fix deprecations #71 from @mansona
* add no-deprecations ember-try scenarios #58 from @mansona
* Update ember-get-config #63 from @mansona
* breaking: drop support for Ember &lt; 3.16 - Update ember to 3.28 using ember-cli-update #68 from @mansona
* breaking: drop support for Node &lt; 14 #64 from @mansona

3.0.0-1 / 2022-08-10
==================

* update to ember-auto-import@2 #73 from @mansona

3.0.0-0 (prerelease) / 2022-07-20
==================

* Fix deprecations #71 from @mansona
* add no-deprecations ember-try scenarios #58 from @mansona
* Update ember-get-config #63 from @mansona
* breaking: drop support for Ember &lt; 3.16 - Update ember to 3.28 using ember-cli-update #68 from @mansona
* breaking: drop support for Node &lt; 14 #64 from @mansona

2.6.0 / 2021-07-22
==================

  * use ember-scroll for scroll-on-navigate to improve default behaviour and accessibility  #57 from @mansona
  * add sourceBranch docs #56 from @mansona

2.5.0 / 2021-04-22
==================

  * add sourceBranch as a guidemaker config param #54 from @mansona
  * move from Travis to Github CI #55 from @mansona
  * resolve default serializer deprecation #41 from @jenweber


2.4.0 / 2020-03-10
==================

  * fix "slow index" bug for nested sections #39 from @mansona
  * update using ember-cli-update #39 from @mansona

2.3.0 / 2020-02-16
==================

  * add `premberVersionFilter` functionality to allow for partial builds #33 from @mansona

2.2.1 / 2020-02-16
==================

  * bugfix - cannot read length of undefined #38 from @jenweber

2.2.0 / 2020-01-29
==================

  * Fix initial install using empress-blueprint-helpers to simplify blueprint  #36 from @mansona
  * fix extra 404 when visiting index pages #37 from @mansona

2.1.0 / 2020-01-09
==================

  * Update ember and broccoli-static-site-json #32 from @mansona
  * Adds is_heading so ToC items can specify that they are headings #28 from @pzuraq

2.0.2 / 2019-10-21
==================

  * revert to using query for the Table of Contents #25 from @jenweber

2.0.1 / 2019-10-02
==================

  * Fixes a bug where the page service would throw errors if the page didn't
    exist in the ToC, but was a valid page URL.

2.0.0 / 2019-09-30
==================

  * Adds the ability to nest guide sections
  * Change in behavior for the `page` service, `nextPage` and `previousPage` are now never nullish between sections, they always represent the actual next and previous page.
  * New APIs on the `page` service:
    * `nextIsFirstPage`
    * `nextIsLastPage`
    * `previousIsFirstPage`
    * `previousIsLastPage`

1.6.0 / 2019-08-09
==================

  * fixing issue with external redirects in Prember #20 from @mansona
  * adding prember for dummy app for netlify preview
  * fixing redirects with versioned guides
  * using versions for sample data
  * move location of versions.yml and deprecate old location
  * implementing node tests for redirects

1.5.1 / 2019-07-22
==================

  * force a reload when changing versions from @mansona

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
