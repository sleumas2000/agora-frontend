(function(){
  'use strict';

  angular.module('agora')
    .controller('welcomeController', function($scope, $rootScope, User, Election){
      $scope.$on('systemsLoaded', function() {
        console.log("going")
        console.log($rootScope.election.systems[0])
        $rootScope.currentPage=-1
        $scope.nextPage=$rootScope.election.systems[$rootScope.currentPage+1]
        $rootScope.isGoing = true
      })
    })
})();
