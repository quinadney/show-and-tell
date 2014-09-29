'use strict';

angular.module('SongkickCtrl', ['ngModal']).controller('SongkickController', function($scope, $http, $sce, $location) {
  $scope.tagline = 'Show me touring artists like:';

  function isTouring(band) {
    if (band.onTourUntil !== null) {return band;}
  }

  $scope.artistId = '';
  $scope.recommendedArtists = [];

  // Is there an easier way to follow this flow?? Callbacks????
  $scope.getArtist = function() {
    ////////////////// reset recommendedArtist array
    $scope.recommendedArtist = [];
    // Get artist ID
    var query = $http.get('http://api.songkick.com/api/3.0/search/artists.json?query=' + $scope.artist + '&apikey=QEwCZke1ncpF2MnG');
    // reset artist field
    // $scope.artist = '';
    // On success, assign ID to artistID
    query.success(function(data){
      $scope.artistId = data.resultsPage.results.artist[0].id;      
      // Get related artists from the ID above
      var suggestions = $http.get('http://api.songkick.com/api/3.0/artists/' + $scope.artistId + '/similar_artists.json?apikey=QEwCZke1ncpF2MnG');
      var suggestions2 = $http.get('http://api.songkick.com/api/3.0/artists/' + $scope.artistId + '/similar_artists.json?apikey=QEwCZke1ncpF2MnG&page=2&per_page=50');
      var suggestions3 = $http.get('http://api.songkick.com/api/3.0/artists/' + $scope.artistId + '/similar_artists.json?apikey=QEwCZke1ncpF2MnG&page=3&per_page=50');

      suggestions.success(function(data) {
        $scope.recommendedArtists = $scope.recommendedArtists.concat(data.resultsPage.results.artist.filter(isTouring).slice(0,3));
        console.log('first:', $scope.recommendedArtists);

        suggestions2.success(function(data) {
          $scope.recommendedArtists = $scope.recommendedArtists.concat(data.resultsPage.results.artist.filter(isTouring).slice(0,3));
          console.log('second:', $scope.recommendedArtists);

          suggestions3.success(function(data) {
            $scope.recommendedArtists = $scope.recommendedArtists.concat(data.resultsPage.results.artist.filter(isTouring).slice(0,3));
            console.log('third:', $scope.recommendedArtists);
          
            //loop through recommended artists and pull tour info for each
            for (var i = 0; i < $scope.recommendedArtists.length; i++) {
              // IFFI (i) to pass the number it's looping through with the rest of the async calls
              (function(i) {
                $scope.recommendedArtists[i].currentCity = 'No';
                console.log($scope.recommendedArtists[i]);
                var promise = $http.get('http://api.songkick.com/api/3.0/artists/' + $scope.recommendedArtists[i].id + '/calendar.json?apikey=QEwCZke1ncpF2MnG');
                

                promise.success(function(data) {
                  console.log(data);

                  for (var j = 0; j < data.resultsPage.results.event.length; j++) {
                    
                    /////// Parse date in different format!!!!!!!!!!!!!
                    // var newDate = data.resultsPage.results.event.start.date.split('-');
                    // var date = new Date(year, month, day)
                    // data.resultsPage.results.event.start.date = newDate;

                    $scope.recommendedArtists[i].tour = data.resultsPage.results.event;

                    if (data.resultsPage.results.event[j].venue.metroArea.displayName === 'Austin') {
                      $scope.recommendedArtists[i].currentCity = 'Yes!'; 
                      console.log($scope.recommendedArtists[i]); 
                      console.log($scope.recommendedArtists[i].currentCity);
                    }
                  }
                });
              })(i);
            }
          });
        });     

        // $q.all(promises).then(function(promisesData) {
        //   $scope.whatever = promisesData;
        // });
      });
    });
  };

  // $scope.getLocation = function() {
  //   var austin = $http.get('http://api.songkick.com/api/3.0/metro_areas/9179/calendar.json?apikey=QEwCZke1ncpF2MnG');

  //   austin.success(function(data) {
  //     console.log(data);
  //   });
  // };


  $scope.toggleModal = function(artist) {
    var spotifyID = '';
    var src = '';
    $scope.modalArtist = artist;

    var selectedArtist = $http.get('http://ws.spotify.com/search/1/artist.json?q=' + artist);
      selectedArtist.success(function(data) {
        console.log("artist info:", data);
        spotifyID = data.artists[0].href.replace('spotify:artist:', '');
        console.log("spotify ID", spotifyID);
        src = 'https://embed.spotify.com/?uri=spotify:artist:' + spotifyID;
        console.log("src", src);
        $scope.spotifyEmbedURL = $sce.trustAsResourceUrl(src);
      });
    $scope.modalShown = !$scope.modalShown;
  };

  $scope.tourModal = false;

  $scope.toggleTour = function(artist) {
    $scope.artistTour = artist.tour;
    $scope.tourModal = !$scope.tourModal;
    $scope.artistName = artist.displayName;
  };

  $scope.getClass = function(tour) {
    if (tour.location.city.indexOf('Austin') > -1) {return 'pink';}
    if (tour.ageRestriction === '14+') {return 'blue';}
    if (tour.ageRestriction === '21+') {return 'red';}
    if (tour.type === 'Festival') {return 'green';}
  };

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


  $scope.getMap = function(lat, long, type) {
    console.log(lat, long);
    $location.path(('/gmaps/' + lat + '/' + long + '/' + type));
  };

  $scope.getVenue = function(venue, id) {
    $location.path(('/venue/' + venue + '/' + id));
  };


});