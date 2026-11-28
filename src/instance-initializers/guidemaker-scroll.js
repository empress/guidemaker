import { next, scheduleOnce } from '@ember/runloop';
import { registerDestructor } from '@ember/destroyable';
import { guidFor } from '@ember/object/internals';

/**
 * After a transition, scroll to the top and move the focus to a hidden
 * message, so that a screen reader announces the new page, as ember-scroll
 * did. The back and forward buttons keep the browser's scroll position.
 */
class Scroll {
  doScroll = true;
  element = null;

  constructor(owner) {
    this.id = `${guidFor(owner)}-scroll-target`;
  }

  handlePopstate = () => {
    /**
     * popstate comes between routeWillChange and routeDidChange.
     */
    next(() => {
      this.doScroll = false;
    });
  };

  routeWillChange = () => {
    this.doScroll = true;
  };

  routeDidChange = (transition) => {
    /**
     * The first transition is the initial page load.
     */
    if (!transition.from) {
      this.doScroll = true;
      return;
    }

    next(() => {
      scheduleOnce('afterRender', this, this.scrollUp);
    });
  };

  scrollUp() {
    if (this.doScroll) {
      this.message().focus();
      window.scrollTo(0, 0);
    }

    this.doScroll = true;
  }

  message() {
    if (!this.element) {
      this.element = document.createElement('div');
      this.element.append(
        'The page navigation is complete. You may now navigate the page content as you wish.',
      );
      this.element.setAttribute('id', this.id);
      this.element.setAttribute('class', 'ember-scroll-navigation-message');
      this.element.setAttribute('tabindex', '-1');
      this.element.setAttribute('role', 'text');
      this.element.setAttribute(
        'style',
        'position: absolute; width: 1px; height: 1px; padding: 0; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0;',
      );
      document.body.prepend(this.element);
    }

    return this.element;
  }
}

export function initialize(owner) {
  if (typeof window === 'undefined' || typeof FastBoot !== 'undefined') {
    return;
  }

  let router = owner.lookup('service:router');
  let scroll = new Scroll(owner);

  window.addEventListener('popstate', scroll.handlePopstate);
  router.on('routeWillChange', scroll.routeWillChange);
  router.on('routeDidChange', scroll.routeDidChange);

  registerDestructor(owner, () => {
    window.removeEventListener('popstate', scroll.handlePopstate);
    router.off('routeWillChange', scroll.routeWillChange);
    router.off('routeDidChange', scroll.routeDidChange);
    scroll.element?.remove();
  });
}

export default {
  initialize,
};
