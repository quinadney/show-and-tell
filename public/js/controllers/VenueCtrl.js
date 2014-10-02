'use strict';

angular.module('VenueCtrl', []).controller('VenueController', function($scope, $http, $routeParams) {
  $scope.tagline = 'Hello';
  $scope.venue = $routeParams.venue;
  $scope.venueLat = $routeParams.lat;
  $scope.venueLong = $routeParams.long;
  $scope.selectedVenue = [];
  $scope.allVenueInfo = [];
  $scope.photo = '';


  (function getVenue() {
    var promise = $http.get('https://api.foursquare.com/v2/venues/search?ll=' + $scope.venueLat + ',' + $scope.venueLong + '&categoryID=4d4b7104d754a06370d81259&query=' + $scope.venue + '&client_id=KTDWDD2EH5SQBDHHJZNJHYUHZ54JKWF5CNDNSSFE35MLACET&client_secret=ZM2QQTIBGS1IUSBUF2NTIPPA3GNNHGGOAYABO0LAATDRMQO1&v=20140701&m=foursquare');
  
    promise.success(function(data) {
      console.log('4sq venue', data);
      $scope.selectedVenue.push(data.response.venues[0]);
      $scope.venueID = data.response.venues[0].id;

      console.log($scope.selectedVenue);

      var promise2 = $http.get('https://api.foursquare.com/v2/venues/' + $scope.venueID + '?client_id=KTDWDD2EH5SQBDHHJZNJHYUHZ54JKWF5CNDNSSFE35MLACET&client_secret=ZM2QQTIBGS1IUSBUF2NTIPPA3GNNHGGOAYABO0LAATDRMQO1&v=20140701');

      var promise3 = $http.get('https://api.foursquare.com/v2/venues/' + $scope.venueID + '/photos?client_id=KTDWDD2EH5SQBDHHJZNJHYUHZ54JKWF5CNDNSSFE35MLACET&client_secret=ZM2QQTIBGS1IUSBUF2NTIPPA3GNNHGGOAYABO0LAATDRMQO1&v=20140701');

      promise3.success(function(data) {
        $scope.eventPhotos = [];
        var photos = data.response.photos.items;
        for (var i=0; i<photos.length; i++) {
          $scope.eventPhotos.push((photos[i].prefix + '400x400' + photos[i].suffix));
        }
      });

      promise2.success(function(data) { 
      //   console.log(data);
        $scope.allVenueInfo.push(data.response.venue);
        console.log('allVenueInfo', $scope.allVenueInfo);
        // console.log($scope.allVenueInfo);
        $scope.photo = data.response.venue.photos.groups[0].items[0].prefix + '400x400' + data.response.venue.photos.groups[0].items[0].suffix;
        $scope.photo1 = data.response.venue.photos.groups[0].items[0].prefix + '150x150' + data.response.venue.photos.groups[0].items[0].suffix;

        $scope.currentPic = $scope.photo;


      });
    });
console.log('eventssss', $scope.eventPhotos);
  })(); // immediately call function on load

$http.get('http://api.songkick.com/api/3.0/search/venues.json?query=' + $scope.venue + '&apikey=QEwCZke1ncpF2MnG')
  .success(function(data) {
    console.log('venue: ', data);
    $scope.songkickID = data.resultsPage.results.venue[0].id;
    $scope.venuePic = data.resultsPage.results.venue[0]
    $http.get('http://api.songkick.com/api/3.0/venues/' + $scope.songkickID + '/calendar.json?apikey=QEwCZke1ncpF2MnG')
      .success(function(data) {
        $scope.upcomingEvents = data.resultsPage.results.event;
        console.log('upcoming events:', data);
      });
  });



  $scope.changePhoto = function(event) {
    console.log('changing?');
    // $scope.$apply(
    //   function() {
        $scope.currentPic = event;
      // });
    console.log($scope.currentPic);
  };




  // if ($scope.songkickID) {
  //   $http.get('http://api.songkick.com/api/3.0/venues/' + $scope.songkickID + '/calendar.json?apikey=QEwCZke1ncpF2MnG')
  //     .success(function(data) {
  //       $scope.upcomingEvents = data.resultsPage.results.event;
  //       console.log('upcoming events:', data);
  //     });
  // } else {console.log('need songkickID');}

});