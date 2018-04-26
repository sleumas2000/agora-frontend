(function(){
  'use strict';

  angular.module('agora')
    .controller('memberAdminController', function($scope, $rootScope, $state, Group, User, Membership){
      if (!$rootScope.currentUser) $state.go('login')
      $scope.showAdmin = true
      if (!$rootScope.group) {$state.go('groupAdmin')}
      $scope.navBar = function(state) {
        for (var prop in $rootScope) {
          if (typeof $rootScope[prop] !== 'function' && prop !== "currentUser" && prop !== "token" && prop.indexOf('$') == -1 && prop.indexOf('$$') == -1) {delete $rootScope[prop];}
        }
        for (var prop in $scope) {
          if (typeof $scope[prop] !== 'function' && prop.indexOf('$') == -1 && prop.indexOf('$$') == -1) {delete $scope[prop];}
        }
        $state.transitionTo(state, {}, {reload: true, inherit: false, notify: true})
      }
      $scope.memberships = Membership.query({groupID: $rootScope.group.GroupID})
      $scope.users = User.query();
      $scope.newUser = new User();
      $scope.addMembership = function(){
        console.log("Membershiping")
        var newMembership = new Membership()
        newMembership.UserID = $scope.newUser.UserID
        newMembership.GroupID = $rootScope.group.GroupID
        Membership.save(newMembership, function(){
          delete $scope.newGroup;
          $scope.newUser = new User();
          $scope.memberships = Membership.query({groupID: $rootScope.group.GroupID})
        });
        newMembership.DisplayName = $scope.newUser.UserName
        $scope.memberships.push(newMembership)
      };
      $scope.deleteMembership = function(membershipID,rowNumber){
        Membership.delete({id: membershipID});
        $scope.memberships.splice(rowNumber,1)
      }
    })
})();
