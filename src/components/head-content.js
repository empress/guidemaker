import Component from '@glimmer/component';
import { service } from '@ember/service';

/**
 * ember-cli-head's `<HeadLayout />` renders `<HeadContent />` into `<head>`.
 * This one renders the head-data service of guidemaker.
 */
export default class HeadContent extends Component {
  @service('head-data') model;
}
