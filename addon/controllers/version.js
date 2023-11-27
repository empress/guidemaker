/* eslint-disable prettier/prettier, ember/no-classic-classes, ember/no-get, ember/no-actions-hash */
import Controller, {
  inject as controller,
} from '@ember/controller';
import { get, computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import compareVersions from 'compare-versions';

export default Controller.extend({
  page: service(),
  application: controller(),
  store: service(),
  router: service(),

  pages: alias('model.pages'),

  versions: computed('application.model.allVersions.[]', function () {
    let allVersions = get(this, 'application.model.allVersions');

    if(!allVersions) {
      return;
    }

    return allVersions.sort(compareVersions).reverse();
  }),

  actions: {
    selectVersion(version) {
      // Navigate to same section/page if it exists
      const path = get(this, 'page.currentPage.url');
      this.store.queryRecord('content', {version, path}).then(() => {
        this.router.transitionTo(`/${version}/${path}`);
      }).catch(() => {
        this.router.transitionTo('version', version);
      })
    }
  }
});
