(function(){
  'use strict';

  angular.module('agora')
    .controller('welcomeController', function($scope, $rootScope, User, Election){
      $scope.$on('systemsLoaded', function() {
        console.log("going")
        $scope.nextSystem = $rootScope.election.systems[0]
        console.log($rootScope.election.systems[0])
        $rootScope.currentPage=-1
        $scope.nextPage=$rootScope.election.systems[$rootScope.currentPage+1]
      })
    })
})();
