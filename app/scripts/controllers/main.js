'use strict';

/**
 * @ngdoc function
 * @name bathHackApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the bathHackApp
 */
angular.module('bathHackApp').controller('MainCtrl', ['$scope', "$routeParams", "$location", "expenseService", 
    function ($scope, $routeParams, $location, expenseService) {

        $scope.years = ['2011', '2012', '2013', '2014'];
        $scope.months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];

        $scope.fields = expenseService.dataFields
        $scope.company = $routeParams.company;

        $scope.selectYear = function(year) {
            $scope.selectedYear = year;
            $scope.search();
        };

        $scope.selectMonth = function(month) {
            $scope.selectedMonth = month;
            $scope.search();
        };

        $scope.reset = function() {
            $scope.expenses = [];
            $scope.selectedYear = null;
            $scope.selectedMonth = null;
            $location.path('/');
        };

        $scope.search = function() {
            // search by year and month
            expenseService.getExpenseData($scope.selectedYear, $scope.selectedMonth, $scope.company)
            .success(function(data) {
                console.log(data)
                $scope.expenses = data;
            });
        }
        $scope.search();
        $scope.upVote = function(expense) {
            expense.Votes = expense.Votes + 1;
            expenseService.upVoteExpense(expense);
        }

}]);