import Route from '@ember/routing/route';
import { get } from '@ember/object';

export default Route.extend({
  model() {
    return this.store.findRecord('version', 'versions').then(null, (err) => {
      if(['404', '403'].includes(get(err, 'errors.0.status'))) {
        return {
          currentVersion: 'release',
        }
      }

      throw err;
    });
  }
});
