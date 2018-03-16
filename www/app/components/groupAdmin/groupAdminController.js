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
      $scope.newGroup = new Group();
      $scope.$watch('typeFilter', $scope.reset = function(value) {
        if (value) {
          console.log(value)
          $scope.groups = GroupType.getGroups({id: value.GroupTypeID});
          $scope.newGroup.GroupType = value
          console.log(value.GroupTypeName)
        } else {
          console.log("Nowt")
          $scope.groups = Group.query();
        }
      });
      $scope.addGroup = function(){
        console.log("Submitting")
        $scope.newGroup.GroupTypeID = $scope.newGroup.GroupType.GroupTypeID
        console.log($scope.newGroup)
        delete $scope.newGroup.GroupType
        Group.save($scope.newGroup, function(){
          delete $scope.newGroup;
          $scope.newGroup = new Group();
          $scope.reset($scope.typeFilter);
        });
      };
      $scope.deleteGroup = function(groupID,rowNumber){
        Group.delete({id: groupID});
        $scope.groups.splice(rowNumber,1)
      }
      $scope.addGroupType = function(){
        console.log("Submitting")
        console.log($scope.newGroupType)
        $scope.groupTypes.splice($scope.groupTypes.length,0,$scope.newGroupType)
        GroupType.save($scope.newGroupType, function(){
          $scope.groupTypes = GroupType.query();
          delete $scope.newGroupType;
          $scope.newGroupType = new GroupType();
        });
      };
      $scope.deleteGroupType = function(groupTypeID,rowNumber){
        GroupType.delete({id: groupTypeID});
        $scope.groupTypes.splice(rowNumber,1)
      }
    })
})();
