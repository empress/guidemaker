/* eslint-disable ember/use-ember-data-rfc-395-imports, ember/no-classic-classes, prettier/prettier */
import DS from 'ember-data';

export default DS.Model.extend({
  allVersions: DS.attr(),
  currentVersion: DS.attr('string'),
  ltsVersions: DS.attr()
});
