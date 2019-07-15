import { get, set } from '@ember/object';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';

export default Route.extend({
  page: service(),
  model(params) {
    let applicationModel = this.modelFor('application');
    let currentVersion = get(applicationModel, 'currentVersion');
    let queryVersion = params.version;

    if (params.version === 'release') {
      queryVersion = currentVersion;
    }

    return hash({
      pages: this.store.findAll('page', {
        adapterOptions: {
          version: queryVersion
        }
      }),
      allVersions: get(applicationModel, 'allVersions'),
      currentVersion,
      version: queryVersion,
    });
  },

  afterModel(model) {
    set(this.page, 'pages', get(model, 'pages'));
  }
});
