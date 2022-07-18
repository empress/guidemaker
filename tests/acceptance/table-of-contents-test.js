/* eslint-disable prettier/prettier */
import { module, test } from 'qunit';
import { visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | table of contents', function(hooks) {
  setupApplicationTest(hooks);

  test('table of contents shows only pages for its own version', async function(assert) {
    await visit('/v1.0.0/');
    assert.equal(currentURL(), '/v1.0.0/');
    assert.ok(document.querySelector('.toc-level-0').innerText.includes('Old Content'))
    await visit('/release');
    assert.equal(currentURL(), '/release');
    assert.notOk(document.querySelector('.toc-level-0').innerText.includes('Old Content'))
  });
});
