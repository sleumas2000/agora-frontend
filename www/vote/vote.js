(function(){
  var app = angular.module('agora-vote', []);
  app.controller('BallotController', function(){
    this.pages = [{name:"Login"},{name:"Intro"}];
    this.currentPage = "Intro";
    this.testString="test"
    this.getName = function(){
      return
    }
  });
  app.directive('ballotPanel', function() {
  return {
    templateUrl: function(elem, attr) {
      return 'ballot-' + attr.pageName + '.html';
    }
  };
});
})();
