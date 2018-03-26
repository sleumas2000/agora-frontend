(function(){
  'use strict';
  var params = params = new URLSearchParams(document.location.search.substring(1));
  const apiRoot= (params.get("ip") || "//localhost")+":24672/api/v1";

  angular
    .module('agora', [
      'ui.router',
      'ngResource',
      'ui.bootstrap'
    ])

    .factory('User', function($resource){
       return $resource(apiRoot+"/users/:id", {id: '@id'}, {
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
       return $resource(apiRoot+"/users/groups/:id", {id: '@id'}, {
         update: {
           method: 'PUT'
         },
         getUsers: {
            url: apiRoot+"/users/groups/:id/members",
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
       return $resource(apiRoot+"/users/groups/types/:id", {id: '@id'}, {
         update: {
           method: 'PUT'
         },
         getGroups: {
            url: apiRoot+"/users/groups/types/:id/members",
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
       return $resource(apiRoot+"/users/bygroup/:id", {id: '@id'}, {
         update: {
           method: 'PUT'
         }
       });
    })
    .factory('GroupTypeGroupList', function($resource){
       return $resource(apiRoot+"/users/groups/bygrouptype/:id", {id: '@id'}, {
         update: {
           method: 'PUT'
         }
       });
    })
    .factory('Election', function($resource){
       return $resource(apiRoot+"/elections/:id", {id: '@id'}, {
         update: {
           method: 'PUT'
         },
         getSystems: {
            url: apiRoot+"/elections/:id/systems",
            method: 'GET',
            isArray: true
         },
       });
    })
    .factory('Candidate', function($resource){
       return $resource(apiRoot+"/elections/:electionID/candidates/:id", {id: '@id', electionID: '@electionID'}, {
         update: {
           method: 'PUT'
         },
       });
    })
    .factory('Party', function($resource){
       return $resource(apiRoot+"/parties/:id", {id: '@id', electionID: "@electionID"}, {
         update: {
           method: 'PUT'
         },
         getByElection: {
           method:  'GET',
           url: apiRoot+"/elections/:electionID/parties",
           isArray: true
         }
       });
    })
    .factory('Vote', function($resource){
       return $resource(apiRoot+"/elections/:electionID/systems/:systemShortName/votes/user/:userID", {electionID: '@electionID', systemShortName: '@systemShortName', userID: '@userID'}, {
         record: {
           url: apiRoot+"/elections/:electionID/systems/:systemShortName/votes/user/:userID",
           method: 'POST',
         },
         getVotes: {
            url: apiRoot+"/elections/:electionID/votes",
            method: 'GET',
            isArray: true
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
