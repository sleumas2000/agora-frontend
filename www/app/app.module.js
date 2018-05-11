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
       return $resource(apiRoot+"/users/:id", {id: '@id', UserName: '@UserName', token: '@token'}, {
         query: {
            method: 'GET',
            isArray: true,

         },
         update: {
           method: 'PUT',

         },
         delete: {
           method: 'DELETE',
           headers: {'x-confirm-delete': true, 'x-access-token': $rootScope.token}
         },
         authGet: {
           url: authRoot+'/users/:UserName',
           method: 'GET'
         },
         authenticateToken: {
           url: authRoot+'/authenticate',
           method: 'POST'
         },
         setPassword: {
           url: apiRoot+"/users/:id/password",
           method: 'POST'
         }
       });
    }])
    .factory('Group', function($resource,$rootScope){
       return $resource(apiRoot+"/users/groups/:id", {id: '@id', token: '@token'}, {
         query: {
            method: 'GET',
            isArray: true,

         },
         update: {
           method: 'PUT',

         },
         getUsers: {
            url: apiRoot+"/users/groups/:id/members",
            method: 'GET',
            isArray: true,

         },
         delete: {
           method: 'DELETE',
           headers: {'x-confirm-delete': true}
         }
       });
    })
    .factory('GroupType', function($resource,$rootScope){
       return $resource(apiRoot+"/users/groups/types/:id", {id: '@id', token: '@token'}, {
         query: {
            method: 'GET',
            isArray: true,

         },
         update: {
           method: 'PUT',

         },
         getGroups: {
            url: apiRoot+"/users/groups/types/:id/members",
            method: 'GET',
            isArray: true,

         },
         delete: {
           method: 'DELETE',
           headers: {'x-confirm-delete': true}
         }
       });
    })
    .factory('Election', function($resource,$rootScope){
       return $resource(apiRoot+"/elections/:id", {id: '@id', systemIDs: '@systemIDs', token: '@token'}, {
         query: {
            method: 'GET',
            isArray: true,

         },
         queryActive: {
            url: apiRoot+'/elections/active',
            method: 'GET',
            isArray: true,

         },
         update: {
           method: 'PUT',

         },
         getSystems: {
            url: apiRoot+"/elections/:id/systems",
            method: 'GET',
            isArray: true,

         },
         setSystems: {
            url: apiRoot+'/elections/:id/systems/:systemIDs',
            method: 'POST',

         },
         activate: {
           url: apiRoot+'/elections/:id/activate',
           method: 'POST',

         },
         deactivate: {
           url: apiRoot+'/elections/:id/deactivate',
           method: 'POST',

         },
         delete: {
            method: 'DELETE',
            headers: {'x-confirm-delete': true}
         }
       });
    })
    .factory('System', function($resource,$rootScope){
       return $resource(apiRoot+"/systems/:id", {id: '@id', token: '@token'}, {
         query: {
            method: 'GET',
            isArray: true,

         },
         update: {
           method: 'PUT',

         }
       });
    })
    .factory('ElectionCandidateLink', function($resource,$rootScope){
       return $resource(apiRoot+"/electionCandidateLinks/:electionID", {id: '@id', electionID: '@electionID', token: '@token'}, {
         query: {
            method: 'GET',
            isArray: true,

         },
         update: {
           method: 'PUT',

         },
         save: {
           url: apiRoot+"/electionCandidateLinks/:id",
           method: 'POST',

         },
         delete: {
           url: apiRoot+"/electionCandidateLinks/:id",
           method: 'DELETE',
           headers: {'x-confirm-delete': true}
         }
       });
    })
    .factory('Membership', function($resource,$rootScope){
       return $resource(apiRoot+"/memberships/:groupID", {id: '@id', groupID: '@groupID', token: '@token'}, {
         query: {
            method: 'GET',
            isArray: true,

         },
         update: {
           method: 'PUT',

         },
         save: {
           url: apiRoot+"/memberships/:id",
           method: 'POST',

         },
         delete: {
           url: apiRoot+"/memberships/:id",
           method: 'DELETE',
           headers: {'x-confirm-delete': true}
         }
       });
    })
    .factory('Candidate', function($resource,$rootScope){
       return $resource(apiRoot+"/candidates/:id", {id: '@id', electionID: '@electionID', token: '@token'}, {
         query: {
            method: 'GET',
            isArray: true,

         },
         update: {
           method: 'PUT',

         },
         getByElection: {
            url: apiRoot+"/elections/:electionID/candidates/:id",
            method: 'GET',
            isArray: true,

         },
         delete: {
           method: 'DELETE',
           headers: {'x-confirm-delete': true}
         }
       });
    })
    .factory('Party', function($resource,$rootScope){
       return $resource(apiRoot+"/parties/:id", {id: '@id', electionID: "@electionID", token: '@token'}, {
         query: {
            method: 'GET',
            isArray: true,

         },
         update: {
           method: 'PUT',

         },
         getByElection: {
           method:  'GET',
           url: apiRoot+"/elections/:electionID/parties",
           isArray: true,

         },
         delete: {
           method: 'DELETE',
           headers: {'x-confirm-delete': true}
         }
       });
    })
    .factory('Vote', function($resource,$rootScope){
       return $resource(apiRoot+"/elections/:electionID/systems/:systemShortName/votes/user/:userID", {electionID: '@electionID', systemShortName: '@systemShortName', userID: '@userID', groupID: '@groupID', token: '@token'}, {
         query: {
            method: 'GET',
            isArray: true,

         },
         record: {
           url: apiRoot+"/elections/:electionID/systems/:systemShortName/votes/user/:userID",
           method: 'POST',

         },
         getVotes: {
            url: apiRoot+"/elections/:electionID/votes",
            method: 'GET',
            isArray: true,

         },
         getVotesByGroup: {
            url: apiRoot+"/elections/:electionID/votes/group/:groupID",
            method: 'GET',
            isArray: true,

         }
       });
    })
    .factory('authService', ['$rootScope', function($rootScope){
			return {
        getToken: function(){
          return $rootScope.token
        },
        regenService: function(token){
          this.getToken = function(){
            return token
          }
        }
      }
		}])
    .factory('jwtInjector', ['$q', '$location', 'authService', function($q, $location, authService){
			var jwtInjector = {
				'request': function(config) {
					if(authService.getToken()){
						config.headers['x-access-token'] = authService.getToken();
					}
					return config;
				}
			};
			return jwtInjector;
		}]).config(['$httpProvider', function($httpProvider) {
		    $httpProvider.interceptors.push('jwtInjector');
		}]);

    ;
})();
