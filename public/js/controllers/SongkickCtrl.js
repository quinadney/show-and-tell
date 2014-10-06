'use strict';

angular.module('SongkickCtrl', ['ngModal']).controller('SongkickController', function($scope, $http, $sce, $location, $q) {
  $scope.artistId = '';
  $scope.recommendedArtists = [];  
  $scope.tagline = 'Show me touring artists like:';
  // $scope.loadingModal = false;
  //Helper function to filter recommended artists
  function isTouring(band) {
    if (band.onTourUntil !== null) {return band;}
  }
  $scope.getArtist = function() {
    // $scope.$apply(funtion(){
    //   $scope.loadingModal = true;
    // });

    if  (localStorage.getItem('currentCity') === null) {alert("One second please..."); return;}
    $scope.city = localStorage.getItem('currentCity');
    // console.log($scope.loadingModal);
    ////////////////// reset recommendedArtist array
    $scope.recommendedArtists = [];
    // Get artist ID

    //Show's table head
    $scope.recommendedList = true;
    ////// Check if $scope.artist exists in localStorage ///////


    var query = $http.get('http://api.songkick.com/api/3.0/search/artists.json?query=' + $scope.artist + '&apikey=QEwCZke1ncpF2MnG');
    // reset artist field
    // $scope.artist = '';
    // On success, assign ID to artistID
    query.then(function(response){
      console.log('Making requests...', response);
      $scope.artistId = response.data.resultsPage.results.artist[0].id;      
      // Get related artists from the ID above
      var suggestions = $http.get('http://api.songkick.com/api/3.0/artists/' + $scope.artistId + '/similar_artists.json?apikey=QEwCZke1ncpF2MnG');
      var suggestions2 = $http.get('http://api.songkick.com/api/3.0/artists/' + $scope.artistId + '/similar_artists.json?apikey=QEwCZke1ncpF2MnG&page=2&per_page=50');
      var suggestions3 = $http.get('http://api.songkick.com/api/3.0/artists/' + $scope.artistId + '/similar_artists.json?apikey=QEwCZke1ncpF2MnG&page=3&per_page=50');

      return $q.all([suggestions, suggestions2, suggestions3]);
    })
    .then(function (responses, fail) {
      console.log('Response:', responses);
      console.log('Fail', fail);

      for (var x = 0; x < responses.length; x++) {
        $scope.recommendedArtists = $scope.recommendedArtists.concat(responses[x].data.resultsPage.results.artist.filter(isTouring).slice(0,33));
      }

      //loop through recommended artists and pull tour info for each
      // var allTours = [];
      for (var i = 0; i < $scope.recommendedArtists.length; i++) {
        // IFFI (i) to pass the number it's looping through with the rest of the async calls
        (function(i) {
          $scope.recommendedArtists[i].currentCity = null;
          console.log($scope.recommendedArtists[i]);
          var promise = $http.get('http://api.songkick.com/api/3.0/artists/' + $scope.recommendedArtists[i].id + '/calendar.json?apikey=QEwCZke1ncpF2MnG');

          promise.success(function(data) {
            console.log(data);

            for (var j = 0; j < data.resultsPage.results.event.length; j++) {
              
              $scope.recommendedArtists[i].tour = data.resultsPage.results.event;

              if (data.resultsPage.results.event[j].venue.metroArea.displayName === 'Austin') {
                $scope.recommendedArtists[i].currentCity = '(Touring in ' + $scope.city + '!)'; 
                console.log($scope.recommendedArtists[i]); 
                console.log($scope.recommendedArtists[i].currentCity);
              }
            }
            localStorage.setItem($scope.artist, $scope.recommendedArtists);
          });

        })(i);
      }
    });
  };

  $scope.toggleModal = function(artist) {
    var spotifyID = '';
    var src = '';
    $scope.modalArtist = artist;

    var selectedArtist = $http.get('http://ws.spotify.com/search/1/artist.json?q=' + artist);
      selectedArtist.success(function(data) {
        console.log('artist info:', data);
        spotifyID = data.artists[0].href.replace('spotify:artist:', '');
        console.log('spotify ID', spotifyID);
        src = 'https://embed.spotify.com/?uri=spotify:artist:' + spotifyID;
        console.log('src', src);
        $scope.spotifyEmbedURL = $sce.trustAsResourceUrl(src);
      });
    $scope.modalShown = !$scope.modalShown;
  };

  $scope.tourModal = false;

  $scope.toggleTour = function(artist) {
    console.log('tour', artist);
    $scope.artistTour = artist.tour;
    $scope.tourModal = !$scope.tourModal;
    $scope.artistName = artist.displayName;
    $scope.getClass(artist.tour);
    console.log($scope.tourModal);
  };

  $scope.getClass = function(tour) {
    console.log('colors');
    if (tour.location.city.indexOf('Austin') > -1 && tour.type === 'Festival') {return 'orange';}
    if (tour.location.city.indexOf('Austin') > -1) {return 'pink';}
    if (tour.ageRestriction === '14+') {return 'blue';}
    if (tour.ageRestriction === '21+') {return 'red';}
    if (tour.type === 'Festival') {return 'green';}
  };

  $scope.getMap = function(lat, long, type) {
    console.log(lat, long);
    $location.path(('/gmaps/' + lat + '/' + long + '/' + type));
  };

  $scope.getVenue = function(venue, lat, long) {
    $location.path(('/venue/' + venue + '/' + lat + '/' + long));
  };


});