'use strict';

angular.module('LocalStorage', []).factory('LS', function($window, $rootScope) {
  angular.element($window).on('storage', function(event) {
    console.log('hello');
    if (event.key === 'my-storage') {
      $rootScope.$apply();
    }
  });
  return {
    setCity: function(val) {
      console.log('setting');
      $window.localStorage && $window.localStorage.setItem('city', val);
      return this;
    },
    getCity: function() {
      console.log('getting');
      return $window.localStorage && $window.localStorage.getItem('city');
    }
  };
});