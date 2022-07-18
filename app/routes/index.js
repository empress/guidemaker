/* eslint-disable ember/no-classic-classes, prettier/prettier */
import Route from '@ember/routing/route';

export default Route.extend({
  redirect() {
    this.transitionTo('version', 'release');
  }
});
