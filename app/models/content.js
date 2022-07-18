/* eslint-disable ember/use-ember-data-rfc-395-imports, ember/no-classic-classes */
import DS from 'ember-data';

export default DS.Model.extend({
  title: DS.attr(),
  content: DS.attr(),
  description: DS.attr(),
  canonical: DS.attr(),
  redirect: DS.attr(),
});
