import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { get, set } from '@ember/object';
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
  let parts = path.split('/');

  let currentPage = pages.find(page => page.id === parts[0]);


  // if the current page is not found then we might be in a redirect file for a
  // section that has been removed from the ToC. In this case we're not going to
  // be able to normalise the path so just return it without change.
  if(!currentPage) {
    return path;
  }

  if (
    parts.length === 1
    && currentPage.pages
    && currentPage.pages.find(page => page.url === `${path}/index`)
  ) {
    return `${path}/index`
  }

  return path;
}

export default Route.extend({
  page: service(),
  model(params) {
    let path = params.path.replace(/\/$/, '');

    if (path === 'index') {
      return this.transitionTo('version');
    }

    if (path.endsWith('/index')) {
      return this.transitionTo('version.show', path.replace(/\/index$/, ''))
    }

    const {
      version,
      currentVersion,
      pages,
    } = this.modelFor('version');

    path = normalisePath(path, pages);

    let contentPromise = this.store.queryRecord('content', {
      path,
      version
    })
      .catch((e) => {
        if (['404', '403'].includes(get(e, 'errors.0.status'))) {
          return this.store.queryRecord('content', {
            path: `${path}/index`,
            version
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
    })
  },
  afterModel(model) {
    let redirect = get(model.content, 'redirect');

    if (redirect) {
      if (isExternalRedirect(redirect)) {
        // i.e. don't do in fastboot or prember
        if (window.location) {
          window.location.replace(redirect);
        }
      } else {
        this.transitionTo('version.show', redirect)
      }
    }

    let content = get(model, 'content');
    set(this.page, 'content', content);
    let version = get(model, 'version');
    set(this.page, 'currentVersion', version);
  }
});
