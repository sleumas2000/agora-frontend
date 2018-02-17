(function(){
  'use strict';

  angular.module('agora')
    .controller('userAdminController', function($scope, GroupUserList, User, Group){
      $scope.groups = Group.query()//+[{GroupName: "Show All"}]
      // TODO: remove this
      $scope.user = {
        id: 125,
        DisplayName: 'Mr S Balderson'
      };
      // end remove
      $scope.users = User.query();
      $scope.$watch('groupFilter', function(value) {
        if (value) {
          $scope.users = GroupUserList.query({id: value.GroupID});
        } else {
          $scope.users = User.query();
        }
      });
    })
})();
