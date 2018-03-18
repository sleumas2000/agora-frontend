(function(){
  'use strict';

  angular.module('agora')
    .controller('fptpController', function($scope, $rootScope, User, Election){
      var makeFilter = function(choice) {
        return function(candidate) {
          return candidate.CandidateID == choice
        }
      }
      $scope.setChoice = function(choice) {
        var choiceList = $rootScope.election.candidates.filter(makeFilter(choice))
        if (choiceList.length === 1) {
          $scope.fptpChoice = choiceList[0]
        } else {
          $scope.fptpChoice = {CandidateID:0,CandidateName:"",PartyID:"",PartyName:""}
        }
      }
      $scope.setChoice(0)
      $scope.testFunction = function() {
        console.log("yo")
      }
    })
})();
