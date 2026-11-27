/* eslint-disable ember/no-computed-properties-in-native-classes, ember/require-computed-property-dependencies */
import Service, { service } from '@ember/service';
import { computed } from '@ember/object';
import { alias, reads } from '@ember/object/computed';
import { getOwner } from '@ember/owner';
import { isPresent } from '@ember/utils';

/**
 * The data of the `<head>` that `templates/head.hbs` renders through
 * ember-cli-head. It has the API of ember-meta's head-data service, with
 * the title, description and urls of the current guides page.
 *
 * The site defaults come from the `ember-meta` object of the app's config,
 * where `description` and `title` default to the ones of `guidemaker`.
 */
export default class HeadDataService extends Service {
  @service router;
  @service page;
  @service guidemaker;

  @alias('router.currentRouteName') routeName;

  get config() {
    let config = getOwner(this).resolveRegistration('config:environment') ?? {};
    let guidemaker = config.guidemaker ?? {};
    let meta = config['ember-meta'] ?? {};

    return {
      ...meta,
      description: meta.description ?? guidemaker.description,
      title: meta.title ?? guidemaker.title,
    };
  }

  @computed('routeName')
  get currentRoute() {
    return getOwner(this).lookup(`route:${this.routeName}`);
  }

  @computed('routeName')
  get currentRouteMeta() {
    return this.currentRoute?.metaInfo || this.currentRoute?.currentModel;
  }

  @computed('routeName')
  get currentRouteModel() {
    return this.currentRoute?.currentModel?.content;
  }

  /**
   * Used for og:title and twitter:title, in place of `title`.
   */
  @reads('currentRouteMeta.articleTitle') articleTitle;

  /**
   * Used for the twitter "Written by" label.
   */
  @reads('currentRouteMeta.author') author;

  @reads('currentRouteMeta.categories') categories;

  @reads('currentRouteMeta.date') date;

  @computed('currentRouteMeta.imgSrc', 'routeName', 'config.imgSrc')
  get imgSrc() {
    return this.currentRouteMeta?.imgSrc ?? this.config.imgSrc;
  }

  @computed('currentRouteMeta.jsonld', 'routeName')
  get jsonld() {
    let jsonld = this.currentRouteMeta?.jsonld;

    return jsonld ? JSON.stringify(jsonld) : false;
  }

  /**
   * Used for the twitter "Filed under" label.
   */
  @computed('categories', 'routeName')
  get keywords() {
    return this.categories ? this.categories.join(', ') : null;
  }

  @computed('currentRouteMeta.siteName', 'routeName', 'config.siteName')
  get siteName() {
    return this.currentRouteMeta?.siteName ?? this.config.siteName;
  }

  @reads('categories') tags;

  @computed(
    'currentRouteMeta.twitterUsername',
    'routeName',
    'config.twitterUsername',
  )
  get twitterUsername() {
    return (
      this.currentRouteMeta?.twitterUsername ?? this.config.twitterUsername
    );
  }

  /**
   * Used for og:type.
   */
  @computed('currentRouteMeta.type', 'routeName')
  get type() {
    return this.currentRouteMeta?.type ?? 'website';
  }

  @computed('routeName', 'page.{currentPage,currentSection}')
  get title() {
    if (!this.page.currentPage || !this.page.currentSection) {
      return this.guidemaker.title;
    }

    let title = `${this.page.currentPage.title} - ${this.page.currentSection.title}`;

    if (this.guidemaker.title) {
      title += ` - ${this.guidemaker.title}`;
    }

    return title;
  }

  @computed('routeName')
  get description() {
    return this.currentRouteModel?.description ?? this.config.description;
  }

  @computed('routeName')
  get slug() {
    if (!this.currentRouteModel) {
      return null;
    }

    if (this.currentRouteModel.id === 'index') {
      return this.page.currentVersion;
    }

    return `${this.page.currentVersion}/${this.currentRouteModel.id.replace(/\/index$/, '')}`;
  }

  /**
   * Pages of older versions point to the same page of `release`, unless
   * their front matter has a `canonical`.
   */
  @computed('routeName')
  get canonical() {
    if (!this.currentRouteModel) {
      return null;
    }

    let url = this.config.url;

    if (!isPresent(url)) {
      return undefined;
    }

    if (isPresent(this.currentRouteModel.canonical)) {
      return this.currentRouteModel.canonical;
    }

    let slug;

    if (this.currentRouteModel.id === 'index') {
      slug = 'release';
    } else {
      slug = `release/${this.currentRouteModel.id.replace(/\/index$/, '')}`;
    }

    return `${url}${slug}/`;
  }

  @computed('routeName')
  get url() {
    let url = this.config.url;

    if (!isPresent(url)) {
      return undefined;
    }

    if (this.slug) {
      url = `${url}${this.slug}/`;
    }

    return url;
  }
}
