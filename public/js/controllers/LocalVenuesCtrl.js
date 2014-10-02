'use strict';

angular.module('LocalVenuesCtrl', []).controller('LocalVenuesController', function($scope, $http, $routeParams, LS, $location) {

  $scope.upcomingEvents = [];
  $scope.city = localStorage.getItem('currentCity');

  if (($scope.cityID === null) || ($scope.city === null)) {
    console.log('ya');
    (function(){
      $http.get('http://api.songkick.com/api/3.0/search/locations.json?location=geo:' + localStorage.getItem('latitude') + ',' + localStorage.getItem('longitude') + '&apikey=QEwCZke1ncpF2MnG')
        .success(function(data) {
          console.log('city data', data);

          $scope.city = data.resultsPage.results.location[0].metroArea.displayName;
          $scope.cityID = data.resultsPage.results.location[0].metroArea.id;
          
          localStorage.setItem('currentCity', $scope.city);
          localStorage.setItem('currentCityID', $scope.cityID);
        });

        $http.get('http://api.songkick.com/api/3.0/metro_areas/' + $scope.cityID + '/calendar.json?apikey=QEwCZke1ncpF2MnG')
          .success(function(data) {
            $scope.upcomingEvents = (data.resultsPage.results.event);
          });
        getLocalVenues();
    })();
  } else {
    // console.log('no');
    $http.get('http://api.songkick.com/api/3.0/metro_areas/' + localStorage.getItem('currentCityID') + '/calendar.json?apikey=QEwCZke1ncpF2MnG')
      .success(function(data) {
        console.log('dataaa', data);
        $scope.upcomingEvents = (data.resultsPage.results.event);
      });
    getLocalVenues();
  }


  $scope.submitCity = function(data) {
    LS.setCity(data);
  };

  $scope.getCity = function() {
    console.log(LS.getCity());
  };

  $scope.getClass = function(event) {
    if (event.type === 'Festival') {return 'blue';}
  };

  function getLocalVenues() {
    console.log('trying');
    $http.get('http://api.songkick.com/api/3.0/search/venues.json?query=' + localStorage.getItem('currentCity') + ',tx&apikey=QEwCZke1ncpF2MnG')
      .success(function(data) {
        console.log('venues', data);
        $scope.localVenues = data.resultsPage.results.venue;
      });
    }

  $scope.getVenue = function(venue, lat, long) {
    $location.path(('/venue/' + venue + '/' + lat + '/' + long));
  };

  $scope.getMap = function(lat, long, type) {
    console.log(lat, long);
    $location.path(('/gmaps/' + lat + '/' + long + '/' + type));
  };
});
