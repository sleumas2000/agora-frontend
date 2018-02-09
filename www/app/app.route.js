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
        });  
      if(window.history && window.history.pushState){
        $locationProvider.html5Mode({
          enabled: true,
          requireBase: false
        })
      }
    })
})();
