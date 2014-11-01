'use strict';

/**
 * @ngdoc function
 * @name bathHackApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the bathHackApp
 */
angular.module('bathHackApp').controller('SearchCtrl', ['$scope', 'expenseService', "$routeParams",
    function ($scope, expenseService, $routeParams) {

    $scope.fields = expenseService.dataFields
    $scope.company = $routeParams.company;

    $scope.upVote = function(expense) {
        expense.Votes = expense.Votes + 1;
        expenseService.upVoteExpense(expense);
    }
}]);