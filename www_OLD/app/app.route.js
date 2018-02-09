(function(){
  'use strict';

  angular
    .module('angularapp', [
      'ui.router'
    ])
    .config(function($httpProvider, $stateProvider, $urlRouterProvider, $locationProvider){
      $urlRouterProvider.otherwise('/dashboard');
    })
})();
