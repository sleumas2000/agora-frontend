(function(){
  'use strict';

  angular.module('agora')
    .controller('welcomeController', function($scope, $rootScope, User, Election){
      $scope.nextSystem = $rootScope.election.systems[0]
      console.log($rootScope.election.systems[0])
    })
})();
