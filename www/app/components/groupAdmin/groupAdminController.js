(function(){
  'use strict';

  angular.module('agora')
    .controller('groupAdminController', function($scope, GroupUserList, Group, GroupType){

      $scope.user = {
        id: 125,
        DisplayName: 'Mr S Balderson'
      };
      $scope.groups = Group.query();
      $scope.groupTypes = GroupType.query()
    })
})();
