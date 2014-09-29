'use strict';
angular.module('MainCtrl', []).controller('MainController', function($scope) {
  $scope.location = {
    latitude: undefined,
    longitude: undefined
  };
  
  function successCallback(position) {
  }
  
  navigator.geolocation.getCurrentPosition(function(position) {
    $scope.$apply(function() {
      console.log('gotcha');
      $scope.location.latitude = position.coords.latitude;
      $scope.location.longitude = position.coords.longitude;

      localStorage.setItem('latitude', position.coords.latitude);
      localStorage.setItem('longitude', position.coords.longitude);

      var latitude = position.coords.latitude;
      var longitude = position.coords.longitude;

      console.log($scope.location.latitude, $scope.location.longitude);
    });
  });


  $scope.status = {
    isopen: false
  };

  $scope.toggled = function(open) {
    console.log('Dropdown is now: ', open);
  };

  $scope.toggleDropdown = function($event) {
    $event.preventDefault();
    $event.stopPropagation();
    $scope.status.isopen = !$scope.status.isopen;
  };
});