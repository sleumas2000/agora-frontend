(function(){
  'use strict';

  angular.module('agora')
    .controller('voteController', function($scope, $rootScope, $state, User, Election, Candidate){
      if (!$rootScope.currentUser) $state.go('login')
      $scope.showAdmin = true
      $scope.navBar = function(state) {
        for (var prop in $rootScope) {
          if (typeof $rootScope[prop] !== 'function' && prop !== "currentUser" && prop !== "token" && prop.indexOf('$') == -1 && prop.indexOf('$$') == -1) {delete $rootScope[prop];}
        }
        for (var prop in $scope) {
          if (typeof $scope[prop] !== 'function' && prop.indexOf('$') == -1 && prop.indexOf('$$') == -1) {delete $scope[prop];}
        }
        $state.transitionTo(state, {}, {reload: true, inherit: false, notify: true})
      }
      function onElectionsGot(values) {
        console.log(values);
        $rootScope.elections = values;
        $rootScope.$on('goBackHome', function() {
          $state.go('vote');
        });
        $scope.users = User.query();
        $scope.setElection = function() {
          $rootScope.election = $scope.selectedElection;
          $rootScope.election.systems = Election.getSystems({id:$rootScope.election.ElectionID}, afterSystems);
          $rootScope.election.candidates = Candidate.getByElection({electionID:$rootScope.election.ElectionID}/*, function() { localStorage.setItem('election', JSON.stringify($rootScope.election)); }*/);
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
        $rootScope.election.candidates = Candidate.getByElection({electionID:$rootScope.election.ElectionID}/*, function() { localStorage.setItem('election', JSON.stringify($rootScope.election)); }*/);
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
      Election.query({token: $rootScope.token}).$promise.then(onElectionsGot);
    });
})();
