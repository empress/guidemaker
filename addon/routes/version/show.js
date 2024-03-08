/* eslint-disable prettier/prettier */
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { set } from '@ember/object';
import { hash } from 'rsvp';

function isExternalRedirect(redirect) {
  return redirect.match(/^https?:\/\//);
}

/**
 * This function is designed  to normalise a simple path that is expected to hit
 * an index and thus avoiding the extra 404 request when visiting the first
 * part of a section
 *
 * This is not designed to be perfect and will only work in a majority of cases
 * as it will fall back to the existing behaviour if it is unable to normalise
 * the path
 *
 * @param  {[string]} path        [the current path]
 * @param  {[RecordArray]} pages  [the pages objectfor the current version]
 * @return {[string]}             [a normalised path if we think it needs to be normalised]
 */
function normalisePath(path, pages) {
  // walk the structure of the pages object to find any matching indexes
  function walkPages(path, pages) {
    if (pages) {
      if (pages.find((page) => page.url === `${path}/index`)) {
        return true;
      }

      // if any of the nested pages have a matching page (recursive)
      return pages.find((page) => {
        if (page.pages) {
          return walkPages(path, page.pages);
        }
      });
    }
  }

  if (walkPages(path, pages)) {
    return `${path}/index`;
  }

  return path;
}

export default class VersionShowRoute extends Route {
  @service page;
  @service store;
  @service router;

  model(params) {
    let path = params.path.replace(/\/$/, '');

    if (path === 'index') {
      return this.router.transitionTo('version');
    }

    if (path.endsWith('/index')) {
      return this.router.transitionTo(
        'version.show',
        path.replace(/\/index$/, '')
      );
    }

    const { version, currentVersion, pages } = this.modelFor('version');

    path = normalisePath(path, pages);

    let contentPromise = this.store
      .queryRecord('content', {
        path,
        version,
      })
      .catch((e) => {
        if (['404', '403'].includes(e?.errors?.[0]?.status)) {
          return this.store.queryRecord('content', {
            path: `${path}/index`,
            version,
          });
        }
        throw e;
      });

    return hash({
      content: contentPromise,
      pages,
      path,
      version,
      currentVersion,
    });
  }
  afterModel(model) {
    let redirect = model.content.redirect;

    if (redirect) {
      if (isExternalRedirect(redirect)) {
        // i.e. don't do in fastboot or prember
        if (window.location) {
          window.location.replace(redirect);
        }
      } else {
        this.router.transitionTo('version.show', redirect);
      }
    }

    let content = model.content;
    set(this.page, 'content', content);
    let version = model.version;
    set(this.page, 'currentVersion', version);
  }
}
