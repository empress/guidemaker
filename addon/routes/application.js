import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class ApplicationRoute extends Route {
  @service store;

  model() {
    return this.store.findRecord('version', 'versions').then(null, (err) => {
      if (['404', '403'].includes(err?.errors?.[0]?.status)) {
        return {
          currentVersion: 'release',
        };
      }
      throw err;
    });
  }
}
