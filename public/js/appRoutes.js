angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

  $routeProvider

  // home page
  .when('/', {
    templateUrl: 'views/home.html'
  })

  .when('/gmaps', {
    templateUrl: 'views/gmaps.html',
    controller: 'GmapsController'
  })
  
  .when('/gmaps2', {
    templateUrl: 'views/gmaps2.html',
    controller: 'GmapsController'
  })

  .when('/songkick', {
    templateUrl: 'views/songkick.html',
    controller: 'SongkickController'
  })

  .when('/bike', {
    templateUrl: 'views/gmaps2.html',
    controller: 'GmapsController',
    transportation: 'BICYCLING'
  })

  .when('/bike/:id/:dog', {
    templateUrl: 'views/gmaps2.html',
    controller: 'GmapsController',
    transportation: 'BICYCLING'
  })

  .when('/bus', {
    templateUrl: 'views/gmaps2.html',
    controller: 'GmapsController',
    transportation: 'TRANSIT'
  })

  .when('/car', {
    templateUrl: 'views/gmaps2.html',
    controller: 'GmapsController',
    transportation: 'DRIVING'
  })

  .when('/walk', {
    templateUrl: 'views/gmaps2.html',
    controller: 'GmapsController',
    transportation: 'walk'
  })

  .when('/plane', {
    templateUrl: 'views/gmaps2.html',
    controller: 'GmapsController',
    transportation: 'plane'
  })

  .when('/venue', {
    templateUrl: 'views/venue.html',
    controller: 'VenueController'
  })

  .when('/venue/:venue', {
    templateUrl: 'views/venue.html',
    controller: 'VenueController'
  })

  .when('/venue/:venue/:id', {
    templateUrl: 'views/venue.html',
    controller: 'VenueController'
  })

  .when('/localVenues', {
    templateUrl: 'views/localVenues.html',
    controller: 'LocalVenuesController'
  });


  // $locationProvider.html5Mode(true);

}]);