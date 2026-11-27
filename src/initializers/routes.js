/**
 * The app's router is `router:main`, so the addon adds its routes without
 * importing the app's `router.js`.
 */
export function initialize(application) {
  let Router = application.resolveRegistration('router:main');

  Router.map(function () {
    this.route('version', { path: ':version' }, function () {
      this.route('show', { path: '*path' });
    });
  });
}

export default {
  initialize,
};
