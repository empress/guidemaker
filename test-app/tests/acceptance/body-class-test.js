import { module, test } from 'qunit';
import { visit } from '@ember/test-helpers';
import { setupApplicationTest } from 'test-app/tests/helpers';

module('Acceptance | body class', function (hooks) {
  setupApplicationTest(hooks);

  test('the body has the names of the active routes', async function (assert) {
    await visit('/release/getting-started/editing');

    assert.strictEqual(
      document.body.className,
      'version show version-show application',
    );

    await visit('/release');

    assert.strictEqual(
      document.body.className,
      'version index version-index application',
    );
  });
});
