import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { formatURL } from 'dummy/locations/trailing-history';

module('Unit | Locations | trailing history', function (hooks) {
  setupTest(hooks);

  test('supports query params', function (assert) {
    assert.deepEqual(formatURL('/foo?bar=baz'), '/foo/?bar=baz');
  });

  test('supports anchors', function (assert) {
    assert.deepEqual(formatURL('/foo#placeholder'), '/foo/#placeholder');
  });

  test('supports query params and anchors', function (assert) {
    assert.deepEqual(
      formatURL('/foo?bar=baz#placeholder'),
      '/foo/?bar=baz#placeholder',
    );
  });
});
