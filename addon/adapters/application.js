import DS from 'ember-data';

export default DS.JSONAPIAdapter.extend({
  urlForFindAll(modelName, snapshot) {
    const path = this.pathForType(modelName);
    return `/content/${snapshot.adapterOptions.version}/${path}.json`;
  },

  urlForFindRecord(id, modelName, snapshot) {
    return `/content/${snapshot.adapterOptions.version}/${id}.json`;
  },

  buildURL(modelName, id, snapshot, requestType, query) {
    let url = [];
    if (!query.path) {
      url = ['content', query.version, 'pages.json'];
    } else {
      url = ['content', query.version, query.path + '.json'];
    }

    let host = this.host;
    let prefix = this.urlPrefix();

    if (prefix) { url.unshift(prefix); }

    url = url.join('/');
    if (!host && url && url.charAt(0) !== '/') {
      url = '/' + url;
    }
    return url;
  },

  query(store, type, query) {
    // we have to override query because Netlify is buggy when you send queryParams
    let url = this.buildURL(type.modelName, null, null, 'query', query);
    return this.ajax(url, 'GET');
  },
  queryRecord(store, type, query) {
    // we have to override queryRecord because Netlify is buggy when you send queryParams
    let url = this.buildURL(type.modelName, null, null, 'query', query);
    return this.ajax(url, 'GET');
  },
});
