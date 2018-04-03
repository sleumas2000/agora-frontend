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
      console.log($scope.currentUser.values)
      // end remove
      if (!$rootScope.electionID) $rootScope.electionID=1;
      var promises = {
        votes: Vote.getVotes({electionID:$rootScope.electionID}).$promise,
        parties: Party.getByElection({electionID:$rootScope.electionID}).$promise,
        candidates: Candidate.query({electionID:$rootScope.electionID}).$promise
      };
      $q.all(promises).then(function(values) {
        function zip({keys: keys, colors: colors, data: data}) {
          console.log("$",keys,colors,data)
          return keys.map(function(_,i){
            return {key: keys[i], color: colors[i], values: [{label:"Total",value:data[i]}]}
          });
        }
        $rootScope.parties = values.parties;
        console.log($rootScope.parties)
        $rootScope.candidates = values.candidates;
        $rootScope.votes = values.votes;
        $rootScope.results = startCounting();
        $scope.chartData = makeChartData($rootScope.results);
        console.log($rootScope.chartData)
        /*$scope.fptpgraph.refresh()
        $scope.fptpgraph2.refresh()
        $scope.avGraph.refresh()
        $scope.avGraph2.refresh()*/
      });
      $rootScope.prepareDict = function(votes,candidates,parties) {
        var candidateDict = {};
        var partyDict = {};
        for (var i = 0; i < candidates.length; i++) {
          candidateDict[candidates[i].CandidateID] = candidates[i];
          candidateDict[candidates[i].CandidateID].fptpVotes = candidateDict[candidates[i].CandidateID].prVotes = 0;
          candidateDict[candidates[i].CandidateID].avVotes = [];
          candidateDict[candidates[i].CandidateID].stvVotes = {};
          candidateDict[candidates[i].CandidateID].svVotes = {};
        }
        candidateDict.length = candidates.length
        for (var i = 0; i < parties.length; i++) { //jshint ignore:line
          partyDict[parties[i].PartyID] = parties[i];
          partyDict[parties[i].PartyID].fptpVotes = partyDict[parties[i].PartyID].prVotes = 0;
          partyDict[parties[i].PartyID].avVotes = [];
          partyDict[parties[i].PartyID].stvVotes = {};
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
        var avVotes = {length: 0}
        var votes = data.votes;
        var candidates = data.candidates;
        var parties = data.parties;
        var spoilt = data.spoilt;
        spoilt.av = [0]
        for (var i = 0; i < votes.length; i++) {
          if (votes[i].SystemShortName == "av") {
            if (!avVotes[votes[i].UserHash]) {
              avVotes[votes[i].UserHash] = {currentPointer:1,length:0}
              avVotes.length++
            }
            if (!votes[i].CandidateID) {spoilt.av[0]++}
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
            if (i == "undefined") {console.log("undefined"); continue}
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
          if (isFinished(roundResults[j])) {console.log("Done",roundResults,avVotes);finished = true;}
          else {
            out = out.concat(findWorst(roundResults[j]).IDs)
            avVotes = reassign(avVotes,out)
          }
          j++
          if (j > candidates.length) {console.log("too many loops");finished = true;} // stop loop overflows. If this happens, something is wrong anyway
          
        }
        console.log("..",candidates)
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
              console.log(c)
            }
          }
        }
        //console.log(avVotes,count(reassign(avVotes,[1])))
        console.log("@",{votes: votes, candidates: candidates, parties: parties, spoilt: spoilt})
        return {votes: votes, candidates: candidates, parties: parties, spoilt: spoilt};
      };
      function startCounting() {
        return ($rootScope.countAVs($rootScope.countPRs($rootScope.countFPTPs($rootScope.prepareDict($rootScope.votes, $rootScope.candidates, $rootScope.parties )))));
      }
      function makeChartData(results) {
        function values(obj) {var a = []; for (var k in obj) { if (k != "length") {a.push(obj[k])}}; return a}
        function scale(list) {var total = list.reduce((a, b) => a + b, 0); return list.map(a => 100*a/total)}
        function simpleZip({keys: keys, colors: colors, data: data}) {
          console.log("$",keys,colors,data)
          return keys.map(function(_,i){
            return {key: keys[i], color: colors[i], values: [{label:"Total",value:data[i]}]}
          });
        }
        function multiZip({keys: keys, colors: colors, data: data}) {
          console.log("^")
          console.log(data)
          console.log(data[i])
          return keys.map(function(_,i){
            return {key: keys[i], color: colors[i], values: data.map(function(l,j){return {label:"Round "+(j+1), value: l[i]}})}
          });
        }
        var [ckeys, cfptpdata, cavdata, cstvdata, csvdata, cprdata, pkeys, pfptpdata, pavdata, pstvdata, psvdata, pprdata] = [[],[],[],[],[],[],[],[],[],[],[],[]]
        var cfptplist = values(results.candidates).sort(function(b,a) {return a.fptpVotes-b.fptpVotes})
        var cavlist = values(results.candidates).sort(function(b,a) {return a.avVotes[0]-b.avVotes[0]})
        var cstvlist = values(results.candidates).sort(function(b,a) {return a.stvVotes[0]-b.stvVotes[0]})
        var csvlist = values(results.candidates).sort(function(b,a) {return a.svVotes[0]-b.svVotes[0]})
        var cprlist = values(results.candidates).sort(function(b,a) {return a.prVotes-b.prVotes})
        var pfptplist = values(results.parties).sort(function(b,a) {return a.fptpVotes-b.fptpVotes})
        var pavlist = values(results.parties).sort(function(b,a) {return a.avVotes[0]-b.avVotes[0]})
        var pstvlist = values(results.parties).sort(function(b,a) {return a.stvVotes[0]-b.stvVotes[0]})
        var psvlist = values(results.parties).sort(function(b,a) {return a.svVotes[0]-b.svVotes[0]})
        var pprlist = values(results.parties).sort(function(b,a) {return a.prVotes-b.prVotes})
        console.log(cfptplist)
        console.log(scale(pfptplist.map(function(p) {return p.fptpVotes})))
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
        console.log("!",pfptplist.map(function(p) {return p.PartyColor}))
        return {
          parties: {
            /*fptpkeys: pfptplist.map(function(p) {return p.PartyName}),
            fptpcolors: pfptplist.map(function(p) {return p.PartyColor}),
            fptpdata: scale(pfptplist.map(function(p) {return p.fptpVotes})),*/
            fptp: simpleZip({keys: pfptplist.map(function(p) {return p.PartyName}), colors: pfptplist.map(function(p) {return p.PartyColor}), data: scale(pfptplist.map(function(p) {return p.fptpVotes}))}),
            av: multiZip({keys: pavlist.map(function(p) {return p.PartyName}), colors: pavlist.map(function(p) {return p.PartyColor}), data: pavdata}),
            stv: multiZip({keys: pstvlist.map(function(p) {return p.PartyName}), colors: pstvlist.map(function(p) {return p.PartyColor}), data: pstvdata}),
            sv: multiZip({keys: psvlist.map(function(p) {return p.PartyName}), colors: psvlist.map(function(p) {return p.PartyColor}), data: psvdata}),
            pr: simpleZip({keys: pprlist.map(function(p) {return p.PartyName}), colors: pprlist.map(function(p) {return p.PartyColor}), data: scale(pprlist.map(function(p) {return p.prVotes}))})/*,
            stvkeys: pstvlist.map(function(p) {return p.PartyName}),
            stvdata: pstvdata,
            svkeys: psvlist.map(function(p) {return p.PartyName}),
            svdata: psvdata,
            prkeys: pprlist.map(function(p) {return p.PartyName}),
            prdata: scale(pprlist.map(function(p) {return p.prVotes}))*/
          },
          candidates: {
            fptp: simpleZip({keys: cfptplist.map(function(c) {return c.CandidateName+" ("+c.PartyName+")"}), colors: cfptplist.map(function(c) {return c.PartyColor}), data: scale(cfptplist.map(function(c) {return c.fptpVotes}))}),
            av: multiZip({keys: cavlist.map(function(c) {return c.CandidateName+" ("+c.PartyName+")"}), colors: cavlist.map(function(c) {return c.PartyColor}), data: cavdata}),
            stv: multiZip({keys: cstvlist.map(function(c) {return c.CandidateName+" ("+c.PartyName+")"}), colors: cstvlist.map(function(c) {return c.PartyColor}), data: cstvdata}),
            sv: multiZip({keys: csvlist.map(function(c) {return c.CandidateName+" ("+c.PartyName+")"}), colors: csvlist.map(function(c) {return c.PartyColor}), data: csvdata}),
            pr: simpleZip({keys: cprlist.map(function(c) {return c.CandidateName+" ("+c.PartyName+")"}), colors: cprlist.map(function(c) {return c.PartyColor}), data: scale(cprlist.map(function(c) {return c.prVotes}))}),
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
      /*$scope.chart1data = [
        {
          "key": "Labour",
          "color": "#d5000d",
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
          "color": "#0096db",
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
      ]*/
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
