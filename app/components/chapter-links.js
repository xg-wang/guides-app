import Component from '@ember/component';
import { get, computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  tagName: 'footer',

  page: service(),
  fastboot: service(),

  init() {
    this._super(...arguments);
    const promise = this.get('page.currentPage')
      .then((currentPage) => {
        console.log('currentPage resolve in component');
        this.set('currentPage', currentPage)
      });
    if (this.get('fastboot.isFastBoot')) {
      this.get('fastboot').deferRendering(promise);
    }
  }
});
