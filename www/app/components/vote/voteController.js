(function(){
  'use strict';

  angular.module('agora')
    .controller('voteController', function($scope, $rootScope, $state, User, Election, Candidate){

      $scope.currentUser = {
        id: 125,
        displayName: 'Mr S Balderson'
      };
      $scope.users = User.query();
      $rootScope.election = {
        ElectionID: 1,
        ElectionName: '2018 Test Election'
      };
      $rootScope.election.systems = Election.getSystems({id:$rootScope.election.ElectionID});
      $rootScope.election.candidates = Candidate.query({electionID:$rootScope.election.ElectionID});
      $rootScope.voteViewGoTo = function(page) {
        $rootScope.currentPage=page
      //  $state.go('vote.fptp');
      }
    })
})();
