(function(){
  'use strict';

  angular
    .module('agora', [
      'ui.router',
      'ngResource'
    ])

    .factory('User', function($resource){
       return $resource("http://localhost:24672/api/v1/users/:id", {id: '@_i'}, {
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
