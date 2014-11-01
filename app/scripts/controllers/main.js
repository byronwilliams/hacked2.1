'use strict';

/**
 * @ngdoc function
 * @name bathHackApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the bathHackApp
 */
angular.module('bathHackApp').controller('MainCtrl', ['$scope', 'expenseService', "$routeParams",
    function ($scope, expenseService, $routeParams) {

    $scope.fields = expenseService.dataFields
    $scope.SAC = $routeParams.SAC;

    /*
        Make a call to get expense
    */
    $scope.getExpenseData = function(){
        $scope.expenses = expenseService.getExpenseData($scope.SAC);
    };
    $scope.getExpenseData();

    $scope.upVote = function(expense) {
        expense.Votes = expense.Votes + 1;
        expenseService.upVoteExpense(expense);
    }
}]);