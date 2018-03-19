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
        .state('av', {
          url: '/vote/av',
          views: {
            'content@': {
              templateUrl: '/app/components/vote/voteView.html',
              controller: 'voteController'
            },
            'voteContainer@av': {
              templateUrl: '/app/components/vote/votingSystems/avView.html',
              controller: 'avController'
            }
          }
        })
        .state('stv', {
          url: '/vote/stv',
          views: {
            'content@': {
              templateUrl: '/app/components/vote/voteView.html',
              controller: 'voteController'
            },
            'voteContainer@stv': {
              templateUrl: '/app/components/vote/votingSystems/stvView.html',
              controller: 'stvController'
            }
          }
        })
        .state('pr', {
          url: '/vote/pr',
          views: {
            'content@': {
              templateUrl: '/app/components/vote/voteView.html',
              controller: 'voteController'
            },
            'voteContainer@pr': {
              templateUrl: '/app/components/vote/votingSystems/prView.html',
              controller: 'prController'
            }
          }
        })
        .state('sv', {
          url: '/vote/sv',
          views: {
            'content@': {
              templateUrl: '/app/components/vote/voteView.html',
              controller: 'voteController'
            },
            'voteContainer@sv': {
              templateUrl: '/app/components/vote/votingSystems/svView.html',
              controller: 'svController'
            }
          }
        })

        .state('thankyou', {
          url: '/vote/thankyou',
          views: {
            'content@': {
              templateUrl: '/app/components/vote/voteView.html',
              controller: 'voteController'
            },
            'voteContainer@thankyou': {
              templateUrl: '/app/components/vote/votingSystems/thankyouView.html',
              controller: 'thankyouController'
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
