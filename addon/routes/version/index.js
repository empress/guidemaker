import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { set } from '@ember/object';
import { hash } from 'rsvp';

export default class VersionIndexRoute extends Route {
  @service page;
  @service store;
  model() {
    let { version, currentVersion } = this.modelFor('version');

    return hash({
      content: this.store.queryRecord('content', {
        path: 'index',
        version,
      }),
      version,
      currentVersion,
    });
  }

  afterModel(model) {
    let content = model.content;
    set(this.page, 'content', content);
    let version = model.version;
    set(this.page, 'currentVersion', version);
  }
}
