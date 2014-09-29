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
  $scope.hello = $routeParams.transportation;
  console.log($scope.hello);


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
        // $scope.hello = $routeParams.transportation;
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

$scope.TransportationMode = 'google.maps.DirectionsTravelMode.' + $scope.hello;

    $scope.getDirections = function () {
        console.log('hello', $scope.hello);
        var request = {
            origin: $scope.origin,
            destination: $scope.endPoint,
            travelMode: google.maps.DirectionsTravelMode[$scope.hello],
            provideRouteAlternatives: true 
        };
        directionsService.route(request, function (response, status) {
            if (status === google.maps.DirectionsStatus.OK) {
                directionsDisplay.setDirections(response)
                document.getElementById('wrongAddress').style.display = "none";
            } else {
                document.getElementById('wrongAddress').style.display = "block";
            }
        });
        directionsDisplay.setMap(map);

        directionsDisplay.setPanel(document.getElementById('directionsList'));

    };

});