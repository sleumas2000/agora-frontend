(function(){
  'use strict';
  angular.module('agora')
    .controller('loginController', function($scope, $rootScope, $state, User, authService){
      function catchError(error) {
        if (error.status == 404) {
          $scope.error="Authentication Error. No Username Specified"
        } else {
          console.log(error)
          $scope.error=error.message
        }
      }
      $scope.logIn = function() {
        $rootScope.currentUser = User.authGet({UserName: $scope.username});
        $rootScope.currentUser.UserName = $scope.username
        $rootScope.currentUser.$promise.then(function(user) {
          user.Password=$scope.password
          User.authenticateToken(user).$promise.then(function(token) {
            console.log(token)
            if (token.success) {
              authService.regenService(token.token)
              $rootScope.token = token.token
              console.log(token.token)
              $state.go('vote')
            } else {
              throw token
            }
          }).catch(catchError)
        }).catch(catchError)
      }
    })
})();
