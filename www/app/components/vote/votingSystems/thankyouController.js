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
      if ($rootScope.isGoing) {
        //FPTP
        var vote = getVote()
        vote.systemShortName = "fptp"
        vote.candidateID = $rootScope.fptpChoice.CandidateID
        console.log("fptp", vote)
        Vote.save(vote)
        // AV
        for (var i = 0; i < $rootScope.avChoices.length; i++) {
          var vote = getVote()
          vote.systemShortName = "av"
          vote.candidateID = $rootScope.avChoices[i].CandidateID
          vote.position=i+1
          console.log("av", vote)
          Vote.save(vote)
        }
        if ($rootScope.avChoices.length == 0) {
          var vote = getVote()
          vote.systemShortName = "av"
          vote.candidateID = null
          console.log("avn", vote)
          Vote.save(vote)
        }
        // STV
        for (var i = 0; i < $rootScope.stvChoices.length; i++) {
          var vote = getVote()
          vote.systemShortName = "stv"
          vote.candidateID = $rootScope.stvChoices[i].CandidateID
          vote.position=i+1
          console.log("stv", vote)
          Vote.save(vote)
        }
        if ($rootScope.stvChoices.length == 0) {
          var vote = getVote()
          vote.systemShortName = "stv"
          vote.candidateID = null
          console.log("stvn", vote)
          Vote.save(vote)
        }
        // PR
        var vote = getVote()
        vote.systemShortName = "pr"
        vote.candidateID = $rootScope.prChoice.CandidateID
        console.log("pr", vote)
        Vote.save(vote)
        // SV
        console.log($rootScope.svChoices)
        if ($rootScope.svChoices[0].CandidateID == 0) {
          var vote = getVote()
          vote.systemShortName = "sv"
          vote.candidateID = null
          console.log("svn", vote)
          Vote.save(vote)
        } else {
          var vote = getVote()
          vote.systemShortName = "sv"
          vote.candidateID = $rootScope.svChoices[0].CandidateID
          vote.position=1
          console.log("sv", vote)
          Vote.save(vote)
          if ($rootScope.svChoices[1].CandidateID != 0) {
            var vote = getVote()
            vote.systemShortName = "sv"
            vote.candidateID = $rootScope.svChoices[1].CandidateID
            vote.position=2
            console.log("sv", vote)
            Vote.save(vote)
          }
        }
      }
    })
})();
