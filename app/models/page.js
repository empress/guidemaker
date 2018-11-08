import DS from 'ember-data';

export default DS.Model.extend({
  title: DS.attr('string'),
  pages: DS.attr(),
  skipToc: DS.attr('boolean'),
});
