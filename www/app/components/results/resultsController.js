(function(){
  'use strict';

  angular.module('agora')
    .controller('resultsController', function($scope, $rootScope, $q, User, Election, Candidate, Party, Vote){
      // shite goes here
      if (!$rootScope.electionID) $rootScope.electionID=1;
      var promises = {
        votes: Vote.getVotes({electionID:$rootScope.electionID}).$promise,
        parties: Party.getByElection({electionID:$rootScope.electionID}).$promise,
        candidates: Candidate.query({electionID:$rootScope.electionID}).$promise
      }
      $q.all(promises).then((values) => {
        $rootScope.parties = values.parties
        $rootScope.candidates = values.candidates
        $rootScope.votes = values.votes
        startCounting()
      })
      $rootScope.prepareDict = function(votes,candidates,parties) {
        var candidateDict = {}
        var partyDict = {}
        for (var i = 0; i < candidates.length; i++) {
          candidateDict[candidates[i].CandidateID] = candidates[i]
          candidateDict[candidates[i].CandidateID].fptpVotes = candidateDict[candidates[i].CandidateID].prVotes = 0
          candidateDict[candidates[i].CandidateID].avVotes = candidateDict[candidates[i].CandidateID].stvVotes = candidateDict[candidates[i].CandidateID].svVotes = {}
        }
        for (var i = 0; i < parties.length; i++) {
          partyDict[parties[i].PartyID] = parties[i]
          partyDict[parties[i].PartyID].fptpVotes = partyDict[parties[i].PartyID].prVotes = 0
          partyDict[parties[i].PartyID].avVotes = partyDict[parties[i].PartyID].stvVotes = partyDict[parties[i].PartyID].svVotes = {}
        }
        return {votes: votes, candidates: candidateDict, parties: partyDict, spoilt: {fptp: 0, av: 0, atf: 0, pr: 0, sv: 0}}
      }
      $rootScope.countFPTPs = function(data) {
        var votes = data.votes;
        var candidates = data.candidates;
        var parties = data.parties;
        var spoilt = data.spoilt;
        for (var i = 0; i < votes.length && votes[i].SystemShortName == "fptp"; i++) {
          if (votes[i].SystemShortName == "fptp") {console.log("yeah")} else {console.log("no",votes[i])};
          var vote = votes[i]
          if (!vote.CandidateID) {
            console.log(vote.VoteID)
            spoilt.fptp += 1
          } else {
            candidates[vote.CandidateID].fptpVotes += 1
            if (!vote.PartyID) parties[vote.PartyID].fptpVotes += 1
          }
        }
        return {votes: votes, candidates: candidates, parties: parties, spoilt: spoilt}
      };
      $rootScope.countPRs = function(data) {
        var votes = data.votes;
        var candidates = data.candidates;
        var parties = data.parties;
        var spoilt = data.spoilt;
        for (var i = 0; i < votes.length; i++) {
          if (votes[i].SystemShortName == "pr") {console.log("yea2h")
            var vote = votes[i]
            console.log(vote.VoteID)
            if (!vote.CandidateID) {
              console.log("s")
              spoilt.pr += 1
            } else {
              console.log("n")
              candidates[vote.CandidateID].prVotes ++
              if (!vote.PartyID) parties[vote.PartyID].prVotes ++ && console.log("y")
            }
          } else {console.log("no")};
        }
        return {votes: votes, candidates: candidates, parties: parties, spoilt: spoilt}
      };
      function startCounting() {
        console.log($rootScope.countPRs($rootScope.countFPTPs($rootScope.prepareDict($rootScope.votes, $rootScope.candidates, $rootScope.parties ))))
      }
    })
})();
