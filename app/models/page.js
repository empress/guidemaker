/* eslint-disable ember/use-ember-data-rfc-395-imports, ember/no-classic-classes */
import DS from 'ember-data';

export default DS.Model.extend({
  title: DS.attr('string'),
  pages: DS.attr(),
  skipToc: DS.attr('boolean'),
  isHeading: DS.attr('boolean'),
});
