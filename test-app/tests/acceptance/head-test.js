import { module, test } from 'qunit';
import { visit } from '@ember/test-helpers';
import { setupApplicationTest } from 'test-app/tests/helpers';

/**
 * The elements that ember-cli-head renders between its two marker tags.
 */
function headElements() {
  let start = document.head.querySelector('meta[name="ember-cli-head-start"]');
  let end = document.head.querySelector('meta[name="ember-cli-head-end"]');
  let elements = [];

  for (
    let node = start.nextSibling;
    node && node !== end;
    node = node.nextSibling
  ) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      elements.push(node.outerHTML);
    }
  }

  return elements;
}

const DESCRIPTION =
  'This is designed to add some documentation on how to get started editing your bits and pieces';

module('Acceptance | head', function (hooks) {
  setupApplicationTest(hooks);

  test('a page of the release has its title, description and urls', async function (assert) {
    await visit('/release/getting-started/editing');

    assert.deepEqual(headElements(), [
      '<title>Editing - Getting Started - Guidemaker Docs</title>',
      `<meta name="description" content="${DESCRIPTION}">`,
      '<meta name="referrer" content="unsafe-url">',
      '<link rel="canonical" href="https://guides.example.com/release/getting-started/editing/">',
      '<meta property="og:title" content="Editing - Getting Started - Guidemaker Docs">',
      '<meta property="og:url" content="https://guides.example.com/v1.2.0/getting-started/editing/">',
      `<meta property="og:description" content="${DESCRIPTION}">`,
      '<meta property="og:type" content="website">',
      '<meta name="twitter:card" content="summary">',
      '<meta name="twitter:title" content="Editing - Getting Started - Guidemaker Docs">',
      '<meta name="twitter:url" content="https://guides.example.com/v1.2.0/getting-started/editing/">',
      `<meta name="twitter:description" content="${DESCRIPTION}">`,
    ]);
  });

  test('a page of an old version points its canonical url to the release', async function (assert) {
    await visit('/v1.0.0/getting-started/editing');

    assert.deepEqual(headElements(), [
      '<title>Editing - Getting Started - Guidemaker Docs</title>',
      `<meta name="description" content="${DESCRIPTION}">`,
      '<meta name="referrer" content="unsafe-url">',
      '<link rel="canonical" href="https://guides.example.com/release/getting-started/editing/">',
      '<meta property="og:title" content="Editing - Getting Started - Guidemaker Docs">',
      '<meta property="og:url" content="https://guides.example.com/v1.0.0/getting-started/editing/">',
      `<meta property="og:description" content="${DESCRIPTION}">`,
      '<meta property="og:type" content="website">',
      '<meta name="twitter:card" content="summary">',
      '<meta name="twitter:title" content="Editing - Getting Started - Guidemaker Docs">',
      '<meta name="twitter:url" content="https://guides.example.com/v1.0.0/getting-started/editing/">',
      `<meta name="twitter:description" content="${DESCRIPTION}">`,
    ]);
  });
});
