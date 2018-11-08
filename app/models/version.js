import DS from 'ember-data';

export default DS.Model.extend({
  allVersions: DS.attr(),
  currentVersion: DS.attr('string'),
});
