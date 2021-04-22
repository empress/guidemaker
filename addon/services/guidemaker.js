import Service from '@ember/service';
import { computed, get } from '@ember/object';

import config from 'ember-get-config';

function configParam(param) {
  return computed(function() {
    return get(config, `guidemaker.${param}`);
  })
}

export default Service.extend({
  title: configParam('title'),
  logo: configParam('logo'),
  social: configParam('social'),
  copyright: configParam('copyright'),
  sourceRepo: configParam('sourceRepo'),
  sourceBranch: configParam('sourceBranch'),
  collapseToc: configParam('collapseToc'),
});
