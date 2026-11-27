import { module, test } from 'qunit';
import { shortenVersion } from 'guidemaker/helpers/shorten-version';

module('Unit | Helper | shorten-version', function () {
  test('it drops the v and the patch version', function (assert) {
    assert.deepEqual(
      ['v1.2.0', 'v1.2', 'v10.11.12', 'release'].map((version) =>
        shortenVersion([version]),
      ),
      ['1.2', '1.2', '10.11', 'release'],
    );
  });
});
