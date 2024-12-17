/* eslint-disable ember/no-classic-classes, prettier/prettier */
import HistoryLocation from '@ember/routing/history-location';

export default HistoryLocation.extend({
  formatURL() {
    let url = this._super(...arguments);
    return formatURL(url);
  },
});

export function formatURL(url) {
  let modifiedURL = new URL(url, 'http://example.com');
  if (!modifiedURL.pathname.endsWith('/')) {
    modifiedURL.pathname += '/';
  }
  return `${modifiedURL.pathname}${modifiedURL.search}${modifiedURL.hash}`;
}
