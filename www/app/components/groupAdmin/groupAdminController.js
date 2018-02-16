(function(){
  'use strict';

  angular.module('agora')
    .controller('groupAdminController', function($scope, User, Group){

      $scope.user = {
        id: 125,
        DisplayName: 'Mr S Balderson'
      };
      $scope.groups = Group.query();
    })
})();
