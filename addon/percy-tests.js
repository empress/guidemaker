/* eslint-disable prettier/prettier, ember/no-get */
import { visit } from '@ember/test-helpers';
import { get } from '@ember/object';
import { percySnapshot } from 'ember-percy';

export default function (test) {
  test('visual regressions with Percy', async function(assert) {
    assert.expect(0);
    await visit('/release');

    let store = this.owner.lookup('service:store');
    let pages = store.peekAll('page');

    await pages.reduce(async (prev, section) => {
      await prev;

      return section.get('pages').reduce(async (prev, page) => {
        await prev;

        let url = get(page, 'url');

        await visit(`/release/${url}`);

        let name = `/${page.url}/index.html`;

        if (page.url.endsWith('index')) {
          name = `/${page.url}.html`;
        } else if (page.url.endsWith('index/')) {
          name = '/index.html';
        }

        await percySnapshot(name);
      }, Promise.resolve());
    }, Promise.resolve());
  });
}
