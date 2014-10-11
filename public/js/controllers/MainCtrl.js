'use strict';
angular.module('MainCtrl', []).controller('MainController', function($scope, $http) {
  $scope.city = '';
  
  // Clear local storage after a day to ensure better geolocation over extended use.
  if ((parseInt(Date.now()) - parseInt(localStorage.getItem('storageDate'))) > 86400000) {
    localStorage.clear();
  } else { 
    console.log(parseInt(Date.now()) - parseInt(localStorage.getItem('storageDate')));
  }

  // Check if latitude/longitude exist and create if not; same with city(ID) but that is reliant on lat/long, so after
  if (!localStorage.getItem('latitude') || !localStorage.getItem('longitude')) {  
    localStorage.setItem('storageDate', Date.now());
    navigator.geolocation.getCurrentPosition(function(position) {
      $scope.$apply(function() {
        localStorage.setItem('latitude', position.coords.latitude);
        localStorage.setItem('longitude', position.coords.longitude);
      });
      if (!localStorage.getItem('currentCity') || !localStorage.getItem('currentCityID')) {
        (function(){
          $http.get('/proxy?url=http://api.songkick.com/api/3.0/search/locations.json&location=geo:' + localStorage.getItem('latitude') + ',' + localStorage.getItem('longitude') + '&apikey=QEwCZke1ncpF2MnG')
            .success(function(data) {

              $scope.city = data.resultsPage.results.location[0].metroArea.displayName;
              $scope.cityID = data.resultsPage.results.location[0].metroArea.id;
              
              localStorage.setItem('currentCity', $scope.city);
              localStorage.setItem('currentCityID', $scope.cityID);
            });

            $http.get('/proxy?url=http://api.songkick.com/api/3.0/metro_areas/' + $scope.cityID + '/calendar.json?apikey=QEwCZke1ncpF2MnG')
              .success(function(data) {
                $scope.upcomingEvents = (data.resultsPage.results.event);
              });
        })();
      }
    });
  }

  // Check if city has been established, then run api calls for images of current city's concert scene + current top artists on last.fm
  $scope.$watch('city', function(newVal, oldVal) {
    if (newVal || localStorage.getItem('currentCity')) {
      $scope.localPhoto = function() {
        $scope.albumCovers = [];

        $http.get('/proxy?url=http://ws.audioscrobbler.com/2.0/&method=chart.gettopartists&api_key=ee2ed1a1c901362b067bab4409e0a73e&format=json&limit=10')
          .success(function(data) {
            console.log ('lastFM artists: ', data);
            var allArtists = data.artists.artist;
            for (var y = 0; y < allArtists.length; y++) {
              $scope.albumCovers.push(allArtists[y].image[4]["#text"]);
            }
          $scope.featuredArtist = $scope.albumCovers[Math.floor(Math.random()*$scope.albumCovers.length)];
          });
        $http.get('/proxy?url=https://api.flickr.com/services/rest/&method=flickr.photos.search&api_key=9029c1520fd26e7a82992f3adad76d92&tags=concert&per_page=25&page=1&sort=interestingness-desc&accuracy=11&lat=' + localStorage.getItem('latitude') + '&lon=' + localStorage.getItem('longitude') + '&format=json&nojsoncallback=1')
          .success(function(data) {
            console.log(data);
            var allPhotos = data.photos.photo;
            // localStorage.setItem('allPhotos', allPhotos);
            $scope.featuredLocalPhoto = allPhotos[Math.floor(Math.random()*allPhotos.length)];
            $scope.picSrc = 'https://farm' + $scope.featuredLocalPhoto.farm + '.staticflickr.com/' + $scope.featuredLocalPhoto.server + '/' + $scope.featuredLocalPhoto.id + '_' + $scope.featuredLocalPhoto.secret + '.jpg';
          });
        };

      $scope.localPhoto();
    }
  });
});