import Model, { attr } from '@ember-data/model';

export default class PageModel extends Model {
  @attr('string') title;
  @attr pages;
  @attr('boolean') skipToc;
  @attr('boolean') isHeading;
}
