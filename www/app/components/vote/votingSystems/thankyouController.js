(function(){
  'use strict';

  angular.module('agora')
    .controller('thankyouController', function($scope, $rootScope, User, Election, Vote){
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

      // Submitting results to the database
      function getVote() {
        var vote = new Vote()
        vote.userID = $rootScope.currentUser.UserID
        vote.electionID = $rootScope.election.ElectionID
        return vote
      }
      $scope.$on("systemsLoaded", function() {
        if ($rootScope.isGoing) {
          //FPTP
          if ($scope.isUsed("fptp")) {
            var vote = getVote()
            vote.systemShortName = "fptp"
            vote.candidateID = $rootScope.fptpChoice.CandidateID
            Vote.record(vote)
          }
          // AV
          if ($scope.isUsed("av")) {
            for (var i = 0; i < $rootScope.avChoices.length; i++) {
              var vote = getVote()
              vote.systemShortName = "av"
              vote.candidateID = $rootScope.avChoices[i].CandidateID
              vote.position=i+1
              Vote.record(vote)
            }
            if ($rootScope.avChoices.length == 0) {
              var vote = getVote()
              vote.systemShortName = "av"
              vote.candidateID = null
              Vote.record(vote)
            }
          }
          // STV
          if ($scope.isUsed("stv")) {
            for (var i = 0; i < $rootScope.stvChoices.length; i++) {
              var vote = getVote()
              vote.systemShortName = "stv"
              vote.candidateID = $rootScope.stvChoices[i].CandidateID
              vote.position=i+1
              Vote.record(vote)
            }
            if ($rootScope.stvChoices.length == 0) {
              var vote = getVote()
              vote.systemShortName = "stv"
              vote.candidateID = null
              Vote.record(vote)
            }
          }
          // PR
          if ($scope.isUsed("pr")) {
            var vote = getVote()
            vote.systemShortName = "pr"
            vote.candidateID = $rootScope.prChoice.CandidateID
            Vote.record(vote)
          }
          // SV
          if ($scope.isUsed("sv")) {
            if ($rootScope.svChoices[0].CandidateID == 0) {
              var vote = getVote()
              vote.systemShortName = "sv"
              vote.candidateID = null
              Vote.record(vote)
            } else {
              var vote = getVote()
              vote.systemShortName = "sv"
              vote.candidateID = $rootScope.svChoices[0].CandidateID
              vote.position=1
              Vote.record(vote)
              if ($rootScope.svChoices[1].CandidateID != 0) {
                var vote = getVote()
                vote.systemShortName = "sv"
                vote.candidateID = $rootScope.svChoices[1].CandidateID
                vote.position=2
                Vote.record(vote)
              }
            }
          }
        }
      })
    })
})();
