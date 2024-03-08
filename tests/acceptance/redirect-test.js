/* eslint-disable qunit/no-assert-equal, prettier/prettier */
import { module, test } from 'qunit';
import { visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | redirect', function(hooks) {
  setupApplicationTest(hooks);

  test('visiting /release/getting-started/redirect should send you to /release/getting-started/editing', async function(assert) {
    await visit('/release/getting-started/redirect');

    assert.equal(currentURL(), '/release/getting-started/editing');
  });
});
