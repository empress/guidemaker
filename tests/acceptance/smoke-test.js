import { module, test } from 'qunit';
import { visit } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | smoke', function (hooks) {
  setupApplicationTest(hooks);

  test('visiting every page', async function (assert) {
    assert.expect(0);
    await visit('/release');

    let store = this.owner.lookup('service:store');
    let pages = store.peekAll('page');

    // cater for older ember-data versions
    if (pages.toArray) {
      pages = pages.toArray();
    }

    for (let section of pages) {
      for (let page of section?.pages ?? []) {
        await visit(`/release/${page.url}`);
      }
    }
  });
});
