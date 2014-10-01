angular.module('GmapsCtrl', ['google-maps']).controller('GmapsController', function($scope, $route, $routeParams, $http) {
  $scope.tourModal = false;

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
  $scope.transportation = $routeParams.transportation.toLowerCase();
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


    (function startDirections() {
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
    })();

    $scope.getDirections = function () {
        console.log('hello', $scope.hello);
        var request = {
            origin: $scope.newOrigin,
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
    // $scope.getDirections();


    (function getVenue() {
    var promise = $http.get('https://api.foursquare.com/v2/venues/search?ll=' + $scope.latitude + ',' + $scope.longitude + '&categoryId=4bf58dd8d48988d1e5931735&client_id=KTDWDD2EH5SQBDHHJZNJHYUHZ54JKWF5CNDNSSFE35MLACET&client_secret=ZM2QQTIBGS1IUSBUF2NTIPPA3GNNHGGOAYABO0LAATDRMQO1&v=20140701&m=foursquare');

    promise.success(function(data) {
      console.log('venue', data);
      $scope.selectedVenue = (data.response.venues[0]);
     });
    })();

});