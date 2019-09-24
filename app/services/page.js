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
  let pageTreeNode = {
    page,
    parent,
    subNodes: new Map(),
  };

  let subNodes = pages.map(page => {
    if (page.id === 'index') {
      // special case for index, which always has a single sub page
      return { page: page.pages[0], parent: pageTreeNode };
    } else if (page.pages === undefined) {
      return { page, parent: pageTreeNode };
    } else {
      return buildPageTreeNode(page.pages, page, pageTreeNode, depth + 1);
    }
  });

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

    let id = node.page.id || node.page.url.split('/')[depth];

    assert(
      `You can only have one page/section with a given title at any level in the guides, received duplicate: ${id}`,
      !pageTreeNode.subNodes.has(id)
    );

    pageTreeNode.subNodes.set(id, node);
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

  currentNode: computed('content.id', function() {
    let contentId = get(this, 'content.id');

    if (!contentId) {
      return;
    }

    let path = contentId.split('/');

    let current = get(this, 'pageTree');

    for (let segment of path) {
      current = current.subNodes.get(segment);
    }

    return current;
  }),

  currentSection: computed('currentNode', function() {
    return get(this, 'currentNode.parent.page');
  }),

  /**
   * Find the TOC item that matches the current visible content. This is needed because the title comes
   * from the TOC and not the content. Also we use this to compute nextPage and previousPage
   * @return {Promise} the current page as a POJO
   */
  currentPage: computed('currentNode', function() {
    return get(this, 'currentNode.page');
  }),

  isFirstPage: computed('currentNode', function() {
    return (
      get(this, 'currentNode.page.url') === 'index' ||
      get(this, 'currentNode') === get(this, 'currentNode.parent.first')
    );
  }),

  isLastPage: computed('currentNode', function() {
    return (
      get(this, 'currentNode.page.url') === 'index' ||
      get(this, 'currentNode') === get(this, 'currentNode.parent.last')
    );
  }),

  previousPage: computed('currentNode', function() {
    return get(this, 'currentNode.prev.page');
  }),

  nextPage: computed('currentNode', function() {
    return get(this, 'currentNode.next.page');
  }),

  previousSection: computed('currentNode', function() {
    return get(this, 'currentNode.prev.parent.page');
  }),

  nextSection: computed('currentNode', function() {
    return get(this, 'currentNode.next.parent.page');
  }),
});
