import Service from '@ember/service';
import { inject as service } from '@ember/service';
import { get, set, computed, observer } from '@ember/object';
import DS from 'ember-data';

export default Service.extend({
  router: service(),
  store: service(),
  fastboot: service(),
  headData: service(),

  waitForPromise(promise) {
    if (this.get('fastboot.isFastBoot')) {
      this.get('fastboot').deferRendering(promise);
    }
  },

  pages: computed('currentVersion', function() {
    console.log('trigger pages');
    return get(this, 'store').query('page', { version: get(this, 'currentVersion') });
  }),

  currentSection: computed('router.currentURL', function() {
    console.log('trigger currentSection');
    let match = get(this, 'router.currentURL').match(/^\/v\d+\.\d+\.\d+\/([\w-]+)(#[\w_-]+)?/);

    if(match && match[1]) {
      let promise = get(this, 'pages')
        .then((pages) => {
          console.log('pages resolved');
          return pages.find((page) => page.id === match[1])
        });
      return promise;
      // return DS.PromiseObject.create({
      //   promise,
      // })
    }
  }),

  currentPage: computed('router.currentURL', function() {
    console.log('trigger currentPage');
    let match = get(this, 'router.currentURL').match(/^\/v\d+\.\d+\.\d+\/([\w-]+)\/?([\w-]+)?\/?(#[\w_-]+)?/);

    let promise = get(this, 'currentSection').then((currentSection) => {
      let pages = get(currentSection, 'pages');
      console.log('currentPage resolve');
      return pages[0];
    });

    return promise;

    // this.waitForPromise(promise);

    // return DS.PromiseObject.create({
    //   promise,
    // })
  }),

  currentVersion: computed('router.currentURL', function() {
    return get(this, 'router.currentURL').match(/v\d+\.\d+\.\d+/)[0];
  })
});
