(function(){
  'use strict';
  angular.module('agora')
    .controller('loginController', function($scope, $rootScope, $state, User){
      var id = Math.floor(Math.random() * (55)) + 3
      $rootScope.currentUser = $rootScope.currentUser || User.authGet({id: id});
      console.log($rootScope.currentUser)
      $rootScope.currentUser.$promise.then(function(user) {
        User.authenticateToken(user).$promise.then(function(token) {
          $rootScope.token = token.token
          console.log(token.token)
        })
      })
    })
})();
