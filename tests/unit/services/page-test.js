import { module, test } from 'qunit';
import { get, set } from '@ember/object';

import PageService from 'dummy/services/page';

const mockPages = [
  {
    id: 'index',
    title: 'Introduction',
    pages: [
      {
        url: 'index',
        title: 'Introduction',
      },
    ],
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
        title: 'Subsection',
        pages: [
          {
            url: 'subsection-as-first-and-last/subsection/subsection-page',
            title: 'Subsection Page',
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
    let wasFirstPage = [];
    let wasLastPage = [];

    // eslint-disable-next-line no-constant-condition
    while (true) {
      pageTitles.push(get(page, 'currentPage.title'));
      sectionTitles.push(get(page, 'currentSection.title'));
      wasFirstPage.push(get(page, 'isFirstPage'));
      wasLastPage.push(get(page, 'isLastPage'));

      if (get(page, 'nextPage')) {
        set(content, 'id', get(page, 'nextPage.url'));
      } else {
        break;
      }
    }

    assert.deepEqual(pageTitles, [
      'Introduction',
      'Single Page',
      'Multi Page One',
      'Multi Page Two',
      'Multi Page Three',
      'Multi with Sub Page One',
      'Multi with Sub Page Two',
      'Subsection Page',
      'Multi with Sub Page Three',
      'Subsection Page',
      'Subsection One Page',
      'Subsection Two Page',
      'Sub-Subsection Page',
    ]);

    assert.deepEqual(sectionTitles, [
      undefined,
      'Single Page Section',
      'Multi Page Section',
      'Multi Page Section',
      'Multi Page Section',
      'Multi Page with Subsection',
      'Multi Page with Subsection',
      'Subsection',
      'Multi Page with Subsection',
      'Subsection',
      'Subsection One',
      'Subsection Two',
      'Sub-Subsection',
    ]);

    assert.deepEqual(wasFirstPage, [
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
    ]);

    assert.deepEqual(wasLastPage, [
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
    ]);
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
    let wasFirstPage = [];
    let wasLastPage = [];

    // eslint-disable-next-line no-constant-condition
    while (true) {
      pageTitles.push(get(page, 'currentPage.title'));
      sectionTitles.push(get(page, 'currentSection.title'));
      wasFirstPage.push(get(page, 'isFirstPage'));
      wasLastPage.push(get(page, 'isLastPage'));

      if (get(page, 'previousPage')) {
        set(content, 'id', get(page, 'previousPage.url'));
      } else {
        break;
      }
    }

    assert.deepEqual(pageTitles, [
      'Sub-Subsection Page',
      'Subsection Two Page',
      'Subsection One Page',
      'Subsection Page',
      'Multi with Sub Page Three',
      'Subsection Page',
      'Multi with Sub Page Two',
      'Multi with Sub Page One',
      'Multi Page Three',
      'Multi Page Two',
      'Multi Page One',
      'Single Page',
      'Introduction',
    ]);

    assert.deepEqual(sectionTitles, [
      'Sub-Subsection',
      'Subsection Two',
      'Subsection One',
      'Subsection',
      'Multi Page with Subsection',
      'Subsection',
      'Multi Page with Subsection',
      'Multi Page with Subsection',
      'Multi Page Section',
      'Multi Page Section',
      'Multi Page Section',
      'Single Page Section',
      undefined,
    ]);

    assert.deepEqual(wasFirstPage, [
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
    ]);

    assert.deepEqual(wasLastPage, [
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
    ]);
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
            url: 'index',
            title: 'Introduction',
          },
        ],
      },
      {
        id: 'index',
        title: 'Introduction',
        pages: [
          {
            url: 'index',
            title: 'Introduction',
          },
        ],
      },
    ]);

    assert.throws(() => {
      get(page, 'currentPage');
    }, /You can only have one page\/section with a given title at any level in the guides, received duplicate: index/);
  });
});
