(function(){
  'use strict';

  angular.module('agora')
    .controller('voteController', function($scope, $rootScope, $state, User, Election, Candidate){

      $rootScope.$on('goBackHome', function() {
        $state.go('vote');
      })
      $scope.currentUser = {
        id: 125,
        displayName: 'Mr S Balderson'
      };
      $scope.users = User.query();
      //$rootScope.election = JSON.parse(localStorage.getItem('election'));
      //console.log($rootScope.election)
      $rootScope.election = {
        ElectionID: 1,
        ElectionName: '2018 Test Election'
      };
      //localStorage.setItem('election', JSON.stringify($rootScope.election));
      var afterSystems = function(){
        console.log("sl");
        $scope.$broadcast('systemsLoaded')
        console.log($rootScope)
      //  $rootScope.nextPage = $rootScope.election.systems[currentPage+1 || 0]
      //  localStorage.setItem('election', JSON.stringify($rootScope.election));
      //  console.log($rootScope.nextPage)
      }
      $rootScope.election.systems = Election.getSystems({id:$rootScope.election.ElectionID}, afterSystems);
      $rootScope.election.candidates = Candidate.query({electionID:$rootScope.election.ElectionID}/*, function() { localStorage.setItem('election', JSON.stringify($rootScope.election)); }*/);
      $rootScope.voteViewGoTo = function(page) {
      //  $state.go('vote.fptp');
    };
      $rootScope.sortNextPage = function(scope) {
        scope.$on('systemsLoaded', function() {
          $rootScope.currentPage = $rootScope.currentPage + 1
          if ($rootScope.currentPage +1 < $rootScope.election.systems.length) {
            scope.nextPage=$rootScope.election.systems[$rootScope.currentPage+1]
          } else {
            $rootScope.nextPage={SystemShortName: "thankyou"}
          }
        })
      }
    })
})();
