(function(){
  'use strict';

  angular.module('agora')
    .controller('thankyouController', function($scope, $rootScope, User, Election){
      if (!$rootScope.isGoing) $rootScope.$broadcast('goBackHome');
      $scope.isUsed = function(system) {
        var i;
        for (i = 0; i < $rootScope.election.systems.length; i++) {
          if ($rootScope.election.systems[i].SystemShortName === system) {
            return true;
          }
        }
        return false;
      }
    })
})();
