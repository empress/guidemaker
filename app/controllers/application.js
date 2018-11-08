import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default Controller.extend({
  guidemaker: service(),
  page: service(),

  currentYear: computed(function() {
    return (new Date()).getFullYear();
  })
});
