import { module, test } from 'qunit';
import { visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'dummy/tests/helpers';
import { selectChoose } from 'ember-power-select/test-support';

module('Acceptance | version', function (hooks) {
  setupApplicationTest(hooks);

  test('the version dropdown works', async function (assert) {
    await visit('/');
    await selectChoose('.ember-basic-dropdown-trigger', '1.1');

    assert.strictEqual(currentURL(), '/v1.1.0');
  });
});
