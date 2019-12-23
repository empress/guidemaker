import { module, test } from 'qunit';
import { get, set } from '@ember/object';

import PageService from 'dummy/services/page';

const mockPages = [
  {
    id: 'index',
    title: 'Introduction',
    pages: [
      {
        url: '',
        title: 'Getting Started',
      },
    ],
  },
  {
    id: 'toc-heading',
    title: 'Heading',
    isHeading: true,
  },
  {
    id: 'single-page-section',
    title: 'Single Page Section',
    pages: [
      {
        url: 'single-page-section/single-page',
        title: 'Single Page',
      },
    ],
  },
  {
    id: 'multi-page-section',
    title: 'Multi Page Section',
    pages: [
      {
        url: 'multi-page-section/page-one',
        title: 'Multi Page One',
      },
      {
        url: 'multi-page-section/page-two',
        title: 'Multi Page Two',
      },
      {
        url: 'multi-page-section/page-three',
        title: 'Multi Page Three',
      },
    ],
  },
  {
    id: 'multi-page-with-subsection',
    title: 'Multi Page with Subsection',
    pages: [
      {
        url: 'multi-page-with-subsection/page-one',
        title: 'Multi with Sub Page One',
      },
      {
        url: 'multi-page-with-subsection/page-two',
        title: 'Multi with Sub Page Two',
      },
      {
        url: 'multi-page-with-subsection/subsection',
        title: 'Subsection',
        pages: [
          {
            url: 'multi-page-with-subsection/subsection/subsection-page',
            title: 'Subsection Page',
          },
        ],
      },
      {
        url: 'multi-page-with-subsection/page-three',
        title: 'Multi with Sub Page Three',
      },
    ],
  },
  {
    id: 'subsection-as-first-and-last',
    title: 'Subsection as First and Last',
    pages: [
      {
        url: 'subsection-as-first-and-last/subsection',
        title: 'First and Last Subsection',
        pages: [
          {
            url: 'subsection-as-first-and-last/subsection/subsection-page',
            title: 'First and Last Subsection Page',
          },
        ],
      },
    ],
  },
  {
    id: 'multiple-subsections',
    title: 'Multiple Subsections',
    pages: [
      {
        url: 'multiple-subsections/subsection-one',
        title: 'Subsection One',
        pages: [
          {
            url: 'multiple-subsections/subsection-one/sub-subsection',
            title: 'Subsection One Page',
          },
        ],
      },
      {
        url: 'multiple-subsections/subsection-two',
        title: 'Subsection Two',
        pages: [
          {
            url: 'multiple-subsections/subsection-two/sub-subsection',
            title: 'Subsection Two Page',
          },
        ],
      },
    ],
  },
  {
    id: 'nested-subsections',
    title: 'Nested Subsections',
    pages: [
      {
        url: 'nested-subsections/subsection',
        title: 'Subsection',
        pages: [
          {
            url: 'nested-subsections/subsection/sub-subsection',
            title: 'Sub-Subsection',
            pages: [
              {
                url:
                  'nested-subsections/subsection/sub-subsection/sub-subsection-page',
                title: 'Sub-Subsection Page',
              },
            ],
          },
        ],
      },
    ],
  },
];

module('Unit | service | page', () => {
  test('can iterate forwards through pages', assert => {
    let page = PageService.create();
    let content = { id: 'index' };

    set(page, 'pages', mockPages);
    set(page, 'content', content);

    let pageTitles = [];
    let sectionTitles = [];

    let prevSectionTitles = [];
    let nextSectionTitles = [];

    let currentWasFirstPage = [];
    let currentWasLastPage = [];

    let prevWasFirstPage = [];
    let prevWasLastPage = [];

    let nextWasFirstPage = [];
    let nextWasLastPage = [];

    // eslint-disable-next-line no-constant-condition
    while (true) {
      pageTitles.push(get(page, 'currentPage.title'));
      sectionTitles.push(get(page, 'currentSection.title'));

      prevSectionTitles.push(get(page, 'previousSection.title'));
      nextSectionTitles.push(get(page, 'nextSection.title'));

      currentWasFirstPage.push(get(page, 'isFirstPage'));
      currentWasLastPage.push(get(page, 'isLastPage'));

      prevWasFirstPage.push(get(page, 'previousIsFirstPage'));
      prevWasLastPage.push(get(page, 'previousIsLastPage'));

      nextWasFirstPage.push(get(page, 'nextIsFirstPage'));
      nextWasLastPage.push(get(page, 'nextIsLastPage'));

      if (get(page, 'nextPage')) {
        let url = get(page, 'nextPage.url');
        set(content, 'id', url === '' ? 'index' : url);
      } else {
        break;
      }
    }

    assert.deepEqual(
      pageTitles,
      [
        'Getting Started',
        'Single Page',
        'Multi Page One',
        'Multi Page Two',
        'Multi Page Three',
        'Multi with Sub Page One',
        'Multi with Sub Page Two',
        'Subsection Page',
        'Multi with Sub Page Three',
        'First and Last Subsection Page',
        'Subsection One Page',
        'Subsection Two Page',
        'Sub-Subsection Page',
      ],
      'page titles'
    );

    assert.deepEqual(
      sectionTitles,
      [
        'Introduction',
        'Single Page Section',
        'Multi Page Section',
        'Multi Page Section',
        'Multi Page Section',
        'Multi Page with Subsection',
        'Multi Page with Subsection',
        'Subsection',
        'Multi Page with Subsection',
        'First and Last Subsection',
        'Subsection One',
        'Subsection Two',
        'Sub-Subsection',
      ],
      'current section titles'
    );

    assert.deepEqual(
      nextSectionTitles,
      [
        'Single Page Section',
        'Multi Page Section',
        'Multi Page with Subsection',
        'Multi Page with Subsection',
        'Multi Page with Subsection',
        'Subsection',
        'Subsection',
        'Multi Page with Subsection',
        'First and Last Subsection',
        'Subsection One',
        'Subsection Two',
        'Sub-Subsection',
        undefined,
      ],
      'next section titles'
    );

    assert.deepEqual(
      prevSectionTitles,
      [
        undefined,
        'Introduction',
        'Single Page Section',
        'Single Page Section',
        'Single Page Section',
        'Multi Page Section',
        'Multi Page Section',
        'Multi Page with Subsection',
        'Subsection',
        'Multi Page with Subsection',
        'First and Last Subsection',
        'Subsection One',
        'Subsection Two',
      ],
      'next section titles'
    );

    assert.deepEqual(
      currentWasFirstPage,
      [
        true,
        true,
        true,
        false,
        false,
        true,
        false,
        true,
        false,
        true,
        true,
        true,
        true,
      ],
      'current was the first page'
    );

    assert.deepEqual(
      currentWasLastPage,
      [
        true,
        true,
        false,
        false,
        true,
        false,
        false,
        true,
        true,
        true,
        true,
        true,
        true,
      ],
      'current was the last page'
    );

    assert.deepEqual(
      prevWasFirstPage,
      [
        false,
        true,
        true,
        true,
        false,
        false,
        true,
        false,
        true,
        false,
        true,
        true,
        true,
      ],
      'prev was the first page'
    );

    assert.deepEqual(
      prevWasLastPage,
      [
        false,
        true,
        true,
        false,
        false,
        true,
        false,
        false,
        true,
        true,
        true,
        true,
        true,
      ],
      'prev was the last page'
    );

    assert.deepEqual(
      nextWasFirstPage,
      [
        true,
        true,
        false,
        false,
        true,
        false,
        true,
        false,
        true,
        true,
        true,
        true,
        false,
      ],
      'next was the first page'
    );

    assert.deepEqual(
      nextWasLastPage,
      [
        true,
        false,
        false,
        true,
        false,
        false,
        true,
        true,
        true,
        true,
        true,
        true,
        false,
      ],
      'next was the last page'
    );
  });

  test('can iterate backwards through pages', assert => {
    let page = PageService.create();
    let content = {
      id: 'nested-subsections/subsection/sub-subsection/sub-subsection-page',
    };

    set(page, 'pages', mockPages);
    set(page, 'content', content);

    let pageTitles = [];
    let sectionTitles = [];

    let prevSectionTitles = [];
    let nextSectionTitles = [];

    let currentWasFirstPage = [];
    let currentWasLastPage = [];

    let prevWasFirstPage = [];
    let prevWasLastPage = [];

    let nextWasFirstPage = [];
    let nextWasLastPage = [];

    // eslint-disable-next-line no-constant-condition
    while (true) {
      pageTitles.push(get(page, 'currentPage.title'));
      sectionTitles.push(get(page, 'currentSection.title'));

      prevSectionTitles.push(get(page, 'previousSection.title'));
      nextSectionTitles.push(get(page, 'nextSection.title'));

      currentWasFirstPage.push(get(page, 'isFirstPage'));
      currentWasLastPage.push(get(page, 'isLastPage'));

      prevWasFirstPage.push(get(page, 'previousIsFirstPage'));
      prevWasLastPage.push(get(page, 'previousIsLastPage'));

      nextWasFirstPage.push(get(page, 'nextIsFirstPage'));
      nextWasLastPage.push(get(page, 'nextIsLastPage'));

      if (get(page, 'previousPage')) {
        let url = get(page, 'previousPage.url');
        set(content, 'id', url === '' ? 'index' : url);
      } else {
        break;
      }
    }

    assert.deepEqual(
      pageTitles,
      [
        'Sub-Subsection Page',
        'Subsection Two Page',
        'Subsection One Page',
        'First and Last Subsection Page',
        'Multi with Sub Page Three',
        'Subsection Page',
        'Multi with Sub Page Two',
        'Multi with Sub Page One',
        'Multi Page Three',
        'Multi Page Two',
        'Multi Page One',
        'Single Page',
        'Getting Started',
      ],
      'page titles'
    );

    assert.deepEqual(
      sectionTitles,
      [
        'Sub-Subsection',
        'Subsection Two',
        'Subsection One',
        'First and Last Subsection',
        'Multi Page with Subsection',
        'Subsection',
        'Multi Page with Subsection',
        'Multi Page with Subsection',
        'Multi Page Section',
        'Multi Page Section',
        'Multi Page Section',
        'Single Page Section',
        'Introduction',
      ],
      'current section titles'
    );

    assert.deepEqual(
      nextSectionTitles,
      [
        undefined,
        'Sub-Subsection',
        'Subsection Two',
        'Subsection One',
        'First and Last Subsection',
        'Multi Page with Subsection',
        'Subsection',
        'Subsection',
        'Multi Page with Subsection',
        'Multi Page with Subsection',
        'Multi Page with Subsection',
        'Multi Page Section',
        'Single Page Section',
      ],
      'next section titles'
    );

    assert.deepEqual(
      prevSectionTitles,
      [
        'Subsection Two',
        'Subsection One',
        'First and Last Subsection',
        'Multi Page with Subsection',
        'Subsection',
        'Multi Page with Subsection',
        'Multi Page Section',
        'Multi Page Section',
        'Single Page Section',
        'Single Page Section',
        'Single Page Section',
        'Introduction',
        undefined,
      ],
      'next section titles'
    );

    assert.deepEqual(
      currentWasFirstPage,
      [
        true,
        true,
        true,
        true,
        false,
        true,
        false,
        true,
        false,
        false,
        true,
        true,
        true,
      ],
      'current was the first page'
    );

    assert.deepEqual(
      currentWasLastPage,
      [
        true,
        true,
        true,
        true,
        true,
        true,
        false,
        false,
        true,
        false,
        false,
        true,
        true,
      ],
      'current was the first page'
    );

    assert.deepEqual(
      prevWasFirstPage,
      [
        true,
        true,
        true,
        false,
        true,
        false,
        true,
        false,
        false,
        true,
        true,
        true,
        false,
      ],
      'prev was the first page'
    );

    assert.deepEqual(
      prevWasLastPage,
      [
        true,
        true,
        true,
        true,
        true,
        false,
        false,
        true,
        false,
        false,
        true,
        true,
        false,
      ],
      'prev was the last page'
    );

    assert.deepEqual(
      nextWasFirstPage,
      [
        false,
        true,
        true,
        true,
        true,
        false,
        true,
        false,
        true,
        false,
        false,
        true,
        true,
      ],
      'next was the first page'
    );

    assert.deepEqual(
      nextWasLastPage,
      [
        false,
        true,
        true,
        true,
        true,
        true,
        true,
        false,
        false,
        true,
        false,
        false,
        true,
      ],
      'next was the last page'
    );
  });

  test('throws on duplicate page definitions', assert => {
    let page = PageService.create();
    let content = { id: 'index' };

    set(page, 'content', content);
    set(page, 'pages', [
      {
        id: 'index',
        title: 'Introduction',
        pages: [
          {
            url: '',
            title: 'Introduction',
          },
        ],
      },
      {
        id: 'index',
        title: 'Introduction',
        pages: [
          {
            url: '',
            title: 'Introduction',
          },
        ],
      },
    ]);

    assert.throws(() => {
      get(page, 'currentPage');
    }, /You can only have one page\/section with a given title at any level in the guides, received duplicate: index/);
  });

  test('throws if subpages do not include parent page paths', assert => {
    let page = PageService.create();
    let content = { id: 'index' };

    set(page, 'content', content);
    set(page, 'pages', [
      {
        id: 'index',
        title: 'Introduction',
        pages: [
          {
            url: 'bar/foo',
            title: 'Introduction',
          },
        ],
      },
    ]);

    assert.throws(() => {
      get(page, 'currentPage');
    }, /Received an invalid page url\/id: bar\/foo, whose parent url was: index./);
  });

  test('throws if passed `index` page with non-empty url string', assert => {
    let page = PageService.create();
    let content = { id: 'index' };

    set(page, 'content', content);
    set(page, 'pages', [
      {
        id: 'index',
        title: 'Introduction',
        pages: [
          {
            url: 'index/foo',
            title: 'Introduction',
          },
        ],
      },
    ]);

    assert.throws(() => {
      get(page, 'currentPage');
    }, /The `index` section of the guides must contain exactly one subpage with `url: ''/);
  });

  test('throws if passed `index` page with more than one sub page', assert => {
    let page = PageService.create();
    let content = { id: 'index' };

    set(page, 'content', content);
    set(page, 'pages', [
      {
        id: 'index',
        title: 'Introduction',
        pages: [
          {
            url: '',
            title: 'Introduction',
          },
          {
            url: 'index/2',
            title: 'Introduction Part 2',
          },
        ],
      },
    ]);

    assert.throws(() => {
      get(page, 'currentPage');
    }, /Assertion Failed: The `index` section of the guides must contain exactly one subpage with `url: ''`/);
  });

  test('does not throw if attempting to set the current page to non-existent page', assert => {
    let page = PageService.create();
    let content = { id: 'foo' };

    set(page, 'content', content);
    set(page, 'pages', [
      {
        id: 'index',
        title: 'Introduction',
        pages: [
          {
            url: '',
            title: 'Getting Started',
          },
        ],
      },
    ]);

    assert.equal(get(page, 'previousPage'), undefined);
    assert.equal(get(page, 'currentPage'), undefined);
    assert.equal(get(page, 'nextPage'), undefined);

    assert.equal(get(page, 'previousSection'), undefined);
    assert.equal(get(page, 'currentSection'), undefined);
    assert.equal(get(page, 'nextSection'), undefined);

    assert.equal(get(page, 'isFirstPage'), false);
    assert.equal(get(page, 'isLastPage'), false);
    assert.equal(get(page, 'previousIsFirstPage'), false);
    assert.equal(get(page, 'previousIsLastPage'), false);
    assert.equal(get(page, 'nextIsFirstPage'), false);
    assert.equal(get(page, 'nextIsLastPage'), false);
  });
});
