angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

  $routeProvider

  // home page
  .when('/', {
    templateUrl: 'views/home.html',
    controller: 'MainController'
  })

  // nerds page that will use the NerdController
  .when('/nerds', {
    templateUrl: 'views/nerd.html',
    controller: 'NerdController'
  })

  //
  .when('/geeks', {
    templateUrl: 'views/geek.html',
    controller: 'GeekController'
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
  });


  $locationProvider.html5Mode(true);

}]);