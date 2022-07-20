import JSONAPIAdapter from '@ember-data/adapter/json-api';

export default class VersionAdapter extends JSONAPIAdapter {
  buildURL() {
    let url = ['content', 'versions.json'];
    let host = this.host;
    let prefix = this.urlPrefix();

    if (prefix) {
      url.unshift(prefix);
    }

    url = url.join('/');
    if (!host && url && url.charAt(0) !== '/') {
      url = '/' + url;
    }

    return url;
  }
}
