import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | service | guidemaker', function (hooks) {
  setupTest(hooks);

  test('can provide the guidemaker config', function (assert) {
    const service = this.owner.lookup('service:guidemaker');
    assert.strictEqual(service.title, 'Guidemaker Docs');
    assert.strictEqual(
      service.anyConfig,
      'Define any config specifics to your Guidemaker Docs'
    );
  });
});
