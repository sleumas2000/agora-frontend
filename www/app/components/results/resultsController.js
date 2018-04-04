(function(){
  'use strict';
  angular.module('agora')
    .controller('resultsController', function($scope, $rootScope, $q, $timeout, User, Election, Candidate, Party, Vote){
      function onElectionsGot(values) {
      $rootScope.elections = values
      // shite goes here
      // TODO: remove this
      $scope.currentUser = {
        id: 125,
        DisplayName: 'Mr S Balderson'
      };
      // end remove
      $scope.whichTab = "fptp"
      $scope.goTo = function(tab) {
        $scope.whichTab = tab
        if (tab == "fptp") {
          $timeout(function(){$scope.fptpgraph.refresh()})
          $timeout(function(){$scope.fptpgraph2.refresh()})
        } else if (tab == "av") {
          $timeout(function(){$scope.avgraph.refresh()})
          $timeout(function(){$scope.avgraph2.refresh()})
        } else if (tab == "stv") {
          $timeout(function(){$scope.stvgraph.refresh()})
          $timeout(function(){$scope.stvgraph2.refresh()})
        } else if (tab == "sv") {
          $timeout(function(){$scope.svgraph.refresh()})
          $timeout(function(){$scope.svgraph2.refresh()})
        } else if (tab == "pr") {
          $timeout(function(){$scope.prgraph.refresh()})
          $timeout(function(){$scope.prgraph2.refresh()})
        }
      }
      
      if (!$rootScope.election) {$rootScope.election = $rootScope.elections[0];}
      if (!$scope.selectedElection) {$scope.selectedElection = $rootScope.elections[0];}
      $scope.setElection = function() {
        $rootScope.election = $scope.selectedElection;
        var promises = {
          votes: Vote.getVotes({electionID:$rootScope.election.ElectionID}).$promise,
          parties: Party.getByElection({electionID:$rootScope.election.ElectionID}).$promise,
          candidates: Candidate.query({electionID:$rootScope.election.ElectionID}).$promise
        };
        $q.all(promises).then(function(values) {
          $rootScope.parties = values.parties;
          $rootScope.candidates = values.candidates;
          $rootScope.votes = values.votes;
          $rootScope.results = startCounting();
          $scope.chartData = makeChartData($rootScope.results);
          $scope.goTo($scope.whichTab)
        });
      };
      console.log($rootScope.election)
      var promises = {
        votes: Vote.getVotes({electionID:$rootScope.election.ElectionID}).$promise,
        parties: Party.getByElection({electionID:$rootScope.election.ElectionID}).$promise,
        candidates: Candidate.query({electionID:$rootScope.election.ElectionID}).$promise
      };
      $q.all(promises).then(function(values) {
        $rootScope.parties = values.parties;
        $rootScope.candidates = values.candidates;
        $rootScope.votes = values.votes;
        $rootScope.results = startCounting();
        $scope.chartData = makeChartData($rootScope.results);
      });
      $rootScope.prepareDict = function(votes,candidates,parties) {
        var candidateDict = {};
        var partyDict = {};
        for (var i = 0; i < candidates.length; i++) {
          candidateDict[candidates[i].CandidateID] = candidates[i];
          candidateDict[candidates[i].CandidateID].fptpVotes = candidateDict[candidates[i].CandidateID].prVotes = 0;
          candidateDict[candidates[i].CandidateID].avVotes = [];
          candidateDict[candidates[i].CandidateID].stvVotes = [];
          candidateDict[candidates[i].CandidateID].svVotes = {};
        }
        candidateDict.length = candidates.length
        for (var i = 0; i < parties.length; i++) { //jshint ignore:line
          partyDict[parties[i].PartyID] = parties[i];
          partyDict[parties[i].PartyID].fptpVotes = partyDict[parties[i].PartyID].prVotes = 0;
          partyDict[parties[i].PartyID].avVotes = [];
          partyDict[parties[i].PartyID].stvVotes = [];
          partyDict[parties[i].PartyID].svVotes = {};
        }
        partyDict.length = parties.length
        return {votes: votes, candidates: candidateDict, parties: partyDict, spoilt: {fptp: 0, av: [], stv: [], pr: 0, sv: 0}};
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
        var avVotes = {length: 0}
        var votes = data.votes;
        var candidates = data.candidates;
        var parties = data.parties;
        var spoilt = data.spoilt;
        spoilt.av = []
        for (var i = 0; i < votes.length; i++) {
          if (votes[i].SystemShortName == "av") {
            if (!avVotes[votes[i].UserHash]) {
              avVotes[votes[i].UserHash] = {currentPointer:1,length:0}
              avVotes.length++
            }
            avVotes[votes[i].UserHash][votes[i].Position] = votes[i].CandidateID
            avVotes[votes[i].UserHash].length++
          }
        }
        function count(voteList) { //voteList => totalList
          var total = {}
          for (i in voteList) {
            if (i == "length") continue
            total[voteList[i][voteList[i].currentPointer]] = (total[voteList[i][voteList[i].currentPointer]] + 1) || 1
          }
          return total //totalList
        }
        function findWorst(total) { //totalList => {IDs:[CandidateID (int)...], votes: numVotes (int)}
          for (i in total) {
            if (i == "undefined") continue
            if (!lowest) {var lowest = {IDs:[i],votes:total[i]};continue};
            if (total[i] == lowest.votes) {
              lowest.IDs = lowest.IDs.concat([i])
            } else if (total[i] < lowest.votes) {
              lowest = {IDs:[i],votes:total[i]};
            }
          }
          return lowest //[CandidateID, numVotes]
        }
        function reassign(voteList,losers) { //voteList,[CandidateID (int)...] => voteList
          var oldList = voteList
          for (i in voteList) {
            if (i == "length" || voteList[i][voteList[i].currentPointer] == undefined) {continue}
            while (losers.indexOf(voteList[i][voteList[i].currentPointer].toString()) >= 0) {
              if (voteList[i].currentPointer > voteList[i].length) {break}
              voteList[i].currentPointer ++
              if (voteList[i][voteList[i].currentPointer] == undefined) {break}
            }
          }
          return voteList //voteList
        }
        function isFinished(totalList) { // totalList => bool
          var totalVotes = 0
          for (i in totalList) {
            if (i == "undefined") {continue}
            totalVotes += totalList[i]
          }
          for (i in totalList) {
            if (totalList[i] > totalVotes/2 && i != "undefined") {
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
          spoilt.av.push(roundResults[j].undefined)
          if (isFinished(roundResults[j])) {finished = true;}
          else {
            out = out.concat(findWorst(roundResults[j]).IDs)
            avVotes = reassign(avVotes,out)
          }
          j++
          if (j > candidates.length) {console.log("too many loops");finished = true;} // stop loop overflows. If this happens, something is wrong anyway
        }
        for (i in candidates) {
          if (i=="length") {continue}
          candidates[i].avVotes=Array.apply(null, Array(j)).map(Number.prototype.valueOf,0)
        }
        for (i in parties) {
          if (i=="length") {continue}
          parties[i].avVotes=Array.apply(null, Array(j)).map(Number.prototype.valueOf,0)
        }
        spoilt.av = Array.apply(null, Array(j)).map(Number.prototype.valueOf,0)
        for (var r = 0; r < roundResults.length; r++) {
          for (var c in roundResults[r]) {
            if (c == "undefined") {
              spoilt.av[r] = roundResults[r][c]
            } else {
              candidates[c].avVotes[r] = roundResults[r][c]
              parties[candidates[c].PartyID].avVotes[r] += roundResults[r][c]
            }
          }
        }
        return {votes: votes, candidates: candidates, parties: parties, spoilt: spoilt};
      };
      $rootScope.countSTVs = function(numSeats,data) {
        var stvVotes = {length: 0}
        var votes = data.votes;
        var candidates = data.candidates;
        var parties = data.parties;
        var spoilt = data.spoilt;
        spoilt.stv = [0]
        for (var i = 0; i < votes.length; i++) {
          if (votes[i].SystemShortName == "stv") {
            if (!stvVotes[votes[i].UserHash]) {
              stvVotes[votes[i].UserHash] = {currentPointer:1,weight:1,length:0}
            }
            if (!votes[i].CandidateID) {spoilt.stv[0]++}
            stvVotes[votes[i].UserHash][votes[i].Position] = votes[i].CandidateID
            stvVotes[votes[i].UserHash].length++
          }
        }
        function count(voteList) { //voteList => totalList
          var total = {}
          for (i in voteList) {
            if (i == "length") continue
            total[voteList[i][voteList[i].currentPointer]] = (total[voteList[i][voteList[i].currentPointer]] + voteList[i].weight) || voteList[i].weight
          }
          return total //totalList
        }
        function findWorst(total) { //totalList => {IDs:[CandidateID (int)...], votes: numVotes (int)}
          for (i in total) {
            if (i == "undefined") continue
            if (!lowest) {var lowest = {IDs:[i],votes:total[i]};continue};
            if (total[i] == lowest.votes) {
              lowest.IDs = lowest.IDs.concat([i])
            } else if (total[i] < lowest.votes) {
              lowest = {IDs:[i],votes:total[i]};
            }
          }
          return lowest //[CandidateID, numVotes]
        }
        function findBest(total,quota) { //totalList => {IDs:CandidateID (int), votes: numVotes (int)}
          for (i in total) {
            if (i == "undefined") continue
            if (!highest) {var highest = {IDs:[i],votes:total[i]};continue};
            if (total[i] == highest.votes) {
              highest.IDs = highest.IDs.concat([i])
            } else if (total[i] > highest.votes) {
              highest = {IDs:[i],votes:total[i]};
            }
          }
          highest.ID = highest.IDs[Math.floor(Math.random()*highest.IDs.length)]
          delete highest.IDs
          if (highest.votes > quota) {
            return highest //[CandidateID, numVotes]
          } else return {ID: null, votes: 0}
        }
        function reassignLosers(voteList,losers) { //voteList,[CandidateID (int)...] => voteList
          var oldList = voteList
          for (i in voteList) {
            if (i == "length" || voteList[i][voteList[i].currentPointer] == undefined) {continue}
            while (losers.indexOf(voteList[i][voteList[i].currentPointer].toString()) >= 0) {
              if (voteList[i].currentPointer > voteList[i].length) {break}
              voteList[i].currentPointer ++
              if (voteList[i][voteList[i].currentPointer] == undefined) {break}
            }
          }
          return voteList //voteList
        }
        function reassignWinner(voteList,out,winner,numVotes,quota) { //voteList,[CandidateID (int)...],CandidateID (int), int, int => voteList
          var oldList = voteList
          for (i in voteList) {
            if (i == "length" || voteList[i][voteList[i].currentPointer] == undefined) {continue}
            if (voteList[i][voteList[i].currentPointer].toString()==winner) {voteList[i].weight = voteList[i].weight*(1-(quota/numVotes));voteList[i].currentPointer ++;if (voteList[i][voteList[i].currentPointer] == undefined) {spoilt.av[j]+=voteList[i].weight;break}}
            while (out.indexOf(voteList[i][voteList[i].currentPointer].toString()) >= 0) {
              if (voteList[i].currentPointer > voteList[i].length) {break}
              voteList[i].currentPointer ++
              if (voteList[i][voteList[i].currentPointer] == undefined) {spoilt.av[j]+=voteList[i].weight;break}
            }
          }
          return voteList //voteList
        }
        function findQuota(total,numSeats) {
          var quota=0
          for (i in total) {
            if (i=="undefined") {continue}
            quota += total[i]
          }
          return quota/(numSeats+1)
        }
        var finished = false
        var j = 0
        var roundResults = []
        var out = []
        var electedCandidates = []
        var quota 
        var numSeatsFree = numSeats
        while (!finished) {
          roundResults[j] = count(stvVotes)
          quota=findQuota(roundResults[j],numSeatsFree)
          var originalQuota = originalQuota || findQuota(roundResults[0],numSeats)
          var best = findBest(roundResults[j],quota)
          if (numSeatsFree === 0) {finished = true;}
          else {
            if (best.votes !== 0) {
              stvVotes = reassignWinner(stvVotes,out,best.ID,best.votes,quota)
              electedCandidates.push(best.ID)
              numSeatsFree --
              out.push(best.ID)
            } else {
              out = out.concat(findWorst(roundResults[j]).IDs)
              electedCandidates.push(null)
            }
          }
          j++
          if (j > candidates.length) {console.log("too many loops");finished = true;} // stop loop overflows. If this happens, something is wrong anyway
        }
        for (i in candidates) {
          if (i=="length") {continue}
          candidates[i].stvVotes=Array.apply(null, Array(j)).map(Number.prototype.valueOf,0)
        }
        for (i in parties) {
          if (i=="length") {continue}
          parties[i].stvVotes=Array.apply(null, Array(j)).map(Number.prototype.valueOf,0)
        }
        spoilt.stv = Array.apply(null, Array(j)).map(Number.prototype.valueOf,0)
        for (var r = 0; r < roundResults.length; r++) {
          for (var c in roundResults[r]) {
            if (c == "undefined") {
              spoilt.stv[r] = roundResults[r][c]
            } else {
              candidates[c].stvVotes[r] = roundResults[r][c]
              parties[candidates[c].PartyID].stvVotes[r] += roundResults[r][c]
            }
          }
        }
        for (var c = 0; c < electedCandidates.length; c++) {
          for (var r = j-1; r > c; r--) {
            candidates[electedCandidates[c]].stvVotes[r] = originalQuota
            parties[candidates[electedCandidates[c]].PartyID].stvVotes[r] += originalQuota
          }
        }
        return {votes: votes, candidates: candidates, parties: parties, spoilt: spoilt};
      };
      function startCounting() {
        return ($rootScope.countSTVs(3,$rootScope.countAVs($rootScope.countPRs($rootScope.countFPTPs($rootScope.prepareDict($rootScope.votes, $rootScope.candidates, $rootScope.parties ))))));
      }
      function makeChartData(results) {
        var spoilt = results.spoilt
        function values(obj) {var a = []; for (var k in obj) { if (k != "length") {a.push(obj[k])}}; return a}
        function scale(list) {var total = list.reduce((a, b) => a + b, 0); return list.map(a => 100*a/total)}
        function simpleZip({keys: keys, colors: colors, data: data}) {
          return keys.map(function(_,i){
            return {key: keys[i], color: colors[i], values: [{label:"Total",value:data[i]}]}
          });
        }
        function multiZip({keys: keys, colors: colors, data: data}) {
          return keys.map(function(_,i){
            return {key: keys[i], color: colors[i], values: data.map(function(l,j){return {label:"Round "+(j+1), value: l[i]}})}
          });
        }
        results.parties.s=({PartyName: "Spoilt Votes", PartyColor: "#555", isSpoilt: true})
        results.parties.s.fptpVotes = spoilt.fptp
        results.parties.s.avVotes = spoilt.av
        results.parties.s.stvVotes = spoilt.stv
        results.parties.s.svVotes = spoilt.sv
        results.parties.s.prVotes = spoilt.pr
        results.candidates.s=({CandidateName: "Spoilt Votes", PartyColor: "#555", isSpoilt: true})
        results.candidates.s.fptpVotes = spoilt.fptp
        results.candidates.s.avVotes = spoilt.av
        results.candidates.s.stvVotes = spoilt.stv
        results.candidates.s.svVotes = spoilt.sv
        results.candidates.s.prVotes = spoilt.pr
        var [ckeys, cfptpdata, cavdata, cstvdata, csvdata, cprdata, pkeys, pfptpdata, pavdata, pstvdata, psvdata, pprdata] = [[],[],[],[],[],[],[],[],[],[],[],[]]
        var cfptplist = values(results.candidates).sort(function(b,a) {return a.isSpoilt ? -1 : b.isSpoilt ? 1 : a.fptpVotes-b.fptpVotes})
        var cavlist = values(results.candidates).sort(function(b,a) {return a.isSpoilt ? -1 : b.isSpoilt ? 1 : a.avVotes[0]-b.avVotes[0]})
        var cstvlist = values(results.candidates).sort(function(b,a) {return a.isSpoilt ? -1 : b.isSpoilt ? 1 : a.stvVotes[0]-b.stvVotes[0]})
        var csvlist = values(results.candidates).sort(function(b,a) {return a.isSpoilt ? -1 : b.isSpoilt ? 1 : a.svVotes[0]-b.svVotes[0]})
        var cprlist = values(results.candidates).sort(function(b,a) {return a.isSpoilt ? -1 : b.isSpoilt ? 1 : a.prVotes-b.prVotes})
        var pfptplist = values(results.parties).sort(function(b,a) {return a.isSpoilt ? -1 : b.isSpoilt ? 1 : a.fptpVotes-b.fptpVotes})
        var pavlist = values(results.parties).sort(function(b,a) {return a.isSpoilt ? -1 : b.isSpoilt ? 1 : a.avVotes[0]-b.avVotes[0]})
        var pstvlist = values(results.parties).sort(function(b,a) {return a.isSpoilt ? -1 : b.isSpoilt ? 1 : a.stvVotes[0]-b.stvVotes[0]})
        var psvlist = values(results.parties).sort(function(b,a) {return a.isSpoilt ? -1 : b.isSpoilt ? 1 : a.svVotes[0]-b.svVotes[0]})
        var pprlist = values(results.parties).sort(function(b,a) {return a.isSpoilt ? -1 : b.isSpoilt ? 1 : a.prVotes-b.prVotes})
        var [pavdata, pstvdata, psvdata, cavdata, cstvdata, csvdata] = [[],[],[],[],[],[]]
        for (var i = 0; i < pavlist[0].avVotes.length; i++) {
          pavdata.push(scale(pavlist.map(function(p) {return p.avVotes[i]})))
        }
        for (var i = 0; i < pstvlist[0].stvVotes.length; i++) {
          pstvdata.push(scale(pstvlist.map(function(p) {return p.stvVotes[i]})))
        }
        for (var i = 0; i < psvlist[0].svVotes.length; i++) {
          psvdata.push(scale(psvlist.map(function(p) {return p.svVotes[i]})))
        }
        for (var i = 0; i < cavlist[0].avVotes.length; i++) {
          cavdata.push(scale(cavlist.map(function(c) {return c.avVotes[i]})))
        }
        for (var i = 0; i < cstvlist[0].stvVotes.length; i++) {
          cstvdata.push(scale(cstvlist.map(function(c) {return c.stvVotes[i]})))
        }
        for (var i = 0; i < csvlist[0].svVotes.length; i++) {
          csvdata.push(scale(csvlist.map(function(c) {return c.svVotes[i]})))
        }
        return {
          parties: {
            fptp: simpleZip({keys: pfptplist.map(function(p) {return p.PartyName}), colors: pfptplist.map(function(p) {return p.PartyColor}), data: scale(pfptplist.map(function(p) {return p.fptpVotes}))}),
            av: multiZip({keys: pavlist.map(function(p) {return p.PartyName}), colors: pavlist.map(function(p) {return p.PartyColor}), data: pavdata}),
            stv: multiZip({keys: pstvlist.map(function(p) {return p.PartyName}), colors: pstvlist.map(function(p) {return p.PartyColor}), data: pstvdata}),
            sv: multiZip({keys: psvlist.map(function(p) {return p.PartyName}), colors: psvlist.map(function(p) {return p.PartyColor}), data: psvdata}),
            pr: simpleZip({keys: pprlist.map(function(p) {return p.PartyName}), colors: pprlist.map(function(p) {return p.PartyColor}), data: scale(pprlist.map(function(p) {return p.prVotes}))})
          },
          candidates: {
            fptp: simpleZip({keys: cfptplist.map(function(c) {return c.isSpoilt ? c.CandidateName : c.CandidateName+" ("+c.PartyName+")"}), colors: cfptplist.map(function(c) {return c.PartyColor}), data: scale(cfptplist.map(function(c) {return c.fptpVotes}))}),
            av: multiZip({keys: cavlist.map(function(c) {return c.isSpoilt ? c.CandidateName : c.CandidateName+" ("+c.PartyName+")"}), colors: cavlist.map(function(c) {return c.PartyColor}), data: cavdata}),
            stv: multiZip({keys: cstvlist.map(function(c) {return c.isSpoilt ? c.CandidateName : c.CandidateName+" ("+c.PartyName+")"}), colors: cstvlist.map(function(c) {return c.PartyColor}), data: cstvdata}),
            sv: multiZip({keys: csvlist.map(function(c) {return c.isSpoilt ? c.CandidateName : c.CandidateName+" ("+c.PartyName+")"}), colors: csvlist.map(function(c) {return c.PartyColor}), data: csvdata}),
            pr: simpleZip({keys: cprlist.map(function(c) {return c.isSpoilt ? c.CandidateName : c.CandidateName+" ("+c.PartyName+")"}), colors: cprlist.map(function(c) {return c.PartyColor}), data: scale(cprlist.map(function(c) {return c.prVotes}))}),
          }
        }
      }
      $scope.chartOptions = {
        chart: {
          type: 'multiBarHorizontalChart',
          height: 450,
          x: function(d){return d.label;},
          y: function(d){return d.value;},
          showControls: true,
          showValues: true,
          stacked: true,
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
      }
      Election.query().$promise.then(onElectionsGot);
    });
})();
