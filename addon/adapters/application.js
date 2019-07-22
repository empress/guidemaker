import DS from 'ember-data';

export default DS.JSONAPIAdapter.extend({
  urlForFindAll(modelName, snapshot) {
    const path = this.pathForType(modelName);
    return `/content/${snapshot.adapterOptions.version}/${path}.json`;
  },

  urlForFindRecord(id, modelName, snapshot) {
    return `/content/${snapshot.adapterOptions.version}/${id}.json`;
  }
});
