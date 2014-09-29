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
  
  // .when('/gmaps2', {
  //   templateUrl: 'views/gmaps2.html',
  //   controller: 'GmapsController'
  // })

  // .when('/gmaps3', {
  //   templateUrl: 'views/gmaps3.html',
  //   controller: 'GmapsController'
  // })

  .when('/songkick', {
    templateUrl: 'views/songkick.html',
    controller: 'SongkickController'
  })

  .when('/bike', {
    templateUrl: 'views/gmaps.html',
    controller: 'GmapsController',
    transportation: 'BICYCLING'
  })

  // .when('/BICYCLING/:lat/:long', {
  //   templateUrl: 'views/gmaps.html',
  //   controller: 'GmapsController',
  // })

  .when('/bus', {
    templateUrl: 'views/gmaps.html',
    controller: 'GmapsController',
    transportation: 'TRANSIT'
  })

  // .when('/TRANSIT/:lat/:long', {
  //   templateUrl: 'views/gmaps.html',
  //   controller: 'GmapsController',
  // })

  .when('/car', {
    templateUrl: 'views/gmaps.html',
    controller: 'GmapsController',
    transportation: 'DRIVING'
  })

  .when('/gmaps/:lat/:long/:method', {
    templateUrl: 'views/gmaps.html',
    controller: 'GmapsController',
  })

  .when('/walk', {
    templateUrl: 'views/gmaps.html',
    controller: 'GmapsController',
    transportation: 'walk'
  })

  // .when('/gmaps/:transport/:lat/:long', {
  //   templateUrl: 'views/gmaps.html',
  //   controller: 'GmapsController',
  // })

  .when('/plane', {
    templateUrl: 'views/gmaps.html',
    controller: 'GmapsController',
    transportation: 'plane'
  })

  // .when('/plane/:lat/:long', {
  //   templateUrl: 'views/gmaps.html',
  //   controller: 'GmapsController',
  // })

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

  // .otherwise({
  //   templateUrl: 'views/main.html',
  //   controller: 'MainController'
  // });


  // $locationProvider.html5Mode(true);

}]);