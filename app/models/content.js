import DS from 'ember-data';

export default DS.Model.extend({
  title: DS.attr(),
  content: DS.attr(),
  description: DS.attr(),
  canonical: DS.attr(),
  redirect: DS.attr(),
});
