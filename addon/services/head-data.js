import HeadData from 'ember-meta/services/head-data';
import config from 'ember-get-config';
import { computed } from '@ember/object';
import { getOwner } from '@ember/application';
import { inject as service } from '@ember/service';
import { isPresent } from '@ember/utils';

export default HeadData.extend({
  page: service(),
  guidemaker: service(),
  currentRouteModel: computed('routeName', function() {
    return getOwner(this).lookup(`route:${this.routeName}`).get('currentModel.content');
  }),

  title: computed('routeName', function() {
    if(!this.page.currentPage || !this.page.currentSection) {
      return this.guidemaker.title;
    }

    let title = `${this.page.currentPage.title} - ${this.page.currentSection.title}`;

    if(this.guidemaker.title) {
      title +=  ` - ${this.guidemaker.title}`
    }

    return title;
  }),

  description: computed('routeName', function() {
    return this.getWithDefault('currentRouteModel.description', config['ember-meta'].description);
  }),

  slug: computed('routeName', function() {
    // if there is no current model
    if (!this.currentRouteModel) {
      return null;
    }

    if(this.currentRouteModel.id === 'index') {
      return this.page.currentVersion;
    }

    return `${this.page.currentVersion}/${this.currentRouteModel.id.replace(/\/index$/, '')}`;
  }),

  canonical: computed('routeName', function() {
    // if there is no current model
    if (!this.currentRouteModel) {
      return null;
    }

    let url = config['ember-meta'].url;

    if(!isPresent(url)) {
      return;
    }

    if (isPresent(this.currentRouteModel.canonical)) {
      return this.currentRouteModel.canonical;
    }

    let slug;

    if (this.currentRouteModel.id === 'index') {
      slug = 'release';
    } else {
      slug = `release/${this.currentRouteModel.id.replace(/\/index$/, '')}`
    }

    return `${url}${slug}/`;
  }),

  url: computed('routeName', function() {
    let url = config['ember-meta'].url;

    if(!isPresent(url)) {
      return;
    }

    const slug = this.get('slug');
    if (slug) {
      url = `${url}${slug}/`;
    }
    return url;
  })
});
