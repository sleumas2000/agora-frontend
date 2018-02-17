(function(){
  'use strict';

  angular
    .module('agora', [
      'ui.router',
      'ngResource'
    ])

    .factory('User', function($resource){
       return $resource("http://localhost:24672/api/v1/users/:id", {id: '@id'}, {
         update: {
           method: 'PUT'
         }
       });
    })
    .factory('Group', function($resource){
       return $resource("http://localhost:24672/api/v1/users/groups/:id", {id: '@id'}, {
         update: {
           method: 'PUT'
         }
       });
    })
    .factory('GroupType', function($resource){
       return $resource("http://localhost:24672/api/v1/users/groups/types/:id", {id: '@id'}, {
         update: {
           method: 'PUT'
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
