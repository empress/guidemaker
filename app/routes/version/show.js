import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { get, set } from '@ember/object';
import { hash } from 'rsvp';

function isExternalRedirect(redirect) {
  return redirect.match(/^https?:\/\//);
}

export default Route.extend({
  page: service(),
  model(params) {
    const path = params.path.replace(/\/$/, '');

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

    let contentPromise = this.store.findRecord('content', path, {
      adapterOptions: {
        version,
      }
    })
      .catch((e) => {
        if (['404', '403'].includes(get(e, 'errors.0.status'))) {
          return this.store.findRecord('content', `${path}/index`, {
            adapterOptions: {
              version,
            }
          })
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
    let redirect = model.content.redirect;

    if (redirect) {
      if (isExternalRedirect(redirect)) {
        window.location.replace(redirect);
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
