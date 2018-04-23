(function(){
  'use strict';
  var params = params = new URLSearchParams(document.location.search.substring(1));
  const apiRoot= (params.get("ip") || "//localhost")+":24672/api/v1";
  const authRoot= (params.get("ip") || "//localhost")+":24672/api/auth";

  angular
    .module('agora', [
      'ui.router',
      'ngResource',
      'ui.bootstrap',
	  'nvd3'
    ])

    .factory('User', ['$resource', '$rootScope', function($resource,$rootScope){
       console.log("token is ",$rootScope.token)
       return $resource(apiRoot+"/users/:id", {id: '@id', token: '@token'}, {
         query: {
            method: 'GET',
            isArray: true,
            headers: {'x-access-token': $rootScope.token}
         },
         update: {
           method: 'PUT',
           headers: {'x-access-token': $rootScope.token}
         },
         delete: {
           method: 'DELETE',
           headers: {'x-confirm-delete': true, 'x-access-token': $rootScope.token}
         },
         authGet: {
           url: authRoot+'/users/:id',
           method: 'GET'
         },
         authenticateToken: {
           url: authRoot+'/authenticate',
           method: 'POST'
         }/*,
         authQuery: {
           url: authRoot+'/users',
           method: 'GET',
           isArray: true
         }*/
       });
    }])
    .factory('Group', function($resource,$rootScope){
       return $resource(apiRoot+"/users/groups/:id", {id: '@id', token: '@token'}, {
         query: {
            method: 'GET',
            isArray: true,
            headers: {'x-access-token': "webToken"}
         },
         update: {
           method: 'PUT',
           headers: {'x-access-token': "webToken"}
         },
         getUsers: {
            url: apiRoot+"/users/groups/:id/members",
            method: 'GET',
            isArray: true,
            headers: {'x-access-token': "webToken"}
         },
         delete: {
           method: 'DELETE',
           headers: {'x-confirm-delete': true, 'x-access-token': "webToken"}
         }
       });
    })
    .factory('GroupType', function($resource,$rootScope){
       return $resource(apiRoot+"/users/groups/types/:id", {id: '@id', token: '@token'}, {
         query: {
            method: 'GET',
            isArray: true,
            headers: {'x-access-token': "webToken"}
         },
         update: {
           method: 'PUT',
           headers: {'x-access-token': "webToken"}
         },
         getGroups: {
            url: apiRoot+"/users/groups/types/:id/members",
            method: 'GET',
            isArray: true,
            headers: {'x-access-token': "webToken"}
         },
         delete: {
           method: 'DELETE',
           headers: {'x-confirm-delete': true, 'x-access-token': "webToken"}
         }
       });
    })
    /*.factory('GroupUserList', function($resource,$rootScope){
       return $resource(apiRoot+"/users/bygroup/:id", {id: '@id', token: '@token'}, {
         update: {
           method: 'PUT',
           headers: {'x-access-token': "webToken"}
         }
       });
    })
    .factory('GroupTypeGroupList', function($resource,$rootScope){
       return $resource(apiRoot+"/users/groups/bygrouptype/:id", {id: '@id', token: '@token'}, {
         update: {
           method: 'PUT',
           headers: {'x-access-token': "webToken"}
         }
       });
    })*/
    .factory('Election', function($resource,$rootScope){
       return $resource(apiRoot+"/elections/:id", {id: '@id', systemIDs: '@systemIDs', token: '@token'}, {
         query: {
            method: 'GET',
            isArray: true,
            headers: {'x-access-token': "webToken" || '123Wells909'}
         },
         update: {
           method: 'PUT',
           headers: {'x-access-token': "webToken"}
         },
         getSystems: {
            url: apiRoot+"/elections/:id/systems",
            method: 'GET',
            isArray: true,
            headers: {'x-access-token': "webToken"}
         },
         setSystems: {
            url: apiRoot+'/elections/:id/systems/:systemIDs',
            method: 'POST',
            headers: {'x-access-token': "webToken"}
         },
         activate: {
           url: apiRoot+'/elections/:id/activate',
           method: 'POST',
           headers: {'x-access-token': "webToken"}
         },
         deactivate: {
           url: apiRoot+'/elections/:id/deactivate',
           method: 'POST',
           headers: {'x-access-token': "webToken"}
         },
         delete: {
            method: 'DELETE',
            headers: {'x-confirm-delete': true, 'x-access-token': "webToken"}
         }
       });
    })
    .factory('System', function($resource,$rootScope){
       return $resource(apiRoot+"/systems/:id", {id: '@id', token: '@token'}, {
         query: {
            method: 'GET',
            isArray: true,
            headers: {'x-access-token': "webToken"}
         },
         update: {
           method: 'PUT',
           headers: {'x-access-token': "webToken"}
         }
       });
    })
    .factory('ElectionCandidateLink', function($resource,$rootScope){
       return $resource(apiRoot+"/electionCandidateLinks/:electionID", {id: '@id', electionID: '@electionID', token: '@token'}, {
         query: {
            method: 'GET',
            isArray: true,
            headers: {'x-access-token': "webToken"}
         },
         update: {
           method: 'PUT',
           headers: {'x-access-token': "webToken"}
         },
         save: {
           url: apiRoot+"/electionCandidateLinks/:id",
           method: 'POST',
           headers: {'x-access-token': "webToken"}
         },
         delete: {
           url: apiRoot+"/electionCandidateLinks/:id",
           method: 'DELETE',
           headers: {'x-confirm-delete': true, 'x-access-token': "webToken"}
         }
       });
    })
    .factory('Membership', function($resource,$rootScope){
       return $resource(apiRoot+"/memberships/:groupID", {id: '@id', groupID: '@groupID', token: '@token'}, {
         query: {
            method: 'GET',
            isArray: true,
            headers: {'x-access-token': "webToken"}
         },
         update: {
           method: 'PUT',
           headers: {'x-access-token': "webToken"}
         },
         save: {
           url: apiRoot+"/memberships/:id",
           method: 'POST',
           headers: {'x-access-token': "webToken"}
         },
         delete: {
           url: apiRoot+"/memberships/:id",
           method: 'DELETE',
           headers: {'x-confirm-delete': true, 'x-access-token': "webToken"}
         }
       });
    })
    .factory('Candidate', function($resource,$rootScope){
       return $resource(apiRoot+"/candidates/:id", {id: '@id', electionID: '@electionID', token: '@token'}, {
         query: {
            method: 'GET',
            isArray: true,
            headers: {'x-access-token': "webToken"}
         },
         update: {
           method: 'PUT',
           headers: {'x-access-token': "webToken"}
         },
         getByElection: {
            url: apiRoot+"/elections/:electionID/candidates/:id",
            method: 'GET',
            isArray: true,
            headers: {'x-access-token': "webToken"}
         },
         delete: {
           method: 'DELETE',
           headers: {'x-confirm-delete': true, 'x-access-token': "webToken"}
         }
       });
    })
    .factory('Party', function($resource,$rootScope){
       return $resource(apiRoot+"/parties/:id", {id: '@id', electionID: "@electionID", token: '@token'}, {
         query: {
            method: 'GET',
            isArray: true,
            headers: {'x-access-token': "webToken"}
         },
         update: {
           method: 'PUT',
           headers: {'x-access-token': "webToken"}
         },
         getByElection: {
           method:  'GET',
           url: apiRoot+"/elections/:electionID/parties",
           isArray: true,
           headers: {'x-access-token': "webToken"}
         },
         delete: {
           method: 'DELETE',
           headers: {'x-confirm-delete': true, 'x-access-token': "webToken"}
         }
       });
    })
    .factory('Vote', function($resource,$rootScope){
       return $resource(apiRoot+"/elections/:electionID/systems/:systemShortName/votes/user/:userID", {electionID: '@electionID', systemShortName: '@systemShortName', userID: '@userID', groupID: '@groupID', token: '@token'}, {
         query: {
            method: 'GET',
            isArray: true,
            headers: {'x-access-token': "webToken"}
         },
         record: {
           url: apiRoot+"/elections/:electionID/systems/:systemShortName/votes/user/:userID",
           method: 'POST',
           headers: {'x-access-token': "webToken"}
         },
         getVotes: {
            url: apiRoot+"/elections/:electionID/votes",
            method: 'GET',
            isArray: true,
            headers: {'x-access-token': "webToken"}
         },
         getVotesByGroup: {
            url: apiRoot+"/elections/:electionID/votes/group/:groupID",
            method: 'GET',
            isArray: true,
            headers: {'x-access-token': "webToken"}
         }
       });
    });
})();

// (function(){
//   angular
//     .module('example', ['ngresource'])
//
//     .factory('User', userFactory)
//   ;
//
//   var userFactory = function($resource,$rootScope){
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
