'use strict';

angular.module('LocalVenuesCtrl', []).controller('LocalVenuesController', function($scope, $http, $routeParams) {

// (function getVenue() {
//     var promise = $http.get('https://api.foursquare.com/v2/venues/search?ll=' + localStorage.getItem('latitude') + ',' + localStorage.getItem('longitude') + '&categoryID=4d4b7104d754a06370d81259&query=' + $scope.venue + '&client_id=KTDWDD2EH5SQBDHHJZNJHYUHZ54JKWF5CNDNSSFE35MLACET&client_secret=ZM2QQTIBGS1IUSBUF2NTIPPA3GNNHGGOAYABO0LAATDRMQO1&v=20140701&m=foursquare');
  
//     promise.success(function(data) {
//       console.log(data);
//     });
//   })(); // immediately call function on load

  $scope.getCurrentCity = function() {
    var promise = $http.get('http://api.songkick.com/api/3.0/search/locations.json?location=geo:' + $scope.location.latitude + ',' + $scope.location.longitude + '&apikey=QEwCZke1ncpF2MnG');
    promise.success(function(data) {
      console.log(data);
      $scope.city = localStorage.getItem('currentCity');
      // $scope.city = data.resultsPage.results.location[0].metroArea.displayName;
      localStorage.setItem('currentCity', $scope.city);

      console.log($scope.city);
    });
  };

  function locationDefined() {
    return $scope.location.longitude && $scope.location.latitude;
  }

  if (locationDefined()) {
    $scope.getCurrentCity();
  } else {
    $scope.$watch('location', function(oldValue, newValue) {
      if (oldValue !== newValue) {
        if (locationDefined()) {
          $scope.getCurrentCity();
        }
      }
    }, true);
  }

});
