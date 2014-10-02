'use strict';

angular.module('VenueCtrl', []).controller('VenueController', function($scope, $http, $routeParams) {
  $scope.tagline = 'Hello';
  $scope.venue = $routeParams.venue;
  $scope.venueLat = $routeParams.lat;
  $scope.venueLong = $routeParams.long;
  $scope.selectedVenue = [];
  $scope.allVenueInfo = [];
  $scope.photo = '';
  console.log($scope.songkickID);
  console.log($scope.venue);


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
        console.log('photos', data.response.photos.items);
      });

      promise2.success(function(data) { 
      //   console.log(data);
        $scope.allVenueInfo.push(data.response.venue);
        console.log('allVenueInfo', $scope.allVenueInfo);
        // console.log($scope.allVenueInfo);
        $scope.photo = data.response.venue.photos.groups[0].items[0].prefix + '400x400' + data.response.venue.photos.groups[0].items[0].suffix;
        $scope.photo1 = data.response.venue.photos.groups[0].items[0].prefix + '150x150' + data.response.venue.photos.groups[0].items[0].suffix;
        $scope.photo2 = data.response.venue.photos.groups[0].items[1].prefix + '150x150' + data.response.venue.photos.groups[0].items[1].suffix;
        $scope.photo3 = data.response.venue.photos.groups[0].items[2].prefix + '150x150' + data.response.venue.photos.groups[0].items[2].suffix;
        $scope.photo4 = data.response.venue.photos.groups[0].items[3].prefix + '150x150' + data.response.venue.photos.groups[0].items[3].suffix;
        $scope.photo5 = data.response.venue.photos.groups[0].items[4].prefix + '150x150' + data.response.venue.photos.groups[0].items[4].suffix;
        $scope.photo6 = data.response.venue.photos.groups[0].items[5].prefix + '150x150' + data.response.venue.photos.groups[0].items[5].suffix;
        $scope.photo7 = data.response.venue.photos.groups[0].items[5].prefix + '150x150' + data.response.venue.photos.groups[0].items[5].suffix;

        $scope.eventPhotos = [$scope.photo1, $scope.photo2, $scope.photo3, $scope.photo7, $scope.photo4, $scope.photo5, $scope.photo6];
        $scope.currentPic = $scope.photo;

      // $scope.eventPhotos = [
      //   {mimeType: 'image/jpg', src: $scope.photo1},
      //   {mimeType: 'image/jpg', src: $scope.photo2},
      //   {mimeType: 'image/jpg', src: $scope.photo3},
      //   {mimeType: 'image/jpg', src: $scope.photo4},
      //   {mimeType: 'image/jpg', src: $scope.photo5},
      //   {mimeType: 'image/jpg', src: $scope.photo6},        
      //   ];



      });
    });
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