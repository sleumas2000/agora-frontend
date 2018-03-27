(function(){
  'use strict';

  angular.module('agora')
    .controller('resultsController', function($scope, $rootScope, $q, User, Election, Candidate, Party, Vote){
      // shite goes here
      // TODO: remove this
      $scope.currentUser = {
        id: 125,
        DisplayName: 'Mr S Balderson'
      };
      // end remove
      if (!$rootScope.electionID) $rootScope.electionID=1;
      var promises = {
        votes: Vote.getVotes({electionID:$rootScope.electionID}).$promise,
        parties: Party.getByElection({electionID:$rootScope.electionID}).$promise,
        candidates: Candidate.query({electionID:$rootScope.electionID}).$promise
      };
      $q.all(promises).then(function(values) {
        $rootScope.parties = values.parties;
        $rootScope.candidates = values.candidates;
        $rootScope.votes = values.votes;
        startCounting();
      });
      $rootScope.prepareDict = function(votes,candidates,parties) {
        var candidateDict = {};
        var partyDict = {};
        for (var i = 0; i < candidates.length; i++) {
          candidateDict[candidates[i].CandidateID] = candidates[i];
          candidateDict[candidates[i].CandidateID].fptpVotes = candidateDict[candidates[i].CandidateID].prVotes = 0;
          candidateDict[candidates[i].CandidateID].avVotes = {};
          candidateDict[candidates[i].CandidateID].stvVotes = {};
          candidateDict[candidates[i].CandidateID].svVotes = {};
        }
        for (var i = 0; i < parties.length; i++) { //jshint ignore:line
          partyDict[parties[i].PartyID] = parties[i];
          partyDict[parties[i].PartyID].fptpVotes = partyDict[parties[i].PartyID].prVotes = 0;
          partyDict[parties[i].PartyID].avVotes = {};
          partyDict[parties[i].PartyID].stvVotes = {};
          partyDict[parties[i].PartyID].svVotes = {};
        }
        return {votes: votes, candidates: candidateDict, parties: partyDict, spoilt: {fptp: 0, av: 0, atf: 0, pr: 0, sv: 0}};
      };
      $rootScope.countFPTPs = function(data) {
        var votes = data.votes;
        var candidates = data.candidates;
        var parties = data.parties;
        var spoilt = data.spoilt;
        for (var i = 0; i < votes.length && votes[i].SystemShortName == "fptp"; i++) {
          var vote = votes[i];
          if (!vote.CandidateID) {
            spoilt.fptp ++;
          } else {
            candidates[vote.CandidateID].fptpVotes ++;
            if (vote.PartyID) parties[vote.PartyID].fptpVotes ++;
          }
        }
        return {votes: votes, candidates: candidates, parties: parties, spoilt: spoilt};
      };
      $rootScope.countPRs = function(data) {
        var votes = data.votes;
        var candidates = data.candidates;
        var parties = data.parties;
        var spoilt = data.spoilt;
        for (var i = 0; i < votes.length; i++) {
          if (votes[i].SystemShortName == "pr") {
            var vote = votes[i];
            if (!vote.CandidateID) {
              spoilt.pr ++;
            } else {
              candidates[vote.CandidateID].prVotes ++;
              if (vote.PartyID) parties[vote.PartyID].prVotes ++;
            }
          }
        }
        return {votes: votes, candidates: candidates, parties: parties, spoilt: spoilt};
      };
      $rootScope.countAVs = function(data) {
        var votes = data.votes;
        var candidates = data.candidates;
        var parties = data.parties;
        var spoilt = data.spoilt;
        var totalVotes = 0;
        for (var i = 0; i < votes.length; i++) {
          if (votes[i].SystemShortName == "av") {
            var vote = votes[i];
            if (!vote.CandidateID) {
              spoilt.av ++;
            } else if (vote.Position == 1) {
              totalVotes ++;
              candidates[vote.CandidateID].avVotes[0] = candidates[vote.CandidateID].avVotes[0] + 1 || 1;
              if (vote.PartyID) {
                parties[vote.PartyID].avVotes[0] = parties[vote.PartyID].avVotes[0] + 1 || 1;
              }
            }
          }
        }
        var finished = false
        var round = 0
        while (!finished) {
          //candidates[1].avVotes[0] = 100
          var lowest = {IDs: [0], votes: totalVotes};
          for (var i in candidates){
            if (candidates[i].avVotes[0] > totalVotes/2) {
              finished = true
            }
            if (candidates[i].avVotes[0] < lowest.votes) {
              lowest.IDs = [i]
              lowest.votes = candidates[i].avVotes[0]
            } else if (candidates[i].avVotes[0] == lowest.votes) {
              lowest.IDs += [i]
            }
          }
          if (!finished) {
            for (var i = 0; i < votes.length; i++) {
              if (lowest.IDs.indexOf(votes[i].CandidateID) >= 0) {
                console.log("@")
              }
              console.log(votes[i].CandidateID)
            }
            finished = true
          }
        }
        console.log({votes: votes, candidates: candidates, parties: parties, spoilt: spoilt});
        return {votes: votes, candidates: candidates, parties: parties, spoilt: spoilt};
      };
      function startCounting() {
        console.log($rootScope.countAVs($rootScope.countPRs($rootScope.countFPTPs($rootScope.prepareDict($rootScope.votes, $rootScope.candidates, $rootScope.parties )))));
      }
    });
})();
