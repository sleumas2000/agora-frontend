(function(){
  var app = angular.module('agora-vote', ['ngResource']);
  app.controller('BallotController', function(){
    this.pages = ["login","intro"];
    this.currentPage = "login";
    this.getName = function(){
      return
    }
  })
  .directive('ballotPanel', function() {
    return {
      templateUrl: function(elem, attr) {
        console.log(attr)
        return 'ballot-' + attr.$attr.pageName + '.html';
      }
    };
  });
})();
