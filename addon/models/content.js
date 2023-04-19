import Model, { attr } from '@ember-data/model';

export default class ContentModel extends Model {
  @attr title;
  @attr content;
  @attr description;
  @attr canonical;
  @attr redirect;
  @attr toc;
}
