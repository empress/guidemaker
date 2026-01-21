import Service from '@ember/service';

import config from 'ember-get-config';

export default class GuidemakerService extends Service {
  constructor() {
    super(...arguments);

    for (const [key, value] of Object.entries(config.guidemaker)) {
      this[key] = value;
    }
  }
}
