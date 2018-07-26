import Router from '../router';

export function initialize() {
  Router.map(function() {
    this.route('version', { path: ':version' }, function() {
      this.route('show', { path: '*path' });
    });
  });
}

export default {
  initialize
};
