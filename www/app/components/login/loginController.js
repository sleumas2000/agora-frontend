(function(){
  'use strict';
  angular.module('agora')
    .controller('loginController', function($scope, $rootScope, $state, User){
      $rootScope.currentUser = $rootScope.currentUser || {
        UserID: Math.floor(Math.random() * (55)) + 3,
        DisplayName: 'Mr S Balderson'
      };
      console.log($rootScope.currentUser)
    })
})();
      