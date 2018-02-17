(function(){
  'use strict';

  angular.module('agora')
    .controller('userAdminController', function($scope, GroupUserList, GroupTypeGroupList, User, Group, GroupType){
      $scope.groups = Group.query()
      $scope.groupTypes = GroupType.query()
      // TODO: remove this
      $scope.user = {
        id: 125,
        DisplayName: 'Mr S Balderson'
      };
      // end remove
      $scope.users = User.query();
      $scope.$watch('typeFilter', applyTypeFilter);
      $scope.$watch('groupFilter', applyGroupFilter);
      var applyGroupFilter = function(value) {
        if (value) {
          $scope.users = GroupUserList.query({id: value.GroupID});
        } else {
          $scope.users = User.query();
        }
      }
      var applyTypeFilter = function(value) {
        if (value) {
          $scope.groups = GroupTypeGroupList.query({id: value.GroupTypeID});
        } else {
          $scope.groups = Group.query();
          $scope.users = User.query();
        }
      }
      $scope.newUser = new User();
      // TODO: make this use the factory
      $scope.addUser = function(){
        console.log("Submitting")
        console.log($scope.newUser)
        User.save($scope.newUser, function(){
          delete $scope.newUser;
          $scope.newUser = new User();
          applyTypeFilter($scope.typeFilter);
          applyGroupFilter($scope.groupFilter);
        });
      };
    })
})();
