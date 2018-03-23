(function(){
  'use strict';

  angular.module('agora')
    .controller('resultsController', function($scope, $rootScope, $q, User, Election, Candidate, Party, Vote){
      // shite goes here
      $rootScope.countFPTPs = function(votes,candidates,parties) {
        for (var i = 0; i < candidates.length; i++) {
          candidates[i].votesRecieved = 0
        }
        for (var i = 0; i < parties.length; i++) {
          parties[i].votesRecieved = 0
        }
        console.log(votes,candidates,parties)
        console.log(votes)
        for (var i = 0; i < votes.length; i++) {
          console.log("loop",i)
          candidate = votes[i].CandidateID
          party = votes[i].PartyID
          for (var i = 0; i < candidates.length && candidates[i].CandidateID == candidate; i++) {
            console.log(i,candidates[i],candidate)
            candidates[i].votesRecieved++
          }
          for (var i = 0; i < parties.length && parties[i].PartyID == party; i++) {
            console.log(i,parties[i],party)
            parties[i].votesRecieved++
          }
        }
        return {candidates: candidates, parties: parties}
      }
      var getStuff = function(){
        var promiseHash = {};
        promiseHash.p = Party.query().$promise;
        promiseHash.c = Candidate.query().$promise;
        promiseHash.v = Vote.getVotes().$promise;
        return $q.all(promiseHash);
      }
      var stuff = getStuff()
      stuff.then(function(values) {
        console.log(values)
        $scope.p = values.p
        $scope.c = values.c
        $scope.v = values.v
      })
      console.log(stuff)
      /*console.log( stuff.p, stuff.c, stuff.v)
      console.log("0",v,c,p)
      console.log("1",v.$promise,c.$promise,p.$promise)
      var prom = $q.all(v.$promise,c.$promise,p.$promise)
      console.log("2",prom)
      prom.then(function() {
        console.log("3",$rootScope.countFPTPs(v,c,p))
      });*/
    })
})();
