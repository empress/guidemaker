/* eslint-disable prettier/prettier */
const index = require('../index');
const { expect } = require('chai');

describe('netlifyRedirects() function in index', function () {
  it('returns a list of redirects', function() {
    let redirects = index.netlifyRedirects.call({
      ...index,
      project: {
        configPath() {
          return `${__dirname}/../tests/dummy/config/environment`
        }
      },
      app: {
        options: {},
      }
    });

    expect(redirects).to.deep.equal([
      '/          /release/',
      '/current/* /release/:splat',
      '/release/getting-started/awesomeness https://guides.emberjs.com/release/',
      '/v1.2.0/getting-started/awesomeness https://guides.emberjs.com/release/',
      '/release/getting-started/redirect /release/getting-started/editing',
      '/v1.2.0/getting-started/redirect /release/getting-started/editing',
      '/v1.0.0/getting-started/redirect /v1.0.0/getting-started/editing',
      '/v1.1.0/old-content /v1.1.0/getting-started'
    ]);
  })
});
