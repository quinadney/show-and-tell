'use strict';

angular.module('LocalVenuesCtrl', []).controller('LocalVenuesController', function($scope, $http, $routeParams, LS) {

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

          $scope.getCurrentCity();
        });

        $http.get('http://api.songkick.com/api/3.0/metro_areas/' + $scope.cityID + '/calendar.json?apikey=QEwCZke1ncpF2MnG')
          .success(function(data) {
            $scope.upcomingEvents = (data.resultsPage.results.event);
          });
    })();
  } else {
    console.log('no');
    $http.get('http://api.songkick.com/api/3.0/metro_areas/' + $scope.cityID + '/calendar.json?apikey=QEwCZke1ncpF2MnG')
      .success(function(data) {
        $scope.upcomingEvents = (data.resultsPage.results.event);
      });
  }



  $scope.getCurrentCity = function() {
    if ($scope.city === null) {
      (function(){
        $http.get('http://api.songkick.com/api/3.0/search/locations.json?location=geo:' + $scope.location.latitude + ',' + $scope.location.longitude + '&apikey=QEwCZke1ncpF2MnG')
          .success(function(data) {
            console.log('city data', data);

            $scope.city = data.resultsPage.results.location[0].metroArea.displayName;
            $scope.cityID = data.resultsPage.results.location[0].metroArea.id;
            
            localStorage.setItem('currentCity', $scope.city);
            localStorage.setItem('currentCityID', $scope.cityID);
          });
      })();
    }

    $http.get('http://api.songkick.com/api/3.0/metro_areas/' + $scope.cityID + '/calendar.json?apikey=QEwCZke1ncpF2MnG')
      .success(function(data) {
        $scope.upcomingEvents = (data.resultsPage.results.event);
      });
  };

  $scope.submitCity = function(data) {
    LS.setCity(data);
  };

  $scope.getCity = function() {
    console.log(LS.getCity());
  };

  $scope.getClass = function(event) {
    if (event.type === 'Festival') {return 'blue';}
  };

  (function getLocalVenues() {
    console.log('trying');
    $http.get('http://api.songkick.com/api/3.0/search/venues.json?query=austin,tx&apikey=QEwCZke1ncpF2MnG')
      .success(function(data) {
        console.log(data);
        $scope.localVenues = data.resultsPage.results.venue;
      });
    })();

  // function locationDefined() {
  //   return $scope.location.longitude && $scope.location.latitude;
  // }

  if ($scope.city) {
    $scope.getCurrentCity();
  } else {
    $scope.$watch('location', function(oldValue, newValue) {
      if (oldValue !== newValue) {
        if ($scope.city) {
          $scope.getCurrentCity();
        }
      }
    }, true);
  }

});
