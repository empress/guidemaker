import Route from '@ember/routing/route';
import { get } from '@ember/object';

export default Route.extend({
  model() {
    return this.store.findRecord('version', 'versions').then(null, (err) => {
      if(get(err, 'errors.0.status') === '404') {
        return {
          currentVersion: 'release',
        }
      }

      throw err;
    });
  }
});
