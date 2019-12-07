import Service from '@ember/service';
import { inject as service } from '@ember/service';
import { get, computed } from '@ember/object';
import { assert } from '@ember/debug';

/**
 * Build up a tree of the pages that matches the URL structure:
 *
 * {
 *   index: { page: Page, next: PageTreeNode }
 *   'getting-started': {
 *     first: PageTreeNode,
 *     last: PageTreeNode,
 *     parent: PageTreeNode,
 *     'core-concepts': { page: Page, prev: PageTreeNode, next: PageTreeNode },
 *     ...
 *   }
 * }
 *
 * TypeScript Type:
 *
 * interface Node {
 *   page?: Page,
 *   parent: Node,
 * }
 *
 * interface SectionNode extends Node {
 *   subNodes: Map<string, Node>,
 *   first: PageNode,
 *   last: PageNode,
 * }
 *
 * interface PageNode extends Node {
 *   prev: PageNode,
 *   next: PageNode,
 * }
 */
function buildPageTreeNode(pages, page, parent, depth = 0) {
  let filteredPages = pages.filter(page => !page.isHeading);

  let pageTreeNode = {
    page,
    parent,
    subNodes: new Map(),
  };

  let subNodes = filteredPages.map(page =>
    page.pages
      ? buildPageTreeNode(page.pages, page, pageTreeNode, depth + 1)
      : { page, parent: pageTreeNode }
  );

  subNodes.forEach((node, index) => {
    if (index === 0) {
      pageTreeNode.first = node.first || node;
    }

    if (index === subNodes.length - 1) {
      pageTreeNode.last = node.last || node;
    }

    let nextNode = subNodes[index + 1];

    if (nextNode) {
      let prevPage = node.last || node;
      let nextPage = nextNode.first || nextNode;

      prevPage.next = nextPage;
      nextPage.prev = prevPage;
    }

    let url = node.page.id || node.page.url;
    let lastSlash = url.lastIndexOf('/');
    let segment = url.substr(lastSlash + 1);

    assert(
      `Received an invalid page url/id: ${url}, whose parent url was: ${page.id ||
        page.url}. Page urls/ids must be equal to the page url/id of their parent page, plus an additional segment for the page itself. The only exception is the main 'index' page, which has a single subpage with whose url is the empty string, ''`,
      url === '' || !page || url.substr(0, lastSlash) === (page.id || page.url)
    );

    assert(
      `You can only have one page/section with a given title at any level in the guides, received duplicate: ${segment}`,
      !pageTreeNode.subNodes.has(segment)
    );

    pageTreeNode.subNodes.set(segment, node);
  });

  return pageTreeNode;
}

export default Service.extend({
  router: service(),
  fastboot: service(),
  headData: service(),

  pages: null,

  pageTree: computed('pages', function() {
    let { pages } = this;
    return buildPageTreeNode(pages.toArray ? pages.toArray() : pages);
  }),

  _currentNode: computed('content.id', function() {
    let contentId = get(this, 'content.id');

    if (!contentId) {
      return;
    }

    let path = contentId.split('/');

    let current = get(this, 'pageTree');

    for (let segment of path) {
      current = current.subNodes.get(segment);

      if (!current) {
        return;
      }
    }

    if (get(current, 'page.id') === 'index') {
      // special case for the index section - there should always be only
      // exactly 1 page in the "index" section, and it should be the default
      assert(
        "The `index` section of the guides must contain exactly one subpage with `url: ''`",
        current.subNodes.size === 1 && current.subNodes.has('')
      );

      return current.subNodes.get('');
    }

    return current;
  }),

  currentSection: computed('_currentNode', function() {
    return get(this, '_currentNode.parent.page');
  }),

  /**
   * Find the TOC item that matches the current visible content. This is needed because the title comes
   * from the TOC and not the content. Also we use this to compute nextPage and previousPage
   * @return {Promise} the current page as a POJO
   */
  currentPage: computed('_currentNode', function() {
    return get(this, '_currentNode.page');
  }),

  isFirstPage: computed('_currentNode', function() {
    return (
      get(this, '_currentNode') !== undefined &&
      get(this, '_currentNode') === get(this, '_currentNode.parent.first')
    );
  }),

  isLastPage: computed('_currentNode', function() {
    return (
      get(this, '_currentNode') !== undefined &&
      get(this, '_currentNode') === get(this, '_currentNode.parent.last')
    );
  }),

  previousPage: computed('_currentNode', function() {
    return get(this, '_currentNode.prev.page');
  }),

  previousIsFirstPage: computed('_currentNode', function() {
    return (
      get(this, '_currentNode.prev') !== undefined &&
      get(this, '_currentNode.prev') ===
        get(this, '_currentNode.prev.parent.first')
    );
  }),

  previousIsLastPage: computed('_currentNode', function() {
    return (
      get(this, '_currentNode.prev') !== undefined &&
      get(this, '_currentNode.prev') ===
        get(this, '_currentNode.prev.parent.last')
    );
  }),

  nextPage: computed('_currentNode', function() {
    return get(this, '_currentNode.next.page');
  }),

  nextIsFirstPage: computed('_currentNode', function() {
    return (
      get(this, '_currentNode.next') !== undefined &&
      get(this, '_currentNode.next') ===
        get(this, '_currentNode.next.parent.first')
    );
  }),

  nextIsLastPage: computed('_currentNode', function() {
    return (
      get(this, '_currentNode.next') !== undefined &&
      get(this, '_currentNode.next') ===
        get(this, '_currentNode.next.parent.last')
    );
  }),

  previousSection: computed('_currentNode', function() {
    let current = get(this, '_currentNode');
    let currentSection = get(this, 'currentSection');

    while (current) {
      if (get(current, 'parent.page') !== currentSection) {
        return get(current, 'parent.page');
      }

      current = current.prev;
    }
  }),

  nextSection: computed('_currentNode', function() {
    let current = get(this, '_currentNode');
    let currentSection = get(this, 'currentSection');

    while (current) {
      if (get(current, 'parent.page') !== currentSection) {
        return get(current, 'parent.page');
      }

      current = current.next;
    }
  }),
});
