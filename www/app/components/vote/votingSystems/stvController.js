(function(){
  'use strict';

  angular.module('agora')
    .controller('stvController', function($scope, $rootScope, User, Election){
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
        console.log(candidate)
        if ($scope.isChosen(candidate)) {
          $scope.stvChoices.splice($rootScope.stvChoices.findIndex(x => x.CandidateID==candidate.CandidateID),1);
        } else {
          $rootScope.stvChoices.push(candidate)
        }
      }
      $scope.$on('systemsLoaded', function() {
        $rootScope.currentPage = $rootScope.currentPage + 1
        console.log("goingstv")
        console.log($rootScope.election.systems[$rootScope.currentPage+1])
        $scope.nextPage=$rootScope.election.systems[$rootScope.currentPage+1]
      })
    })
})();
