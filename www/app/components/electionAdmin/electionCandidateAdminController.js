(function(){
  'use strict';

  angular.module('agora')
    .controller('electionCandidateAdminController', function($scope, Election, System){

      $scope.user = {
        id: 125,
        DisplayName: 'Mr S Balderson'
      };
      $scope.elections = Election.query();
      $scope.systems = System.query()
      $scope.newSystems = []
      $scope.toggleSystem = function (s){
        var k = ($scope.newSystems.indexOf(s.SystemID))
        if (k == -1){
          $scope.newSystems.push(s.SystemID)
        } else {
          $scope.newSystems.splice(k,1)
        }
      }
      $scope.newElection = new Election();
      $scope.addElection = function(){
        console.log("Submitting")
        console.log($scope.newElection)
        $scope.newElection.systems = $scope.newSystems
        $scope.elections.splice($scope.elections.length,0,$scope.newElection)
        delete $scope.newElection.systems
        Election.save($scope.newElection, function(insertedRow){
          console.log(insertedRow.ElectionID)
          Election.setSystems({id: insertedRow.ElectionID, systemIDs: JSON.stringify($scope.newSystems)}, function(){
            delete $scope.newElection;
            $scope.newElection = new Election();
            $scope.elections = Election.query();
          })
        });
      };
      $scope.deleteElection = function(electionID,rowNumber){
        Election.delete({id: electionID});
        $scope.elections.splice(rowNumber,1)
      }
      $scope.activate = function(election) {
        console.log(election)
        Election.activate({id: election.ElectionID})
        election.Active.data[0] = 1
        console.log(election)
      }
      $scope.deactivate = function(election) {
        console.log(election)
       election.Active.data[0] = 0
        Election.deactivate({id: election.ElectionID})
        console.log(election)
      }
    })
})();
