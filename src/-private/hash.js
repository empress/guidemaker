/**
 * RSVP's `hash` with native promises, so the addon needs no `rsvp` package.
 */
export function hash(object) {
  let keys = Object.keys(object);

  return Promise.all(keys.map((key) => object[key])).then((values) => {
    let result = {};

    keys.forEach((key, index) => {
      result[key] = values[index];
    });

    return result;
  });
}
