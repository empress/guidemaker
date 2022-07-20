import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default class ApplicationController extends Controller {
  @service guidemaker;
  @service page;

  get currentYear() {
    return new Date().getFullYear();
  }
}
