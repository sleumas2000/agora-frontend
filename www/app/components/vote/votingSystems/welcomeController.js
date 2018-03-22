(function(){
  'use strict';

  angular.module('agora')
    .controller('welcomeController', function($scope, $rootScope, User, Election){
      $scope.$on('systemsLoaded', function() {
        $rootScope.currentPage=-1
        $scope.nextPage=$rootScope.election.systems[$rootScope.currentPage+1]
        $rootScope.getGoing = function() {$rootScope.isGoing = true}
      })
    })
})();
