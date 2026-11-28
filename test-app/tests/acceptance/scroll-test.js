import { module, test } from 'qunit';
import { visit } from '@ember/test-helpers';
import { setupApplicationTest } from 'test-app/tests/helpers';

module('Acceptance | scroll', function (hooks) {
  setupApplicationTest(hooks);

  test('a transition moves the focus to the navigation message', async function (assert) {
    await visit('/release');

    assert.strictEqual(
      document.querySelector('.ember-scroll-navigation-message'),
      null,
      'the first page load keeps the focus',
    );

    await visit('/release/getting-started/editing');

    let message = document.querySelector('.ember-scroll-navigation-message');

    assert.strictEqual(document.activeElement, message);
    assert.strictEqual(
      message.textContent,
      'The page navigation is complete. You may now navigate the page content as you wish.',
    );
    assert.strictEqual(window.scrollY, 0);
  });
});
