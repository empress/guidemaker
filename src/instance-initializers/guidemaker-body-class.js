import { registerDestructor } from '@ember/destroyable';

/**
 * Puts the names of the active routes on `<body>`, as ember-body-class did:
 * `version.show` adds `version`, `show` and `version-show`, plus the
 * `classNames` of each route, such as `x404` for the error route.
 *
 * It reads and writes the `class` attribute, which also works on the
 * SimpleDOM document of FastBoot.
 */
function routeClasses(owner, routeInfo) {
  let classes = [];

  for (let info = routeInfo; info; info = info.parent) {
    let parts = info.name.split('.');
    let route = owner.lookup(`route:${info.name}`);

    classes = classes.concat(parts);

    for (let index = 1; index < parts.length; index++) {
      classes.push(parts.slice(0, index + 1).join('-'));
    }

    classes = classes.concat(route?.classNames ?? []);
  }

  return classes;
}

function updateClasses(body, removed, added) {
  let classes = (body.getAttribute('class') ?? '')
    .split(/\s+/)
    .filter((klass) => klass && !removed.includes(klass));

  for (let klass of added) {
    if (!classes.includes(klass)) {
      classes.push(klass);
    }
  }

  body.setAttribute('class', classes.join(' '));
}

export function initialize(owner) {
  let router = owner.lookup('service:router');
  let { body } = owner.lookup('service:-document');
  let current = [];

  router.on('routeDidChange', (transition) => {
    let next = transition.to ? routeClasses(owner, transition.to) : [];

    updateClasses(body, current, next);
    current = next;
  });

  registerDestructor(owner, () => updateClasses(body, current, []));
}

export default {
  initialize,
};
