(function(){
  'use strict';

  angular.module('agora')
    .controller('electionCandidateAdminController', function($scope, $rootScope, $state, Candidate, Party, Election, ElectionCandidateLink){
      if (!$rootScope.election) {$state.go('electionAdmin')}
      $scope.showAdmin = true
      $scope.navBar = function(state) {
        for (var prop in $rootScope) {
          if (typeof $rootScope[prop] !== 'function' && prop.indexOf('$') == -1 && prop.indexOf('$$') == -1) {delete $rootScope[prop];}
        }
        for (var prop in $scope) {
          if (typeof $scope[prop] !== 'function' && prop.indexOf('$') == -1 && prop.indexOf('$$') == -1) {delete $scope[prop];}
        }
        $state.transitionTo(state, {}, {reload: true, inherit: false, notify: true})
      }
      $scope.currentUser = {
        id: 125,
        DisplayName: 'Mr S Balderson'
      };
      $scope.links = ElectionCandidateLink.query({electionID: $rootScope.election.ElectionID})
      $scope.candidates = Candidate.query();
      $scope.parties = Party.query();
      $scope.newParty = new Party();
      $scope.newCandidate = new Candidate();
      $scope.addLink = function(){
        console.log("Linking")
        var newLink = new ElectionCandidateLink()
        newLink.CandidateID = $scope.newCandidate.CandidateID
        newLink.PartyID = $scope.newParty.PartyID
        newLink.ElectionID = $rootScope.election.ElectionID
        ElectionCandidateLink.save(newLink, function(){
          delete $scope.newElection;
          $scope.newParty = new Party();
          $scope.newCandidate = new Candidate();
          $scope.links = ElectionCandidateLink.query({electionID: $rootScope.election.ElectionID})
        });
        [newLink.CandidateName,newLink.PartyName,newLink.partyColor,newLink.pathToLogo] = [$scope.newCandidate.CandidateName, $scope.newParty.PartyName, $scope.newParty.PartyColor, $scope.newParty.PathToLogo]
        $scope.links.push(newLink)
      };
      $scope.deleteLink = function(linkID,rowNumber){
        Election.delete({id: linkID});
        $scope.links.splice(rowNumber,1)
      }
    })
})();
