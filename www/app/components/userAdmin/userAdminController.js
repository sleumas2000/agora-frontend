(function(){
  'use strict';

  angular.module('agora')
    .controller('userAdminController', function($scope, GroupUserList, GroupTypeGroupList, User, Group, GroupType){
      $scope.groups = Group.query()
      $scope.groupTypes = GroupType.query(function(resp) {
        var numGroupTypes = $scope.groupTypes.length
        for (var i = 0; i < numGroupTypes; i++) {
          $scope.groupTypes[i].members = GroupType.getGroups({id: $scope.groupTypes[i].GroupTypeID});
          console.log($scope.groupTypes[i]);
        };
      })
      // TODO: remove this
      $scope.user = {
        id: 125,
        DisplayName: 'Mr S Balderson'
      };
      // end remove
      $scope.users = User.query();
      $scope.$watch('typeFilter', function(value) {
        if (value) {
          $scope.groups = GroupType.getGroups({id: value.GroupTypeID});
        } else {
          $scope.groups = Group.query();
          $scope.users = User.query();
        }
      });
      $scope.$watch('groupFilter', $scope.reset = function(value) {
        if (value) {
          $scope.users = Group.getUsers({id: value.GroupID});
        } else {
          $scope.users = User.query();
        }
      });
      $scope.newUser = new User();
      // TODO: make this use the factory
      $scope.addUser = function(){
        console.log("Submitting")
        console.log($scope.newUser)
        User.save($scope.newUser, function(){
          delete $scope.newUser;
          $scope.newUser = new User();
          $scope.reset($scope.groupFilter);
        });
      };
      $scope.deleteUser = function(userID,rowNumber){
        User.delete({id: userID});
        $scope.users.splice(rowNumber,1)
      };
      $scope.selectAllUsers = function(usersSelected){
        if (usersSelected) {
          // select all
          var numUsers = $scope.users.length
          for (var i = 0; i < numUsers; i++) {
            $scope.users[i].isSelected = true
          };
        } else {
          // select all
          var numUsers = $scope.users.length
          for (var i = 0; i < numUsers; i++) {
            $scope.users[i].isSelected = false
          };
        };
      };
      $scope.validateCheckBoxes = function() {
        var numUsers = $scope.users.length
        for (var i = 0; i < numUsers; i++) {
          if ($scope.users[i].isSelected == true) {
            $scope.usersSelected = true
            return
          }
        }
        $scope.usersSelected = false
      };
      $scope.testIndeterminate = function() {
        var numGroups = $scope.groups.length
        for (var i = 0; i < numGroups; i++) {
          $scope.groups[i].ignore = true
          console.log($scope.groups[i])
        };
      }
    })
})();
