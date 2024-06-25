import Controller, { inject as controller } from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import compareVersions from 'compare-versions';
import { deprecate } from '@ember/debug';

export default class VersionController extends Controller {
  @service page;
  @controller application;

  @service store;
  @service router;

  get pages() {
    return this.model.pages;
  }

  get versions() {
    let allVersions = this.application.model.allVersions;

    if (!allVersions) {
      return [];
    }

    return allVersions.sort(compareVersions).reverse();
  }

  @action
  selectVersion(version) {
    // Navigate to same section/page if it exists
    const path = this.page.currentPage.url;
    this.store
      .queryRecord('content', { version, path })
      .then(() => {
        this.router.transitionTo(`/${version}/${path}`);
      })
      .catch(() => {
        this.router.transitionTo('version', version);
      });
  }

  // eslint-disable-next-line ember/no-actions-hash
  actions = {
    selectVersion: (version) => {
      deprecate(
        'Use of the actions block in the guidemaker version controller is deprecated. If you are accessing controller.actions.selectVersion you can now access controller.selectVersion',
        false,
        {
          id: 'guidemaker-version-controller-actions',
          until: '5.0.0',
          for: 'guidemaker',
          since: {
            available: '4.0.3',
            enabled: '4.0.3',
          },
        },
      );
      this.selectVersion(version);
    },
  };
}
