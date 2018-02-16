(function(){
  'use strict';

  angular.module('agora')
    .controller('userAdminController', function($scope, User){

      $scope.user = {
        id: 125,
        DisplayName: 'Mr S Balderson'
      };
      $scope.users = User.query();
    })
})();
