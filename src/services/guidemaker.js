import Service from '@ember/service';
import { getOwner } from '@ember/owner';

/**
 * The `guidemaker` object of the app's `config/environment.js`.
 */
export function guidemakerConfig(owner) {
  return owner.resolveRegistration('config:environment')?.guidemaker ?? {};
}

export default class GuidemakerService extends Service {
  get config() {
    return guidemakerConfig(getOwner(this));
  }

  get title() {
    return this.config.title;
  }

  get logo() {
    return this.config.logo;
  }

  get social() {
    return this.config.social;
  }

  get copyright() {
    return this.config.copyright;
  }

  get sourceRepo() {
    return this.config.sourceRepo;
  }

  get sourceBranch() {
    return this.config.sourceBranch;
  }

  get collapseToc() {
    return this.config.collapseToc;
  }
}
