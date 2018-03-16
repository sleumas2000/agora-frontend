(function(){
  'use strict';

  angular
    .module('agora')
    .config(function($httpProvider, $stateProvider, $urlRouterProvider, $locationProvider){
      $urlRouterProvider.otherwise('/vote');

      $stateProvider
        .state('vote', {
          url: '/vote',
          views: {
            'content@': {
              templateUrl: '/app/components/vote/voteView.html',
              controller: 'voteController'
            },
            'voteContainer@vote': {
              templateUrl: '/app/components/vote/votingSystems/welcomeView.html',
              controller: 'welcomeController'
            }
          }
        })
        .state('userAdmin', {
          url: '/useradmin',
          views: {
            'content@': {
              templateUrl: '/app/components/userAdmin/userAdminView.html',
              controller: 'userAdminController'
            }
          }
        })
        .state('groupAdmin', {
          url: '/groupadmin',
          views: {
            'content@': {
              templateUrl: '/app/components/groupAdmin/groupAdminView.html',
              controller: 'groupAdminController'
            }
          }
        })

        // Voting systems

        .state('fptp', {
          url: '/vote/fptp',
          views: {
            'content@': {
              templateUrl: '/app/components/vote/voteView.html',
              controller: 'voteController'
            },
            'voteContainer@fptp': {
              templateUrl: '/app/components/vote/votingSystems/fptpView.html',
              controller: 'fptpController'
            }
          }
        })
        ;
      if(window.history && window.history.pushState){
        $locationProvider.html5Mode({
          enabled: true,
          requireBase: false
        })
      }
    })
})();
