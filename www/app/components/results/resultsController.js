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
        candidateDict.length = candidates.length
        for (var i = 0; i < parties.length; i++) { //jshint ignore:line
          partyDict[parties[i].PartyID] = parties[i];
          partyDict[parties[i].PartyID].fptpVotes = partyDict[parties[i].PartyID].prVotes = 0;
          partyDict[parties[i].PartyID].avVotes = {};
          partyDict[parties[i].PartyID].stvVotes = {};
          partyDict[parties[i].PartyID].svVotes = {};
        }
        partyDict.length = parties.length
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
      /*$rootScope.countAVs = function(data) {
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
            if (candidates[i].out) {
              continue
            }
            if (candidates[i].avVotes[round] > totalVotes/2) {
              finished = true
            }
            if (candidates[i].avVotes[round] < lowest.votes) {
              lowest.IDs = [i]
              lowest.votes = candidates[i].avVotes[round]
            } else if (candidates[i].avVotes[round] == lowest.votes) {
              lowest.IDs += [i]
            }
          }
          if (!finished) {
            round++
            for (var i in candidates) {
              candidates[i].avVotes[round] = candidates[i].avVotes[round-1]
            }
            for (var id in lowest.IDs) {
              candidates[id].out = true
            }
            for (var i = 0; i < votes.length; i++) {
              
            }
            finished = true
          }
        }
        console.log({votes: votes, candidates: candidates, parties: parties, spoilt: spoilt});
        return {votes: votes, candidates: candidates, parties: parties, spoilt: spoilt};
      };*/
      $rootScope.countAVs = function(data) {
        var avVotes = {}
        var votes = data.votes;
        var candidates = data.candidates;
        var parties = data.parties;
        var spoilt = data.spoilt;
        for (var i = 0; i < votes.length; i++) {
          if (votes[i].SystemShortName == "av") {
            if (!avVotes[votes[i].UserHash]) {
              avVotes[votes[i].UserHash] = {currentPointer:1}
            }
            avVotes[votes[i].UserHash][votes[i].Position] = votes[i].CandidateID
          }
        }
        function count(voteList) { //voteList => totalList
          var total = {}
          for (i in voteList) {
            total[voteList[i][voteList[i].currentPointer]] = total[voteList[i][voteList[i].currentPointer]] +1 | 1
          }
          return total //totalList
        }
        function findWorst(total) { //totalList => {IDs:[CandidateID (int)...], votes: numVotes (int)}
          for (i in total) {
            if (!lowest) {var lowest = {IDs:[i],votes:total[i]}};
            if (total[i] == lowest.votes) {
              lowest.IDs.concat(i)
            } else if (total[i] < lowest.votes) {
              lowest = {IDs:[i],votes:total[i]};
            }
          }
          return lowest //[CandidateID, numVotes]
        }
        function reassign(voteList,losers) { //voteList,[CandidateID (int)...] => voteList
          for (var i = 0; i < losers.length; i++) {
            for (i in voteList) {
              while (losers.indexOf(voteList[i][voteList[i].currentPointer]) >= 0) {
                voteList[i].currentPointer ++
              }
            }
          }
          return voteList //voteList
        }
        function isFinished(voteList) { // voteList => bool
          var totalVotes = 0
          for (i in voteList) {
            if (i === undefined) {console.log("undefined"); continue}
            totalVotes += voteList[i]
          }
          for (i in voteList) {
            if (voteList[i] > totalVotes/2) {
              return true
            }
          }
          return false
        }
        var finished = false
        var j = 0
        var roundResults = []
        var out = []
        while (!finished) {
          roundResults[j] = count(avVotes)
          out += findWorst(roundResults[j]).IDs
          avVotes = reassign(avVotes,out)
          console.log(avVotes["c02a65ac"],avVotes["51e4f5ff"],avVotes["5f496f0b"])
          console.log(avVotes)
          j++
          if (j > candidates.length) {console.log("too many loops");finished = true;}
        }
        console.log(avVotes,count(reassign(avVotes,[1])))
        return {votes: votes, candidates: candidates, parties: parties, spoilt: spoilt};
      };
      function startCounting() {
        console.log($rootScope.countAVs($rootScope.countPRs($rootScope.countFPTPs($rootScope.prepareDict($rootScope.votes, $rootScope.candidates, $rootScope.parties )))));
      }
      $scope.chart1options = {
        chart: {
          type: 'multiBarHorizontalChart',
          height: 450,
          x: function(d){return d.label;},
          y: function(d){return d.value;},
          //yErr: function(d){ return [-Math.abs(d.value * Math.random() * 0.3), Math.abs(d.value * Math.random() * 0.3)] },
          showControls: true,
          showValues: true,
          duration: 500,
          xAxis: {
            showMaxMin: false
          },
          yAxis: {
            axisLabel: 'Percentage of Vote',
            tickFormat: function(d){
              return d3.format(',.1f')(d);
            }
          }
        }
      };
      $scope.chart1data = [
        {
          "key": "Labour",
          "color": "#d62728",
          "values": [
            {
                "label" : "Total" ,
                "value" : 44
            },
            {
                "label" : "Year 12" ,
                "value" : 50
            },
            {
                "label" : "Year 13" ,
                "value" : 38
            }
          ]
        },
        {
          "key": "Tory",
          "color": "#1f77b4",
          "values": [
            {
                "label" : "Total" ,
                "value" : 56
            },
            {
                "label" : "Year 12" ,
                "value" : 50
            },
            {
                "label" : "Year 13" ,
                "value" : 62
            }
          ]
        }
      ]
      $scope.changeData = function() {
        console.log("datachanged")
        $scope.chart1data = [
          {
            "key": "Labour",
            "color": "#d62728",
            "values": [
              {
                "label" : "Total" ,
                "value" : 56
              },
              {
                "label" : "Year 12" ,
                "value" : 50
              },
              {
                "label" : "Year 13" ,
                "value" : 62
              }
            ]
          },
          {
            "key": "Tory",
            "color": "#1f77b4",
            "values": [
              {
                "label" : "Total" ,
                "value" : 44
              },
              {
                "label" : "Year 12" ,
                "value" : 50
              },
              {
                "label" : "Year 13" ,
                "value" : 38
              }
            ]
          },
          {
            "key": "Lib Dem",
            "color": "#d6c728",
            "values": [
              {
                "label" : "Total" ,
                "value" : 56
              },
              {
                "label" : "Year 12" ,
                "value" : 50
              },
              {
                "label" : "Year 13" ,
                "value" : 62
              }
            ]
          },
          {
            "key": "Green",
            "color": "#27d628",
            "values": [
              {
                "label" : "Total" ,
                "value" : 50
              },
              {
                "label" : "Year 12" ,
                "value" : 50
              },
              {
                "label" : "Year 13" ,
                "value" : 50
              }
            ]
          },
          {
            "key": "UKIP",
            "color": "#b437f1",
            "values": [
              {
                "label" : "Total" ,
                "value" : 44
              },
              {
                "label" : "Year 12" ,
                "value" : 50
              },
              {
                "label" : "Year 13" ,
                "value" : 38
              }
            ]
          }
        ]
        $scope.graph.refresh()
      }
    });
})();
