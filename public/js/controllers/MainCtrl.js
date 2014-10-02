'use strict';
angular.module('MainCtrl', []).controller('MainController', function($scope, $http) {
  ///////////////////////////////////Delete?/////////////////////////////////
  $scope.location = {
    latitude: undefined,
    longitude: undefined
  };
  
  // Clear local storage after a day to ensure better geolocation over extended use.
  if ((parseInt(Date.now()) - parseInt(localStorage.getItem('storageDate'))) > 86400000) {
    localStorage.clear();
  } else { 
    console.log(parseInt(Date.now()) - parseInt(localStorage.getItem('storageDate')));
  }

  // Check if latitude/longitude exist and create if not; same with city(ID) but that is reliant on lat/long, so after
  if (!localStorage.getItem('latitude') || !localStorage.getItem('longitude')) {  
    console.log('umm');
    localStorage.setItem('storageDate', Date.now());
    navigator.geolocation.getCurrentPosition(function(position) {
      $scope.$apply(function() {
        console.log('gotcha');
        $scope.location.latitude = position.coords.latitude;
        $scope.location.longitude = position.coords.longitude;

        localStorage.setItem('latitude', position.coords.latitude);
        localStorage.setItem('longitude', position.coords.longitude);

        // var latitude = position.coords.latitude;
        // var longitude = position.coords.longitude;

        console.log($scope.location.latitude, $scope.location.longitude);
      });
      if (!localStorage.getItem('currentCity') || !localStorage.getItem('currentCityID')) {
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
        })();
      }
    });
  }


  $scope.localPhoto = function() {
    $scope.albumCovers = [];

    $http.get('http://ws.audioscrobbler.com/2.0/?method=chart.gettopartists&api_key=ee2ed1a1c901362b067bab4409e0a73e&format=json')
      .success(function(data) {
        var allArtists = data.artists.artist;
        for (var y = 0; y < allArtists.length; y++) {
          $scope.albumCovers.push(allArtists[y].image[4]["#text"]);
        }
      $scope.featuredArtist = $scope.albumCovers[Math.floor(Math.random()*$scope.albumCovers.length)];
      });

    $http.get('https://api.flickr.com/services/rest/?method=flickr.photos.search&nojsoncallback=1&format=json&api_key=10cfcdb96de50b5dd47bf03845bdd3e4&tags=' + localStorage.getItem('currentCity') + ',skyline&tag_mode=all&sort=relevance')
      .success(function(data) {
        var allPhotos = data.photos.photo;
        $scope.featuredLocalPhoto = allPhotos[Math.floor(Math.random()*allPhotos.length)];
        $scope.picSrc = 'https://farm' + $scope.featuredLocalPhoto.farm + '.staticflickr.com/' + $scope.featuredLocalPhoto.server + '/' + $scope.featuredLocalPhoto.id + '_' + $scope.featuredLocalPhoto.secret + '.jpg';
      });
    };

    $scope.localPhoto();
});