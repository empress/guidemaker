import DS from 'ember-data';

export default DS.JSONAPIAdapter.extend({
  buildURL() {
    let url = ['content', 'versions.json'];
    let host = this.host;
    let prefix = this.urlPrefix();

    if (prefix) { url.unshift(prefix); }

    url = url.join('/');
    if (!host && url && url.charAt(0) !== '/') {
      url = '/' + url;
    }

    return url;
  },
});
