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

    // Get artist ID
    var query = $http.get('http://api.songkick.com/api/3.0/search/artists.json?query=' + $scope.artist + '&apikey=QEwCZke1ncpF2MnG');
    // reset artist field and recommendedArtist array
    $scope.artist = '';
    $scope.recommendedArtist = [];
    
    // On success, assign ID to artistID
    query.success(function(data){
      $scope.artistId = data.resultsPage.results.artist[0].id;      
      // Get related artists from the ID above
      var suggestions = $http.get('http://api.songkick.com/api/3.0/artists/' + $scope.artistId + '/similar_artists.json?apikey=QEwCZke1ncpF2MnG');
      var suggestions2 = $http.get('http://api.songkick.com/api/3.0/artists/' + $scope.artistId + '/similar_artists.json?apikey=QEwCZke1ncpF2MnG&page=2&per_page=50');
      var suggestions3 = $http.get('http://api.songkick.com/api/3.0/artists/' + $scope.artistId + '/similar_artists.json?apikey=QEwCZke1ncpF2MnG&page=3&per_page=50');
      // var suggestions4 = $http.get('http://api.songkick.com/api/3.0/artists/' + $scope.artistId + '/similar_artists.json?apikey=QEwCZke1ncpF2MnG&page=4&per_page=50');
      ///////!!!!!!!!!!! Need to combine suggestion calls into one array AND search those in nearby tours!!!!
      
      // suggestions2.success(function(data) {
      //   $scope.recommendedArtistss = (data.resultsPage.results.artist.filter(isTouring).slice(0,30));
      //   console.log("second:", $scope.recommendedArtistss);
      // });

      suggestions.success(function(data) {
        $scope.recommendedArtists = $scope.recommendedArtists.concat(data.resultsPage.results.artist.filter(isTouring).slice(0,34));
        console.log("after suggestions: ", $scope.recommendedArtists);

        suggestions2.success(function(data) {
          $scope.recommendedArtists = $scope.recommendedArtists.concat(data.resultsPage.results.artist.filter(isTouring).slice(0,33));
          console.log("second:", $scope.recommendedArtists);

          suggestions3.success(function(data) {
            $scope.recommendedArtists = $scope.recommendedArtists.concat(data.resultsPage.results.artist.filter(isTouring).slice(0,33));
            console.log("third:", $scope.recommendedArtists);
          });
        });
        // suggestions3.success(function(data) {
        //   $scope.recommendedArtists = $scope.recommendedArtists.concat(data.resultsPage.results.artist.filter(isTouring).slice(0,30));
        //   console.log("third:", $scope.recommendedArtists);
        // });
        // suggestions4.success(function(data) {
        //   // $scope.recommendedArtists = $scope.recommendedArtists.concat(data.resultsPage.results.artist.filter(isTouring).slice(0,30));
        //   console.log("fourth:", data);
        // });


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
     

        // var promises = [];
        // for loop blah blah here to iterate over recommendedArtists
        for (var i = 0; i < $scope.recommendedArtists.length; i++) {
          // var promise = $http.get('http://api.songkick.com/api/3.0/events.json?apikey=QEwCZke1ncpF2MnG&location=sk:9179&artist_id=' + $scope.recommendedArtists[i].id);
          var promise = $http.get('http://api.songkick.com/api/3.0/artists/' + $scope.recommendedArtists[i].id + '/calendar.json?apikey=QEwCZke1ncpF2MnG');
          // console.log(promise);
          promise.success(function(data) {
            console.log("tours: ", data.resultsPage);
          });
        }
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

  $scope.getLocation = function() {
    var austin = $http.get('http://api.songkick.com/api/3.0/metro_areas/9179/calendar.json?apikey=QEwCZke1ncpF2MnG');

    austin.success(function(data) {
      console.log(data);
    });
  };

  $scope.SpotifyLink = function(name) {
    var spotifyID = '';
    var artist = $http.get('http://ws.spotify.com/search/1/artist.json?q=' + name);
    console.log('yay');
    artist.success(function(data) {
      spotifyID = data.artists[0].href.replace('spotify:artist:', '');
      console.log(spotifyID);
      window.location = 'https://play.spotify.com/artist/' + spotifyID;
    });
    // $http.get('https://api.spotify.com/v1/artists/{id}')
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


    // var src = 'https://embed.spotify.com/?uri=spotify:artist:6oCb5tMbdBFZITsueS9EcI' + artist.id;
    // $scope.spotifyEmbedURL = $sce.trustAsResourceUrl(src);
    $scope.modalShown = !$scope.modalShown;
    // console.log(artistID);
    // $scope.spotifyID = artistID;
    // $scope.url = 'https://embed.spotify.com/?uri=spotify:artist:' + artistID;
    // console.log($scope.url);
  };


    // $scope.clickToOpen = function () {
    //   console.log("open");
    //     ngDialog.open({ template: 'popupTmpl.html' });
    // };


  // $scope.open = function() {
  //   console.log('open');
  //   $scope.showModal = true;
  // };

  // $scope.ok = function() {
  //   console.log('ok');
  //   $scope.showModal = false;
  // };

  // $scope.cancel = function() {
  //   console.log('cancel');
  //   $scope.showModal = false;
  // };
});

// .directive('modalDialog', function() {
//   return {
//     restrict: 'E',
//     scope: {
//       show: '='
//     },
//     modalShown: false,
//     replace: true, // Replace with the template below
//     transclude: true, // we want to insert custom content inside the directive
//     link: function(scope, element, attrs) {
//       scope.dialogStyle = {};
//       if (attrs.width)
//         scope.dialogStyle.width = attrs.width;
//       if (attrs.height)
//         scope.dialogStyle.height = attrs.height;
//       scope.hideModal = function() {
//         scope.show = false;
//       };
//     },
//     template: '...' // See below
//   };
// });