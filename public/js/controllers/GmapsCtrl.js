angular.module('GmapsCtrl', ['google-maps']).controller('GmapsController', function($scope, $route, $routeParams) {
  $scope.tagline = "Let's get you that map...";
  $scope.map = {
      center: {
          latitude: 30.26715299,
          longitude: -97.743061
      },
      zoom: 13
  };
  $scope.latitude = $routeParams.lat;
  $scope.longitude = $routeParams.long;
  console.log($scope.latitude, $scope.longitude);
  $scope.routeParams = $routeParams;
  $scope.mode = $routeParams.transport;


var directionsDisplay = new google.maps.DirectionsRenderer(),
    directionsService = new google.maps.DirectionsService(),
    geocoder = new google.maps.Geocoder(),
    map,
    marker,
    mapObj,
    infowindow;

    if (directionsService) {console.log('yay');}



    (function create() {
        var mapOptions = {
            zoom: $scope.zoom !== undefined ?$scope.zoom : 15,
            mapTypeId:$scope.mode,
            streetViewControl: false
        };
        map = new google.maps.Map(document.getElementById('theMap'), mapOptions);
        $scope.origin = localStorage.getItem('latitude') + ', ' + localStorage.getItem('longitude');
        $scope.endPoint = $scope.latitude + ', ' + $scope.longitude;
        $scope.destination !== undefined ?$scope.destination : '1803 E 18th St, Austin TX 78702';
        //$scope.mode = {{mode}}

        geocoder.geocode({
            address: $scope.origin
        }, function (results, status) {
            console.log(results, status);
            var location = results[0].geometry.location;
            if (status === google.maps.GeocoderStatus.OK) {
                map.setCenter(location);
                marker = new google.maps.Marker({
                    map: map,
                    position: location,
                    animation: google.maps.Animation.DROP
                });
                infowindow = new google.maps.InfoWindow({
                    content:$scope.markerContent !== undefined ?$scope.markerContent : 'Google HQ'
                });
                google.maps.event.addListener(marker, 'click', function () {
                    return infowindow.open(map, marker);
                });
                console.log('done');

            } else {
                alert('Cannot Geocode');
            }
        });
    })();
});