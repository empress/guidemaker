/* eslint-disable prettier/prettier */
const { expect } = require('chai');
const { mkdtempSync, readdirSync, rmSync, writeFileSync } = require('fs');
const { tmpdir } = require('os');
const { join } = require('path');

const root = join(__dirname, '../test-app');

describe('guidemaker/vite.mjs', function () {
  let vite;

  before(async function () {
    vite = await import('../vite.mjs');
  });

  it('lists the redirects of the pages', function () {
    expect(vite.netlifyRedirects({ root })).to.deep.equal([
      '/          /release/',
      '/current/* /release/:splat',
      '/release/getting-started/awesomeness https://guides.emberjs.com/release/',
      '/v1.2.0/getting-started/awesomeness https://guides.emberjs.com/release/',
      '/release/getting-started/redirect /release/getting-started/editing',
      '/v1.2.0/getting-started/redirect /release/getting-started/editing',
      '/v1.0.0/getting-started/redirect /v1.0.0/getting-started/editing',
      '/v1.1.0/old-content /v1.1.0/getting-started',
    ]);
  });

  it('lists the urls of the versions from premberVersionFilter', function () {
    let urls = vite.urls({ root, premberVersionFilter: 'v1.1.0' });

    expect(urls.filter((url) => url.split('/').length === 2)).to.deep.equal([
      '/v1.1.0',
      '/v1.2.0',
      '/release',
    ]);
    expect(urls).to.include('/v1.2.0/getting-started/editing');
    expect(urls).not.to.include('/v1.0.0/getting-started/editing');
  });

  it('writes the content of each version, its pages and the versions', function () {
    let files = vite.contentFiles({ root });

    expect(files.has('content/versions.json')).to.equal(true);
    expect(files.has('content/release/pages.json')).to.equal(true);
    expect(files.has('content/v1.2.0/pages.json')).to.equal(true);

    let page = JSON.parse(
      files.get('content/release/getting-started/editing.json')(),
    );

    expect(page.data.type).to.equal('contents');
    expect(page.data.id).to.equal('getting-started/editing');
    expect(Object.keys(page.data.attributes).sort()).to.deep.equal([
      'content',
      'description',
      'toc',
    ]);

    let versions = JSON.parse(files.get('content/versions.json')());

    expect(versions.data.attributes['current-version']).to.equal('v1.2.0');
  });

  describe('the page cache', function () {
    let cacheDir;
    let page = 'content/release/getting-started/editing.json';

    beforeEach(function () {
      cacheDir = mkdtempSync(join(tmpdir(), 'guidemaker-cache-'));
    });

    afterEach(function () {
      rmSync(cacheDir, { recursive: true, force: true });
    });

    it('keeps the JSON of each page, and reads it in the next build', function () {
      let built = vite.contentFiles({ root }).get(page)();

      expect(vite.contentFiles({ root, cacheDir }).get(page)()).to.equal(built);

      let [shard] = readdirSync(cacheDir);
      let [entry] = readdirSync(join(cacheDir, shard));

      writeFileSync(join(cacheDir, shard, entry), '"from the cache"');

      expect(vite.contentFiles({ root, cacheDir }).get(page)()).to.equal(
        '"from the cache"',
      );
    });

    it('uses no cache when cacheDir is false', function () {
      vite.contentFiles({ root, cacheDir: false }).get(page)();

      expect(readdirSync(cacheDir)).to.deep.equal([]);
    });
  });
});
