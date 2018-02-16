(function(){
  'use strict';

  angular
    .module('agora')
    .config(function($httpProvider, $stateProvider, $urlRouterProvider, $locationProvider){
      $urlRouterProvider.otherwise('/vote');

      $stateProvider
        .state('vote', {
          url: '/vote',
          templateUrl: 'app/components/vote/voteView.html',
          controller: 'voteController'
        })
        .state('userAdmin', {
          url: '/useradmin',
          templateUrl: 'app/components/userAdmin/userAdminView.html',
          controller: 'userAdminController'
        })
        .state('groupAdmin', {
          url: '/groupadmin',
          templateUrl: 'app/components/groupAdmin/groupAdminView.html',
          controller: 'groupAdminController'
        });
      if(window.history && window.history.pushState){
        $locationProvider.html5Mode({
          enabled: true,
          requireBase: false
        })
      }
    })
})();
