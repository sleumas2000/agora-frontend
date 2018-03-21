(function(){
  'use strict';

  angular.module('agora')
    .controller('svController', function($scope, $rootScope, User, Election){
      if (!$rootScope.isGoing) $rootScope.$broadcast('goBackHome');
      $rootScope.svChoices = [{CandidateID:0,CandidateName:"",PartyID:"",PartyName:""},{CandidateID:0,CandidateName:"",PartyID:"",PartyName:""}]
      var makeFilter = function(choice) {
        return function(candidate) {
          return candidate.CandidateID == choice
        }
      }
      $scope.isChosen = function(candidate) {
        var i;
        for (i = 0; i < $rootScope.svChoices.length; i++) {
          if ($rootScope.svChoices[i].CandidateID === candidate.CandidateID) {
            return true;
          }
        }
        return false;
      }
      $scope.setChoice = function(which,choice) {
        console.log(which,choice);
        var choiceList = $rootScope.election.candidates.filter(makeFilter(choice))
        if (choiceList.length === 1 && $rootScope.svChoices[which] != choiceList[0]) {
          if (which == 1) {
            if ($rootScope.svChoices[0].CandidateID == 0 || $rootScope.svChoices[0].CandidateID == choiceList[0].CandidateID) {
              return;
            }
          } else if (which == 0) {
            if ($rootScope.svChoices[1].CandidateID == choiceList[0].CandidateID) {
              $rootScope.svChoices[1] = {CandidateID:0,CandidateName:"",PartyID:"",PartyName:""}
            }
          };
          $rootScope.svChoices[which] = choiceList[0]
        } else {
          $rootScope.svChoices[which] = {CandidateID:0,CandidateName:"",PartyID:"",PartyName:""}
        }
        if ($rootScope.svChoices[0].CandidateID == 0) {
          $rootScope.svChoices[0] = $rootScope.svChoices[1]
          $rootScope.svChoices[1] = {CandidateID:0,CandidateName:"",PartyID:"",PartyName:""}
        }
      }
      $scope.setChoice(0,0);
      $scope.setChoice(1,0);
      $rootScope.sortNextPage($scope)
      /*$scope.$on('systemsLoaded', function() {
        $rootScope.currentPage = $rootScope.currentPage + 1
        console.log("goingsv")
        console.log($rootScope.election.systems[$rootScope.currentPage+1])
        $scope.nextPage=$rootScope.election.systems[$rootScope.currentPage+1]
      })*/
    })
})();
