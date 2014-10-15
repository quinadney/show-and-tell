// var suggestions = $http.get('/proxy?url=http://api.songkick.com/api/3.0/artists/' + $scope.artistId + '/similar_artists.json&apikey=QEwCZke1ncpF2MnG');


// app.factory("QuestionSetRsc", function($resource) {
//    return $resource("/class_groups/:class_group_id/question_sets/:id.json", 
//       {class_group_id: "@class_group_id", id: "@id"}, 
//       {update: {method: "PUT"}
//     });
//   });

angular.module('songkickAPI', [])
  .factory('recommendedArtists', ['$http', function($http) {

    var getRecommended = function(artistId, page) {
      return $http({
        url: '/proxy?url=http://api.songkick.com/api/3.0/artists/' + artistId + '/similar_artists.json&apikey=QEwCZke1ncpF2MnG&page=' + page + '&per_page=50'
      });
    };
    return {
      recommend: function(artistID, page) { return getRecommended(artistID, page); },
    };
  }]);




// <div ng-controller="ServiceController">
//   <label for="username">Type in a GitHub username</label>
//   <input type="text" ng-model="username" placeholder="Enter a GitHub username, like auser" />
//   <pre ng-show="username">{{ events }}</pre>
// </div>



//   app.controller('ServiceController', ['$scope', 'githubService',
//     function($scope, githubService) {
//     // Watch for changes on the username property.
//     // If there is a change, run the function
//     $scope.$watch('username', function(newUsername) {
//             // uses the $http service to call the GitHub API
//             // and returns the resulting promise
//       githubService.events(newUsername)
//         .success(function(data, status, headers) {
//                     // the success function wraps the response in data
//                     // so we need to call data.data to fetch the raw data
//           $scope.events = data.data;
//         })
//     });
// }]);