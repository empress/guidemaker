import GuidemakerAdapter from 'guidemaker/adapters/application';
import config from '../config/environment';

export default class ApplicationAdapter extends GuidemakerAdapter {
  namespace = config.rootURL;
}
