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
      })
      $rootScope.countFPTPs = function(votes,candidates,parties) {

      };
      $rootScope.countFPTPs($rootScope.votes,$rootScope.candidates,$rootScope.parties)
      console.log($rootScope)
    })
})();
