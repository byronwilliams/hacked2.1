'use strict';

/**
 * @ngdoc function
 * @name bathHackApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the bathHackApp
 */
angular.module('bathHackApp').controller('MainCtrl', ['$scope', "$routeParams", "expenseService", 
    function ($scope, $routeParams, expenseService) {

        $scope.years = ['2012', '2013', '2014'];
        $scope.months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];

        $scope.selectYear = function(year) {
            $scope.selectedYear = year;
            $scope.search();
        };

        $scope.selectMonth = function(month) {
            $scope.selectedMonth = month;
            $scope.search();
        };

        $scope.reset = function() {
            // TODO
            $scope.results = [];
            $scope.selectedYear = null;
            $scope.selectedMonth = null;

        };

        $scope.search = function() {
            // search by year and month
            $scope.results = expenseService.getExpenseData(null);
        }

}]);