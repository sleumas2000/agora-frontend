(function(){
  'use strict';

  angular.module('agora')
    .controller('voteController', function($scope, $rootScope, $state, User, Election, Candidate){
      function onElectionsGot(values) {
        console.log(values);
        $rootScope.elections = values;

        $rootScope.$on('goBackHome', function() {
          $state.go('vote');
        });
        $rootScope.currentUser = $rootScope.currentUser || {
          UserID: Math.floor(Math.random() * (55)) + 3,
          DisplayName: 'Mr S Balderson'
        };
        console.log($rootScope.currentUser)
        $scope.users = User.query();
        //$rootScope.election = JSON.parse(localStorage.getItem('election'));
        //console.log($rootScope.election)
        /*$rootScope.election = {
          ElectionID: 1,
          ElectionName: '2018 Test Election'
        };*/
        /*$rootScope.elections = [
          {
            ElectionID: 1,
            ElectionName: '2018 Test Election'
          },
          {
            ElectionID: 2,
            ElectionName: '2018 Test Election 2'
          }
        ]*/
        $scope.setElection = function() {
          $rootScope.election = $scope.selectedElection;
          $rootScope.election.systems = Election.getSystems({id:$rootScope.election.ElectionID}, afterSystems);
          $rootScope.election.candidates = Candidate.query({electionID:$rootScope.election.ElectionID}/*, function() { localStorage.setItem('election', JSON.stringify($rootScope.election)); }*/);

        };
        if (!$rootScope.election) {$rootScope.election = $rootScope.elections[0];}
        if (!$scope.selectedElection) {$scope.selectedElection = $rootScope.elections[0];}
        //localStorage.setItem('election', JSON.stringify($rootScope.election));
        var afterSystems = function(){
          $scope.$broadcast('systemsLoaded');
        //  $rootScope.nextPage = $rootScope.election.systems[currentPage+1 || 0]
        //  localStorage.setItem('election', JSON.stringify($rootScope.election));
        //  console.log($rootScope.nextPage)
      };
        $rootScope.election.systems = Election.getSystems({id:$rootScope.election.ElectionID}, afterSystems);
        $rootScope.election.candidates = Candidate.query({electionID:$rootScope.election.ElectionID}/*, function() { localStorage.setItem('election', JSON.stringify($rootScope.election)); }*/);
        $rootScope.voteViewGoTo = function(page) {
        //  $state.go('vote.fptp');
        };
        $rootScope.sortNextPage = function(scope) {
          scope.$on('systemsLoaded', function() {
            $rootScope.currentPage ++;
            if ($rootScope.currentPage +1 < $rootScope.election.systems.length) {
              $rootScope.nextPage=$rootScope.election.systems[$rootScope.currentPage+1];
            } else {
              $rootScope.nextPage={SystemShortName: "thankyou"};
            }
            document.body.scrollTop = document.documentElement.scrollTop = 0;
          });
        };
      }
      Election.query().$promise.then(onElectionsGot);
    });
})();
