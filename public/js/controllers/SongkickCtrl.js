'use strict';

angular.module('SongkickCtrl', ['ngModal']).controller('SongkickController', function($scope, $http, $sce) {
  $scope.tagline = 'Show me artists like:';
  $scope.location = 'austin';

  function isTouring(band) {
    if (band.onTourUntil !== null) {return band;}
  }

  // Connect artistQuery to form value where user can input an artist they enjoy
  $scope.artistQuery = 'Darkside';
  // Do I have to leave it like '' ?
  $scope.artistId = '';
  // 
  $scope.recommendedArtists = [];
  $scope.recommendedArtistss = [];

  // Is there an easier way to follow this flow?? Callbacks????
  $scope.getArtist = function() {
    ////////////////// reset recommendedArtist array
    $scope.recommendedArtist = [];
    // Get artist ID
    var query = $http.get('http://api.songkick.com/api/3.0/search/artists.json?query=' + $scope.artist + '&apikey=QEwCZke1ncpF2MnG');
    // reset artist field
    $scope.artist = '';
    // On success, assign ID to artistID
    query.success(function(data){
      $scope.artistId = data.resultsPage.results.artist[0].id;      
      // Get related artists from the ID above
      var suggestions = $http.get('http://api.songkick.com/api/3.0/artists/' + $scope.artistId + '/similar_artists.json?apikey=QEwCZke1ncpF2MnG');
      var suggestions2 = $http.get('http://api.songkick.com/api/3.0/artists/' + $scope.artistId + '/similar_artists.json?apikey=QEwCZke1ncpF2MnG&page=2&per_page=50');
      var suggestions3 = $http.get('http://api.songkick.com/api/3.0/artists/' + $scope.artistId + '/similar_artists.json?apikey=QEwCZke1ncpF2MnG&page=3&per_page=50');

      suggestions.success(function(data) {
        $scope.recommendedArtists = $scope.recommendedArtists.concat(data.resultsPage.results.artist.filter(isTouring).slice(0,34));
        console.log('first:', $scope.recommendedArtists);

        suggestions2.success(function(data) {
          $scope.recommendedArtists = $scope.recommendedArtists.concat(data.resultsPage.results.artist.filter(isTouring).slice(0,33));
          console.log('second:', $scope.recommendedArtists);

          suggestions3.success(function(data) {
            $scope.recommendedArtists = $scope.recommendedArtists.concat(data.resultsPage.results.artist.filter(isTouring).slice(0,33));
            console.log('third:', $scope.recommendedArtists);
          
            for (var i = 0; i < $scope.recommendedArtists.length; i++) {
              (function(i) {
                $scope.recommendedArtists[i].austin = '';
                console.log($scope.recommendedArtists[i]);
                var promise = $http.get('http://api.songkick.com/api/3.0/artists/' + $scope.recommendedArtists[i].id + '/calendar.json?apikey=QEwCZke1ncpF2MnG');
                

                promise.success(function(data) {
                  console.log(data);

                  for (var j = 0; j < data.resultsPage.results.event.length; j++) {
                    // console.log($scope.recommendedArtists);
                    $scope.recommendedArtists[i].tour = data.resultsPage.results.event;
                    if (data.resultsPage.results.event[j].venue.metroArea.displayName === 'Austin') {
                      $scope.recommendedArtists[i].austin = 'yes'; 
                      console.log($scope.recommendedArtists[i]); 
                      console.log($scope.recommendedArtists[i].austin);
                    }
                  }
                });
              })(i);
            }
          });
        });     

        // var promises = [];
        // for loop blah blah here to iterate over recommendedArtists
        
        //   var promise = $http.get('whatever/recommendedArtists');
        //   // http://api.songkick.com/api/3.0/events.xml?apikey=KEY&location=sk:9179&artist_id= + {{artist ID}}
        //   promises.push(promise);
        // // end for loop

        // $q.all(promises).then(function(promisesData) {
        //   $scope.whatever = promisesData;
        // });
      });
    });
  };

$scope.names = ["quin", "emma", "derk"];

  $scope.getLocation = function() {
    var austin = $http.get('http://api.songkick.com/api/3.0/metro_areas/9179/calendar.json?apikey=QEwCZke1ncpF2MnG');

    austin.success(function(data) {
      console.log(data);
    });
  };


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
    $scope.tourModal = !$scope.tourModal;
  };

});