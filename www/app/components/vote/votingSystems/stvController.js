(function(){
  'use strict';

  angular.module('agora')
    .controller('stvController', function($scope, $rootScope, User, Election){
      if (!$rootScope.isGoing) $rootScope.$broadcast('goBackHome');
      $rootScope.stvChoices = []
      $scope.isChosen = function(candidate) {
        var i;
        for (i = 0; i < $rootScope.stvChoices.length; i++) {
          if ($rootScope.stvChoices[i].CandidateID === candidate.CandidateID) {
            return true;
          }
        }
        return false;
      }
      $scope.positionOf = function(candidate) {
        return $rootScope.stvChoices.findIndex(x => x.CandidateID==candidate.CandidateID)+1;
      }
      $scope.setChoice = function(candidate){
        if ($scope.isChosen(candidate)) {
          $rootScope.stvChoices.splice($rootScope.stvChoices.findIndex(x => x.CandidateID==candidate.CandidateID),1);
        } else {
          $rootScope.stvChoices.push(candidate)
        }
      }
      $rootScope.sortNextPage($scope)
    })
})();
