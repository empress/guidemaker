# How To Contribute

## Installation

* `git clone <repository-url>`
* `cd guidemaker`
* `pnpm install`

## Linting

* `pnpm lint`
* `pnpm lint:fix`

## Running tests

* `pnpm test` – Runs the node tests of `vite.mjs`, builds the addon, and runs the tests of `test-app` in Chrome
* `pnpm test:node` – Runs only the node tests
* `pnpm test:ember` – Builds the addon, and runs only the tests of `test-app`

The test app has a copy of the addon (pnpm `injectWorkspacePackages`). `pnpm test:ember` runs `pnpm install` after the build to refresh the copy.

To run the tests on other Ember versions, apply a scenario of `test-app/.try.mjs`:

* `cd test-app && pnpm dlx @embroider/try apply ember-lts-5.12`
* `cd .. && pnpm install --no-lockfile && pnpm test:ember`

## Running the test application

* `pnpm build && pnpm install`
* `pnpm --filter test-app start`
* Visit the test application at the url that Vite prints.
