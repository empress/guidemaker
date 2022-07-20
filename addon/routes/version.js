import Route from '@ember/routing/route';
import { set } from '@ember/object';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';

export default class VersionRoute extends Route {
  @service page;
  @service store;

  model(params) {
    let applicationModel = this.modelFor('application');
    let currentVersion = applicationModel.currentVersion;
    let queryVersion = params.version;

    if (params.version === 'release') {
      queryVersion = currentVersion;
    }

    return hash({
      pages: this.store.query('page', { version: queryVersion }),
      allVersions: applicationModel.allVersions,
      currentVersion,
      version: queryVersion,
    });
  }

  afterModel(model) {
    set(this.page, 'pages', model.pages);
  }
}
