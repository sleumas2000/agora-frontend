(function(){
  'use strict';

  angular.module('agora')
    .controller('candidateAdminController', function($scope, $rootScope, $state, Candidate, Party){
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
      $scope.candidates = Candidate.query();
      $scope.parties = Party.query();
      $scope.newCandidate = new Candidate();
      $scope.newParty = new Party()
      $scope.addCandidate = function(){
        console.log("Submitting")
        console.log($scope.newCandidate)
        $scope.candidates.splice($scope.candidates.length,0,$scope.newCandidate)
        Candidate.save($scope.newCandidate, function(){
          delete $scope.newCandidate;
          $scope.newCandidate = new Candidate();
          $scope.candidates = Candidate.query();
        });
      };
      $scope.deleteCandidate = function(candidateID,rowNumber){
        Candidate.delete({id: candidateID});
        $scope.candidates.splice(rowNumber,1)
      }
      $scope.addParty = function(){
        console.log("Submitting")
        console.log($scope.newParty)
        $scope.parties.splice($scope.parties.length,0,$scope.newParty)
        Party.save($scope.newParty, function(){
          $scope.parties = Party.query();
          delete $scope.newParty;
          $scope.newParty = new Party();
        });
      };
      $scope.deleteParty = function(partyID,rowNumber){
        Party.delete({id: partyID});
        $scope.parties.splice(rowNumber,1)
      }
    })
})();
