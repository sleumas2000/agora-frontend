(function(){
  'use strict';

  angular.module('agora')
    .controller('avController', function($scope, $rootScope, User, Election){
      if (!$rootScope.isGoing) $rootScope.$broadcast('goBackHome');
      $rootScope.avChoices = [];
      $scope.isChosen = function(candidate) {
        var i;
        for (i = 0; i < $rootScope.avChoices.length; i++) {
          if ($rootScope.avChoices[i].CandidateID === candidate.CandidateID) {
            return true;
          }
        }
        return false;
      };
      $scope.positionOf = function(candidate) {
        return $rootScope.avChoices.findIndex(x => x.CandidateID==candidate.CandidateID)+1;
      };
      $scope.setChoice = function(candidate){
        if ($scope.isChosen(candidate)) {
          $rootScope.avChoices.splice($rootScope.avChoices.findIndex(x => x.CandidateID==candidate.CandidateID),1);
        } else {
          $rootScope.avChoices.push(candidate);
        }
      };
      $rootScope.sortNextPage($scope);
    });
})();
