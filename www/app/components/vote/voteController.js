(function(){
  'use strict';

  angular.module('agora')
    .controller('voteController', function($scope, User){

      $scope.user = {
        id: 125,
        salutation: 'Mr S Balderson'
      };
      $scope.users = User.query();
    })
})();
