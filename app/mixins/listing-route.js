import Ember from 'ember';

export default Ember.Mixin.create({
  snoocore: Ember.inject.service(),

  queryParams: {
    after: {
      refreshModel: true
    },
    before: {
      refreshModel: true
    },
    limit: {
      refreshModel: true
    },
    q: {
      refreshModel: true
    },
    t: {
      refreshModel: true
    },
    sort: {
      refreshModel: true
    },
    context: {
      refreshModel: true
    }
  },

  model: function(params) {
    return this.makeApiCall(params).then(this.normalizeResponse.bind(this))
      .then(result => {
        result.params = params;
        return result;
      })
      .catch(error => {
        console.error(error.stack || error);
        return;
      });
  },

  redirect(model) {
    if (!model) {
      this.transitionTo('subreddit.new');
    }
  },

  listingType: 'hot',

  listingClass: 'subreddit',

  makeApiCall: function(params) {
    var sub = this.modelFor(this.get('listingClass'));
    var path = sub.url + this.get('listingType') + '.json';
    return this.get('snoocore.client')(path).listing(params);
  },

  normalizeResponse: function(response) {
    return (response.allChildren || response.children || []).getEach('data');
  },

  renderTemplate: function() {
    this.render(this.get('listingClass') + '/index', {
      controller: this.controller
    });
  },

  resetController() {
    this.controller.setProperties({
      after: '',
      before: '',
      count: 0
    });
  }
});
