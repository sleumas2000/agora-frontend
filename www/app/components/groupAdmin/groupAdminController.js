(function(){
  'use strict';

  angular.module('agora')
    .controller('groupAdminController', function($scope, GroupTypeGroupList, Group, GroupType){

      $scope.user = {
        id: 125,
        DisplayName: 'Mr S Balderson'
      };
      $scope.groups = Group.query();
      $scope.groupTypes = GroupType.query()
      $scope.$watch('typeFilter', function(value) {
        if (value) {
          console.log(value)
          $scope.groups = GroupTypeGroupList.query({id: value.GroupTypeID});
        } else {
          console.log("Nowt")
          $scope.groups = Group.query();
        }
      });
    })
})();
