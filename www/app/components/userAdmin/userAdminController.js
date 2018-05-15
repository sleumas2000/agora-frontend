(function(){
  'use strict';

  angular.module('agora')
    .controller('userAdminController', function($scope, $rootScope, $state, User, Group, GroupType){
      if (!$rootScope.currentUser) $state.go('login')
      $scope.passwords = {}
      $scope.showAdmin = $rootScope.currentUser ? $rootScope.currentUser.IsAdmin : false
      $scope.navBar = function(state) {
        for (var prop in $rootScope) {
          if (typeof $rootScope[prop] !== 'function' && prop !== "currentUser" && prop !== "token" && prop.indexOf('$') == -1 && prop.indexOf('$$') == -1) {delete $rootScope[prop];}
        }
        for (var prop in $scope) {
          if (typeof $scope[prop] !== 'function' && prop.indexOf('$') == -1 && prop.indexOf('$$') == -1) {delete $scope[prop];}
        }
        $state.transitionTo(state, {}, {reload: true, inherit: false, notify: true})
      }
      $scope.setPassword = function(userID,index) {
        let password = $scope.passwords[index]
        User.setPassword({id:userID,password:password})
        $scope.passwords[index] = ""
      }
      $scope.groups = Group.query();
      $scope.groupTypes = GroupType.query(function(resp) {
        var numGroupTypes = $scope.groupTypes.length;
        for (var i = 0; i < numGroupTypes; i++) {
          $scope.groupTypes[i].members = GroupType.getGroups({id: $scope.groupTypes[i].GroupTypeID});
          console.log($scope.groupTypes[i]);
        }
      });
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
      $scope.addUser = function(){
        console.log("Submitting");
        console.log($scope.newUser);
        User.save($scope.newUser, function(){
          delete $scope.newUser;
          $scope.newUser = new User();
          $scope.reset($scope.groupFilter);
        });
      };
      $scope.deleteUser = function(userID,rowNumber){
        User.delete({id: userID});
        $scope.users.splice(rowNumber,1);
      };
      $scope.selectAllUsers = function(usersSelected){
        if (usersSelected) {
          // select all
          var numUsers = $scope.users.length;
          for (var i = 0; i < numUsers; i++) {
            $scope.users[i].isSelected = true;
          }
        } else {
          // select all
          var numUsers = $scope.users.length; //jshint ignore:line
          for (var i = 0; i < numUsers; i++) { //jshint ignore:line
            $scope.users[i].isSelected = false;
          }
        }
      };
      $scope.validateCheckBoxes = function() {
        var numUsers = $scope.users.length;
        for (var i = 0; i < numUsers; i++) {
          if ($scope.users[i].isSelected == true) {
            $scope.usersSelected = true;
            return;
          }
        }
        $scope.usersSelected = false;
      };
      $scope.testIndeterminate = function() {
        var numGroups = $scope.groups.length;
        for (var i = 0; i < numGroups; i++) {
          $scope.groups[i].ignore = true;
          console.log($scope.groups[i]);
        }
      };
    });
})();
