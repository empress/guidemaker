import HeadDataService from '../services/head-data.js';

/**
 * ember-cli-head has its own `head-data` service. Embroider puts the app
 * files of v1 addons such as ember-cli-head after the ones of v2 addons, so
 * ember-cli-head's service wins. A registration on the instance comes before
 * both. An app keeps its own service when it extends guidemaker's.
 */
export function initialize(owner) {
  let HeadData = owner.resolveRegistration('service:head-data');

  if (
    HeadData !== HeadDataService &&
    !(HeadData?.prototype instanceof HeadDataService)
  ) {
    owner.register('service:head-data', HeadDataService);
  }
}

export default {
  initialize,
};
