/* eslint-disable prettier/prettier */
import { helper } from '@ember/component/helper';

export function shortenVersion([version='']) {
  return version.slice(version.indexOf('v') + 1 || 0, version.lastIndexOf('.') === version.indexOf('.') ? version.length : version.lastIndexOf('.'));
}

export default helper(shortenVersion);
