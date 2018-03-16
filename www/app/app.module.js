(function(){
  'use strict';

  angular
    .module('agora', [
      'ui.router',
      'ngResource',
      'ui.indeterminate',
      'ui.bootstrap'
    ])

    .factory('User', function($resource){
       return $resource("http://localhost:24672/api/v1/users/:id", {id: '@id'}, {
         update: {
           method: 'PUT'
         },
         delete: {
           method: 'DELETE',
           headers: {'x-confirm-delete': true}
         }
       });
    })
    .factory('Group', function($resource){
       return $resource("http://localhost:24672/api/v1/users/groups/:id", {id: '@id'}, {
         update: {
           method: 'PUT'
         },
         getUsers: {
            url: "http://localhost:24672/api/v1/users/groups/:id/members",
            method: 'GET',
            isArray: true
         },
         delete: {
           method: 'DELETE',
           headers: {'x-confirm-delete': true}
         }
       });
    })
    .factory('GroupType', function($resource){
       return $resource("http://localhost:24672/api/v1/users/groups/types/:id", {id: '@id'}, {
         update: {
           method: 'PUT'
         },
         getGroups: {
            url: "http://localhost:24672/api/v1/users/groups/types/:id/members",
            method: 'GET',
            isArray: true
         },
         delete: {
           method: 'DELETE',
           headers: {'x-confirm-delete': true}
         }
       });
    })
    .factory('GroupUserList', function($resource){
       return $resource("http://localhost:24672/api/v1/users/bygroup/:id", {id: '@id'}, {
         update: {
           method: 'PUT'
         }
       });
    })
    .factory('GroupTypeGroupList', function($resource){
       return $resource("http://localhost:24672/api/v1/users/groups/bygrouptype/:id", {id: '@id'}, {
         update: {
           method: 'PUT'
         }
       });
    })
    .factory('Election', function($resource){
       return $resource("http://localhost:24672/api/v1/elections/:id", {id: '@id'}, {
         update: {
           method: 'PUT'
         },
         getSystems: {
            url: "http://localhost:24672/api/v1/elections/:id/systems",
            method: 'GET',
            isArray: true
         },
       });
    })
    .factory('Candidate', function($resource){
       return $resource("http://localhost:24672/api/v1/elections/:electionID/candidates/:id", {id: '@id', electionID: '@electionID'}, {
         update: {
           method: 'PUT'
         },
       });
    });
})();''

// (function(){
//   angular
//     .module('example', ['ngresource'])
//
//     .factory('User', userFactory)
//   ;
//
//   var userFactory = function($resource){
//     return $resource('http://localhost:7234/users/:user_id',
//       {user_id: '@user_id'},
//       {
//         get: {
//           method: 'GET',
//           isArray: true
//         }
//       }
//     );
//   };
//
// })();
